export const STORAGE_SCHEMA_VERSION = 1;

export const storageKeys = {
  budgets: 'pocket-budget.budget-goals',
  categoryLearning: 'pocket-budget.category-learning',
  currency: 'pocket-budget.currency',
  savingsGoals: 'pocket-budget.savings-goals',
  transactions: 'pocket-budget.transactions'
};

export function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function safeParseJson(value, fallbackValue = null) {
  try {
    return value ? JSON.parse(value) : fallbackValue;
  } catch (error) {
    console.warn('Unable to parse stored JSON.', error);
    return fallbackValue;
  }
}

export function readStorageValue(key, fallbackValue = null) {
  if (!canUseStorage()) {
    return fallbackValue;
  }

  try {
    return safeParseJson(window.localStorage.getItem(key), fallbackValue);
  } catch (error) {
    console.warn(`Unable to read ${key} from LocalStorage.`, error);
    return fallbackValue;
  }
}

export function writeStorageValue(key, value) {
  if (!canUseStorage()) {
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

export function removeStorageValue(key) {
  if (!canUseStorage()) {
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

// TODO: Swap this adapter for IndexedDB/cloud sync when optional multi-device backup exists.
