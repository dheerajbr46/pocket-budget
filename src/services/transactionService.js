import { mockTransactions } from '../data/mockTransactions.js';
import { RECURRENCE_TYPES } from '../constants/recurrenceTypes.js';
import {
  clearStoredTransactions,
  getStoredTransactions,
  saveStoredTransactions
} from '../utils/storage/index.js';
import { generateRecurringTransactions } from '../utils/transactions/index.js';
import { toDateInputValue } from '../utils/dates/index.js';

export { generateRecurringTransactions };

export function createTransaction(formValues) {
  const isRecurring = Boolean(formValues.isRecurring);
  const date = formValues.date;
  const id = `txn_${crypto.randomUUID()}`;
  const recurrenceFrequency = isRecurring
    ? formValues.recurrenceFrequency || formValues.recurrenceType || RECURRENCE_TYPES.MONTHLY
    : undefined;

  return {
    ...formValues,
    generatedFromRecurringId: undefined,
    id,
    amount: Number(formValues.amount),
    date,
    isRecurring,
    lastGeneratedDate: isRecurring ? date : undefined,
    nextOccurrenceDate: undefined,
    note: formValues.note.trim(),
    recurrenceStartDate: isRecurring ? formValues.recurrenceStartDate || date : undefined,
    recurrenceEndDate: isRecurring ? formValues.recurrenceEndDate || undefined : undefined,
    recurrenceFrequency,
    recurrenceType: undefined,
    recurringSeriesId: isRecurring ? id : undefined,
    createdAt: new Date().toISOString()
  };
}

export function getInitialTransactions() {
  return generateRecurringTransactions(getStoredTransactions() ?? mockTransactions);
}

export function persistTransactions(transactions) {
  return saveStoredTransactions(transactions);
}

export function clearTransactions() {
  return clearStoredTransactions();
}

export function addTransaction(transactions, transaction) {
  return [transaction, ...transactions];
}

export function duplicateTransaction(transactions, transaction) {
  const duplicate = createTransaction({
    type: transaction.type,
    amount: transaction.amount,
    category: transaction.category,
    note: transaction.note,
    date: toDateInputValue()
  });

  return [duplicate, ...transactions];
}

export function updateTransaction(transactions, updatedTransaction) {
  return transactions.map((transaction) =>
    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
  );
}

export function deleteTransaction(transactions, transactionId) {
  return transactions.filter((transaction) => transaction.id !== transactionId);
}

export function sortTransactionsByDate(transactions) {
  return [...transactions].sort((firstTransaction, secondTransaction) => {
    const firstDate = new Date(`${firstTransaction.date}T00:00:00`).getTime();
    const secondDate = new Date(`${secondTransaction.date}T00:00:00`).getTime();

    if (firstDate !== secondDate) {
      return secondDate - firstDate;
    }

    const firstTime = new Date(firstTransaction.createdAt || firstTransaction.date).getTime();
    const secondTime = new Date(secondTransaction.createdAt || secondTransaction.date).getTime();

    return secondTime - firstTime;
  });
}

export function getRecentTransactions(transactions, count = 5) {
  return sortTransactionsByDate(transactions).slice(0, count);
}

export function filterTransactions(transactions, activeFilter, searchTerm) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return sortTransactionsByDate(transactions).filter((transaction) => {
    const matchesType = activeFilter === 'all' || transaction.type === activeFilter;
    const matchesSearch =
      !normalizedSearch ||
      transaction.note.toLowerCase().includes(normalizedSearch) ||
      transaction.category.toLowerCase().includes(normalizedSearch);

    return matchesType && matchesSearch;
  });
}

export function groupTransactionsByDate(transactions) {
  return transactions.reduce((groups, transaction) => {
    const existingGroup = groups.find((group) => group.date === transaction.date);

    if (existingGroup) {
      existingGroup.transactions.push(transaction);
    } else {
      groups.push({ date: transaction.date, transactions: [transaction] });
    }

    return groups;
  }, []);
}
