import { areValidBudgetGoals } from '../budgets/index.js';
import { areValidSavingsGoals } from '../savings/index.js';
import {
  readStorageValue,
  removeStorageValue,
  storageKeys,
  writeStorageValue
} from '../../services/storageService.js';

export function isValidTransaction(transaction) {
  const hasValidRecurringFields =
    typeof transaction.isRecurring === 'undefined' ||
    (typeof transaction.isRecurring === 'boolean' &&
      (typeof transaction.recurrenceFrequency === 'undefined' ||
        ['weekly', 'biweekly', 'monthly', 'yearly'].includes(transaction.recurrenceFrequency)) &&
      (typeof transaction.recurrenceType === 'undefined' ||
        ['daily', 'weekly', 'biweekly', 'monthly', 'yearly'].includes(transaction.recurrenceType)) &&
      (typeof transaction.recurrenceStartDate === 'undefined' ||
        typeof transaction.recurrenceStartDate === 'string') &&
      (typeof transaction.recurrenceEndDate === 'undefined' ||
        transaction.recurrenceEndDate === '' ||
        typeof transaction.recurrenceEndDate === 'string') &&
      (typeof transaction.nextOccurrenceDate === 'undefined' ||
        typeof transaction.nextOccurrenceDate === 'string') &&
      (typeof transaction.lastGeneratedDate === 'undefined' ||
        typeof transaction.lastGeneratedDate === 'string') &&
      (typeof transaction.generatedFromRecurringId === 'undefined' ||
        typeof transaction.generatedFromRecurringId === 'string') &&
      (typeof transaction.recurringSeriesId === 'undefined' ||
        typeof transaction.recurringSeriesId === 'string') &&
      (typeof transaction.recurringTransactionId === 'undefined' ||
        typeof transaction.recurringTransactionId === 'string'));

  return (
    transaction &&
    typeof transaction.id === 'string' &&
    (transaction.type === 'income' || transaction.type === 'expense') &&
    typeof transaction.amount === 'number' &&
    Number.isFinite(transaction.amount) &&
    transaction.amount > 0 &&
    typeof transaction.category === 'string' &&
    typeof transaction.note === 'string' &&
    typeof transaction.date === 'string' &&
    typeof transaction.createdAt === 'string' &&
    hasValidRecurringFields
  );
}

export function areValidTransactions(transactions) {
  return Array.isArray(transactions) && transactions.every(isValidTransaction);
}

export function getLocalStorageItem(key, fallbackValue = null) {
  return readStorageValue(key, fallbackValue);
}

export function saveLocalStorageItem(key, value) {
  return writeStorageValue(key, value);
}

export function removeLocalStorageItem(key) {
  return removeStorageValue(key);
}

export function getStoredTransactions() {
  const parsedValue = getLocalStorageItem(storageKeys.transactions, null);

  if (!parsedValue) {
    return null;
  }

  if (!areValidTransactions(parsedValue)) {
    clearStoredTransactions();
    return null;
  }

  return parsedValue;
}

export function saveStoredTransactions(transactions) {
  return saveLocalStorageItem(storageKeys.transactions, transactions);
}

export function clearStoredTransactions() {
  return removeLocalStorageItem(storageKeys.transactions);
}

export function getStoredCurrency() {
  return readStorageValue(storageKeys.currency, 'USD');
}

export function saveStoredCurrency(currency) {
  return writeStorageValue(storageKeys.currency, currency);
}

export function getStoredBudgetGoals() {
  const parsedValue = getLocalStorageItem(storageKeys.budgets, null);

  if (!parsedValue) {
    return null;
  }

  if (!areValidBudgetGoals(parsedValue)) {
    clearStoredBudgetGoals();
    return null;
  }

  return parsedValue;
}

export function saveStoredBudgetGoals(budgets) {
  return saveLocalStorageItem(storageKeys.budgets, budgets);
}

export function clearStoredBudgetGoals() {
  return removeLocalStorageItem(storageKeys.budgets);
}

export function getStoredSavingsGoals() {
  const parsedValue = getLocalStorageItem(storageKeys.savingsGoals, null);

  if (!parsedValue) {
    return null;
  }

  if (!areValidSavingsGoals(parsedValue)) {
    clearStoredSavingsGoals();
    return null;
  }

  return parsedValue;
}

export function saveStoredSavingsGoals(goals) {
  return saveLocalStorageItem(storageKeys.savingsGoals, goals);
}

export function clearStoredSavingsGoals() {
  return removeLocalStorageItem(storageKeys.savingsGoals);
}

export function getStoredCategoryLearning() {
  const parsedValue = getLocalStorageItem(storageKeys.categoryLearning, {});

  if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue)) {
    clearStoredCategoryLearning();
    return {};
  }

  return parsedValue;
}

export function saveStoredCategoryLearning(learningMap) {
  return saveLocalStorageItem(storageKeys.categoryLearning, learningMap);
}

export function clearStoredCategoryLearning() {
  return removeLocalStorageItem(storageKeys.categoryLearning);
}
