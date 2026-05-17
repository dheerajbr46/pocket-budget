import { RECURRENCE_TYPES } from '../constants/recurrenceTypes.js';
import { toDateInputValue } from '../utils/dates/index.js';
import {
  addMonths,
  compareDateValues,
  generateOccurrencesBetween,
  getNextRecurringDate,
  normalizeRecurrenceFrequency
} from '../utils/recurrence/index.js';

export { getNextRecurringDate };

const GENERATION_WINDOW_MONTHS = 2;
const MAX_GENERATED_OCCURRENCES_PER_SERIES = 20;

function createId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function isRecurringTemplate(transaction) {
  return Boolean(transaction?.isRecurring && !transaction.generatedFromRecurringId);
}

export function isRecurringRelated(transaction) {
  return Boolean(transaction?.isRecurring || transaction?.generatedFromRecurringId);
}

export function getRecurringSeriesId(transaction) {
  return (
    transaction.recurringSeriesId ||
    transaction.generatedFromRecurringId ||
    transaction.recurringTransactionId ||
    transaction.id
  );
}

export function migrateRecurringTransaction(transaction) {
  if (!transaction) {
    return transaction;
  }

  const isRecurring = Boolean(transaction.isRecurring);
  const generatedFromRecurringId =
    transaction.generatedFromRecurringId || transaction.recurringTransactionId || undefined;
  const recurrenceFrequency = isRecurring
    ? normalizeRecurrenceFrequency(transaction.recurrenceFrequency || transaction.recurrenceType)
    : undefined;
  const recurringSeriesId =
    transaction.recurringSeriesId ||
    generatedFromRecurringId ||
    (isRecurring ? transaction.id : undefined);
  const recurrenceStartDate =
    isRecurring ? transaction.recurrenceStartDate || transaction.date : undefined;
  const lastGeneratedDate =
    isRecurring && !generatedFromRecurringId
      ? transaction.lastGeneratedDate || transaction.date
      : transaction.lastGeneratedDate;
  const nextOccurrenceDate =
    isRecurring && !generatedFromRecurringId
      ? transaction.nextOccurrenceDate ||
        getNextRecurringDate(lastGeneratedDate || transaction.date, recurrenceFrequency, recurrenceStartDate)
      : transaction.nextOccurrenceDate;

  return {
    ...transaction,
    generatedFromRecurringId,
    isRecurring,
    lastGeneratedDate,
    nextOccurrenceDate,
    recurrenceEndDate: transaction.recurrenceEndDate || undefined,
    recurrenceFrequency,
    recurrenceStartDate,
    recurringSeriesId
  };
}

export function migrateRecurringTransactions(transactions) {
  return transactions.map(migrateRecurringTransaction);
}

function getSeriesDateKey(transaction) {
  return `${getRecurringSeriesId(transaction)}:${transaction.date}`;
}

function getLatestSeriesDate(transactions, seriesId, fallbackDate) {
  return transactions
    .filter((transaction) => getRecurringSeriesId(transaction) === seriesId)
    .reduce((latestDate, transaction) => {
      if (!latestDate || compareDateValues(transaction.date, latestDate) > 0) {
        return transaction.date;
      }

      return latestDate;
    }, fallbackDate);
}

export function shouldGenerateRecurringTransaction(template, targetDate, existingTransactions, today = new Date()) {
  if (!isRecurringTemplate(template) || !template.recurrenceFrequency) {
    return false;
  }

  const todayValue = toDateInputValue(today);
  const windowEndDate = addMonths(todayValue, GENERATION_WINDOW_MONTHS);
  const seriesId = getRecurringSeriesId(template);
  const isOnOrAfterStart = compareDateValues(targetDate, template.recurrenceStartDate || template.date) >= 0;
  const isOnOrBeforeEnd =
    !template.recurrenceEndDate || compareDateValues(targetDate, template.recurrenceEndDate) <= 0;
  const hasExistingOccurrence = existingTransactions.some(
    (transaction) => getRecurringSeriesId(transaction) === seriesId && transaction.date === targetDate
  );

  return (
    compareDateValues(targetDate, windowEndDate) <= 0 &&
    isOnOrAfterStart &&
    isOnOrBeforeEnd &&
    !hasExistingOccurrence
  );
}

export function generateRecurringTransactions(transactions, today = new Date()) {
  const todayValue = toDateInputValue(today);
  const windowEndDate = addMonths(todayValue, GENERATION_WINDOW_MONTHS);
  const migratedTransactions = migrateRecurringTransactions(transactions);
  const existingKeys = new Set(migratedTransactions.map(getSeriesDateKey));
  const generatedTransactions = [];

  const updatedTransactions = migratedTransactions.map((transaction) => {
    if (!isRecurringTemplate(transaction) || !transaction.recurrenceFrequency) {
      return transaction;
    }

    const seriesId = getRecurringSeriesId(transaction);
    const anchorDate = transaction.recurrenceStartDate || transaction.date;

    if (compareDateValues(anchorDate, todayValue) > 0) {
      return {
        ...transaction,
        lastGeneratedDate: undefined,
        nextOccurrenceDate: anchorDate,
        recurrenceStartDate: anchorDate,
        recurringSeriesId: seriesId
      };
    }

    const occurrenceDates = generateOccurrencesBetween({
      existingTransactions: [...migratedTransactions, ...generatedTransactions],
      maxOccurrences: MAX_GENERATED_OCCURRENCES_PER_SERIES,
      seriesId,
      template: transaction,
      windowEndDate,
      windowStartDate: anchorDate
    });
    let lastGeneratedDate = getLatestSeriesDate(migratedTransactions, seriesId, transaction.date);

    occurrenceDates.forEach((nextDate) => {
      const occurrenceKey = `${seriesId}:${nextDate}`;

      if (!existingKeys.has(occurrenceKey)) {
        generatedTransactions.push({
          ...transaction,
          id: createId('txn'),
          date: nextDate,
          createdAt: new Date().toISOString(),
          generatedFromRecurringId: seriesId,
          isRecurring: false,
          lastGeneratedDate: undefined,
          nextOccurrenceDate: undefined,
          recurringSeriesId: seriesId
        });
        existingKeys.add(occurrenceKey);
      }

      lastGeneratedDate = nextDate;
    });

    const nextOccurrenceDate =
      transaction.recurrenceEndDate &&
      compareDateValues(getNextRecurringDate(lastGeneratedDate, transaction.recurrenceFrequency, anchorDate), transaction.recurrenceEndDate) > 0
        ? undefined
        : getNextRecurringDate(lastGeneratedDate, transaction.recurrenceFrequency, anchorDate);

    return {
      ...transaction,
      lastGeneratedDate,
      nextOccurrenceDate,
      recurrenceStartDate: anchorDate,
      recurringSeriesId: seriesId
    };
  });

  return [...generatedTransactions, ...updatedTransactions];
}

export function getUpcomingRecurringTransactions(transactions, limit = 5, today = new Date()) {
  const todayValue = toDateInputValue(today);
  const migratedTransactions = migrateRecurringTransactions(transactions);
  const generatedUpcoming = migratedTransactions
    .filter((transaction) => transaction.generatedFromRecurringId)
    .filter((transaction) => compareDateValues(transaction.date, todayValue) >= 0)
    .map((transaction) => ({
      ...transaction,
      nextDate: transaction.date,
      nextOccurrenceDate: transaction.date
    }));
  const generatedKeys = new Set(generatedUpcoming.map((transaction) => `${getRecurringSeriesId(transaction)}:${transaction.date}`));

  const templateUpcoming = migratedTransactions
    .filter((transaction) => isRecurringTemplate(transaction) && transaction.recurrenceFrequency)
    .map((transaction) => {
      const anchorDate = transaction.recurrenceStartDate || transaction.date;
      let nextDate = transaction.nextOccurrenceDate || transaction.lastGeneratedDate || transaction.date;

      while (compareDateValues(nextDate, todayValue) < 0) {
        nextDate = getNextRecurringDate(nextDate, transaction.recurrenceFrequency, anchorDate);
      }

      if (transaction.recurrenceEndDate && compareDateValues(nextDate, transaction.recurrenceEndDate) > 0) {
        return null;
      }

      return {
        ...transaction,
        nextDate,
        nextOccurrenceDate: nextDate
      };
    })
    .filter(Boolean)
    .filter((transaction) => !generatedKeys.has(`${getRecurringSeriesId(transaction)}:${transaction.nextDate}`));

  return [...generatedUpcoming, ...templateUpcoming]
    .sort((firstTransaction, secondTransaction) => compareDateValues(firstTransaction.nextDate, secondTransaction.nextDate))
    .slice(0, limit);
}

export function getUpcomingRecurringTotals(transactions, today = new Date()) {
  const upcoming = getUpcomingRecurringTransactions(transactions, 50, today);
  const todayDate = new Date(today);
  const weekEnd = new Date(todayDate);
  weekEnd.setDate(todayDate.getDate() + 7);
  const monthEnd = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 1);

  return upcoming.reduce(
    (totals, transaction) => {
      const dueDate = new Date(`${transaction.nextDate}T00:00:00`);
      const signedAmount = transaction.type === 'income' ? transaction.amount : -transaction.amount;

      if (dueDate <= weekEnd) {
        totals.week += signedAmount;
      }

      if (dueDate < monthEnd) {
        totals.month += signedAmount;
      }

      return totals;
    },
    { month: 0, week: 0 }
  );
}

export function getFrequencyLabel(value) {
  const normalizedFrequency = normalizeRecurrenceFrequency(value);

  if (normalizedFrequency === RECURRENCE_TYPES.BIWEEKLY) {
    return 'Biweekly';
  }

  return normalizedFrequency.charAt(0).toUpperCase() + normalizedFrequency.slice(1);
}

// TODO: Add recurring notifications, recurring calendar view, forecasting engine, and financial goals.
// TODO: Add pause recurring series, edit single occurrence, and edit entire series workflows.
// TODO: Add multi-device sync hooks once cloud sync exists.
// TODO: Add Splitwise support hooks for shared recurring bills.
