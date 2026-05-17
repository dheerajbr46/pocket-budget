import {
  getMonthStart,
  getNextMonthStart,
  getWeekStart,
  isWithinRange,
  toDateInputValue
} from '../dates/index.js';
import { formatShortDate } from '../formatting/index.js';
export {
  generateRecurringTransactions,
  getNextRecurringDate,
  getUpcomingRecurringTotals,
  getUpcomingRecurringTransactions,
  isRecurringRelated,
  shouldGenerateRecurringTransaction
} from '../../services/recurringService.js';

function sortTransactionsByDate(transactions) {
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

export function formatRelativeTransactionDate(value, today = new Date()) {
  const todayValue = toDateInputValue(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (value === todayValue) {
    return 'Today';
  }

  if (value === toDateInputValue(yesterday)) {
    return 'Yesterday';
  }

  return formatShortDate(value);
}

export function formatUpcomingDueDate(value, today = new Date()) {
  const todayValue = toDateInputValue(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (value === todayValue) {
    return 'Today';
  }

  if (value === toDateInputValue(tomorrow)) {
    return 'Tomorrow';
  }

  return formatShortDate(value);
}

export function getTransactionAccentStyle(type) {
  return type === 'income' ? 'border-l-mint' : 'border-l-coral';
}

export function getCategoryChipStyle(type) {
  return type === 'income'
    ? 'bg-teal-50 text-teal-700'
    : 'bg-rose-50 text-rose-700';
}

export function filterTransactions(
  transactions,
  {
    category = 'all',
    dateRange = 'all',
    searchTerm = '',
    type = 'all'
  } = {},
  today = new Date()
) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const currentWeekStart = getWeekStart(today);
  const currentMonthStart = getMonthStart(today);
  const nextMonthStart = getNextMonthStart(today);

  return sortTransactionsByDate(transactions).filter((transaction) => {
    const matchesType = type === 'all' || transaction.type === type;
    const matchesCategory = category === 'all' || transaction.category === category;
    const matchesSearch =
      !normalizedSearch ||
      transaction.note.toLowerCase().includes(normalizedSearch) ||
      transaction.category.toLowerCase().includes(normalizedSearch) ||
      String(transaction.amount).includes(normalizedSearch);
    const matchesDateRange =
      dateRange === 'all' ||
      (dateRange === 'week' && isWithinRange(transaction.date, currentWeekStart, new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1))) ||
      (dateRange === 'month' && isWithinRange(transaction.date, currentMonthStart, nextMonthStart));

    return matchesType && matchesCategory && matchesSearch && matchesDateRange;
  });
}

export function calculateFilteredTransactionSummary(transactions) {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount;
      } else {
        summary.expenses += transaction.amount;
      }

      summary.count += 1;
      summary.net = summary.income - summary.expenses;
      return summary;
    },
    { count: 0, expenses: 0, income: 0, net: 0 }
  );
}

export function getTransactionGroupNetAmount(transactions) {
  return calculateFilteredTransactionSummary(transactions).net;
}

export function groupTransactionsByFriendlyDate(transactions, today = new Date()) {
  const todayValue = toDateInputValue(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayValue = toDateInputValue(yesterday);
  const weekStart = getWeekStart(today);
  const groups = [];

  sortTransactionsByDate(transactions).forEach((transaction) => {
    const transactionDate = new Date(`${transaction.date}T00:00:00`);
    let id = 'older';
    let label = 'Older';

    if (transaction.date === todayValue) {
      id = 'today';
      label = 'Today';
    } else if (transaction.date === yesterdayValue) {
      id = 'yesterday';
      label = 'Yesterday';
    } else if (transactionDate >= weekStart) {
      id = 'this-week';
      label = 'This Week';
    }

    const existingGroup = groups.find((group) => group.id === id);

    if (existingGroup) {
      existingGroup.transactions.push(transaction);
    } else {
      groups.push({ id, label, transactions: [transaction] });
    }
  });

  return groups;
}
