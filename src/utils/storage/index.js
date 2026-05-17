import { areValidBudgetGoals } from '../budgets/index.js';

const TRANSACTIONS_STORAGE_KEY = 'pocket-budget.transactions';
const CURRENCY_STORAGE_KEY = 'pocket-budget.currency';
const BUDGET_GOALS_STORAGE_KEY = 'pocket-budget.budget-goals';

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

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
  if (!canUseLocalStorage()) {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch (error) {
    console.warn(`Unable to read ${key} from LocalStorage.`, error);
    return fallbackValue;
  }
}

export function saveLocalStorageItem(key, value) {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Unable to save ${key} to LocalStorage.`, error);
    return false;
  }
}

export function removeLocalStorageItem(key) {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Unable to remove ${key} from LocalStorage.`, error);
    return false;
  }
}

export function getStoredTransactions() {
  const parsedValue = getLocalStorageItem(TRANSACTIONS_STORAGE_KEY, null);

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
  return saveLocalStorageItem(TRANSACTIONS_STORAGE_KEY, transactions);
}

export function clearStoredTransactions() {
  return removeLocalStorageItem(TRANSACTIONS_STORAGE_KEY);
}

export function getStoredCurrency() {
  if (!canUseLocalStorage()) {
    return 'USD';
  }

  try {
    return window.localStorage.getItem(CURRENCY_STORAGE_KEY) || 'USD';
  } catch (error) {
    console.warn('Unable to read stored currency.', error);
    return 'USD';
  }
}

export function saveStoredCurrency(currency) {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    return true;
  } catch (error) {
    console.warn('Unable to save currency setting.', error);
    return false;
  }
}

export function getStoredBudgetGoals() {
  const parsedValue = getLocalStorageItem(BUDGET_GOALS_STORAGE_KEY, null);

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
  return saveLocalStorageItem(BUDGET_GOALS_STORAGE_KEY, budgets);
}

export function clearStoredBudgetGoals() {
  return removeLocalStorageItem(BUDGET_GOALS_STORAGE_KEY);
}
