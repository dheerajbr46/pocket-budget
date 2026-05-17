import { RECURRENCE_TYPES } from '../../constants/recurrenceTypes.js';
import { toDateInputValue } from '../dates/index.js';
import { formatShortDate } from '../formatting/index.js';

export function parseDateValue(value) {
  return new Date(`${value}T00:00:00`);
}

export function compareDateValues(firstValue, secondValue) {
  return parseDateValue(firstValue).getTime() - parseDateValue(secondValue).getTime();
}

function addDays(value, dayCount) {
  const date = parseDateValue(value);
  date.setDate(date.getDate() + dayCount);
  return toDateInputValue(date);
}

function lastDayOfMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function addMonthsClamped(value, monthCount, anchorValue = value) {
  const currentDate = parseDateValue(value);
  const anchorDay = parseDateValue(anchorValue).getDate();
  const targetYear = currentDate.getFullYear();
  const targetMonth = currentDate.getMonth() + monthCount;
  const targetLastDay = lastDayOfMonth(targetYear, targetMonth);
  const targetDay = Math.min(anchorDay, targetLastDay);

  return toDateInputValue(new Date(targetYear, targetMonth, targetDay));
}

export function addMonths(value, monthCount) {
  return addMonthsClamped(value, monthCount, value);
}

function addYearsClamped(value, yearCount, anchorValue = value) {
  const currentDate = parseDateValue(value);
  const anchorDate = parseDateValue(anchorValue);
  const targetYear = currentDate.getFullYear() + yearCount;
  const targetMonth = anchorDate.getMonth();
  const targetLastDay = lastDayOfMonth(targetYear, targetMonth);
  const targetDay = Math.min(anchorDate.getDate(), targetLastDay);

  return toDateInputValue(new Date(targetYear, targetMonth, targetDay));
}

export function normalizeRecurrenceFrequency(value) {
  if (value === 'daily') {
    return RECURRENCE_TYPES.WEEKLY;
  }

  if (Object.values(RECURRENCE_TYPES).includes(value)) {
    return value;
  }

  return RECURRENCE_TYPES.MONTHLY;
}

export function getNextRecurringDate(currentDate, recurrenceFrequency, anchorDate = currentDate) {
  if (recurrenceFrequency === RECURRENCE_TYPES.WEEKLY) {
    return addDays(currentDate, 7);
  }

  if (recurrenceFrequency === RECURRENCE_TYPES.BIWEEKLY) {
    return addDays(currentDate, 14);
  }

  if (recurrenceFrequency === RECURRENCE_TYPES.YEARLY) {
    return addYearsClamped(currentDate, 1, anchorDate);
  }

  return addMonthsClamped(currentDate, 1, anchorDate);
}

export function getNextOccurrence(currentDate, recurrenceFrequency, anchorDate = currentDate) {
  return getNextRecurringDate(currentDate, recurrenceFrequency, anchorDate);
}

export function shouldGenerateTransaction({
  existingTransactions = [],
  seriesId,
  targetDate,
  template,
  windowEndDate,
  windowStartDate
}) {
  const hasExistingOccurrence = existingTransactions.some(
    (transaction) =>
      (transaction.recurringSeriesId ||
        transaction.generatedFromRecurringId ||
        transaction.recurringTransactionId ||
        transaction.id) === seriesId &&
      transaction.date === targetDate
  );
  const startsOnTime = compareDateValues(targetDate, template.recurrenceStartDate || template.date) >= 0;
  const endsOnTime =
    !template.recurrenceEndDate || compareDateValues(targetDate, template.recurrenceEndDate) <= 0;
  const isWithinWindow =
    compareDateValues(targetDate, windowStartDate) >= 0 &&
    compareDateValues(targetDate, windowEndDate) <= 0;

  return startsOnTime && endsOnTime && isWithinWindow && !hasExistingOccurrence;
}

export function generateOccurrencesBetween({
  existingTransactions = [],
  maxOccurrences = 20,
  seriesId,
  template,
  windowEndDate,
  windowStartDate
}) {
  const occurrences = [];
  const anchorDate = template.recurrenceStartDate || template.date;
  let cursorDate = anchorDate;

  while (compareDateValues(cursorDate, windowStartDate) < 0) {
    cursorDate = getNextOccurrence(cursorDate, template.recurrenceFrequency, anchorDate);
  }

  while (compareDateValues(cursorDate, windowEndDate) <= 0 && occurrences.length < maxOccurrences) {
    if (
      shouldGenerateTransaction({
        existingTransactions,
        seriesId,
        targetDate: cursorDate,
        template,
        windowEndDate,
        windowStartDate
      })
    ) {
      occurrences.push(cursorDate);
    }

    cursorDate = getNextOccurrence(cursorDate, template.recurrenceFrequency, anchorDate);
  }

  return occurrences;
}

export function formatRecurringSummary({ endDate, frequency, startDate }) {
  return getRecurrencePreviewText({
    endDate,
    frequency,
    neverEnds: !endDate,
    startDate
  });
}

export function getRecurrencePreviewText({
  endDate,
  frequency,
  neverEnds = true,
  startDate
}) {
  const normalizedFrequency = normalizeRecurrenceFrequency(frequency);
  const frequencyText =
    normalizedFrequency === RECURRENCE_TYPES.BIWEEKLY
      ? 'every 2 weeks'
      : `every ${normalizedFrequency.replace('ly', '')}`;
  const startText = startDate ? `starting ${formatShortDate(startDate)}` : 'starting today';

  if (!neverEnds && endDate) {
    return `Repeats ${frequencyText} ${startText} until ${formatShortDate(endDate)}`;
  }

  return `Repeats ${frequencyText} ${startText}`;
}

// TODO: Add timezone support, DST handling, and business day adjustments for recurring schedules.
