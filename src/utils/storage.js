const TRANSACTIONS_STORAGE_KEY = 'pocket-budget.transactions';
const CURRENCY_STORAGE_KEY = 'pocket-budget.currency';

export function isValidTransaction(transaction) {
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
    typeof transaction.createdAt === 'string'
  );
}

export function areValidTransactions(transactions) {
  return Array.isArray(transactions) && transactions.every(isValidTransaction);
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getStoredTransactions() {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(TRANSACTIONS_STORAGE_KEY);

    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue);

    if (!areValidTransactions(parsedValue)) {
      clearStoredTransactions();
      return null;
    }

    return parsedValue;
  } catch (error) {
    console.warn('Unable to read stored transactions. Resetting local transaction data.', error);
    clearStoredTransactions();
    return null;
  }
}

export function saveStoredTransactions(transactions) {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.warn('Unable to save transactions locally.', error);
    return false;
  }
}

export function clearStoredTransactions() {
  if (!canUseLocalStorage()) {
    return false;
  }

  try {
    window.localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.warn('Unable to clear stored transactions.', error);
    return false;
  }
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
