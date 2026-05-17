import {
  getMonthStart,
  getNextMonthStart,
  getPreviousMonthStart,
  getWeekStart,
  isOnOrAfter,
  isWithinRange,
  toDateInputValue
} from '../dates/index.js';

function getTransactionsSince(transactions, startDate) {
  return transactions.filter((transaction) => isOnOrAfter(transaction.date, startDate));
}

export function summarizeTransactions(transactions) {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === 'income') {
        summary.income += transaction.amount;
      } else {
        summary.expenses += transaction.amount;
      }

      summary.balance = summary.income - summary.expenses;
      return summary;
    },
    { income: 0, expenses: 0, balance: 0 }
  );
}

export function getTodaySummary(transactions, today = new Date()) {
  const todayValue = toDateInputValue(today);
  return summarizeTransactions(transactions.filter((transaction) => transaction.date === todayValue));
}

export function getWeekSpending(transactions, today = new Date()) {
  return getTransactionsSince(transactions, getWeekStart(today))
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getMonthSpending(transactions, today = new Date()) {
  return getTransactionsSince(transactions, getMonthStart(today))
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getCategorySpendingBreakdown(transactions) {
  const categoryTotals = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((totals, transaction) => {
      totals[transaction.category] = (totals[transaction.category] ?? 0) + transaction.amount;
      return totals;
    }, {});

  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      amount,
      category,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0
    }))
    .sort((firstCategory, secondCategory) => secondCategory.amount - firstCategory.amount);
}

export function getMonthlyCategorySpending(transactions, today = new Date()) {
  return getCategorySpendingBreakdown(getTransactionsSince(transactions, getMonthStart(today)));
}

export function getPeriodReport(transactions, period = 'month', today = new Date()) {
  const startDate = period === 'week' ? getWeekStart(today) : getMonthStart(today);
  const periodTransactions = getTransactionsSince(transactions, startDate);
  const summary = summarizeTransactions(periodTransactions);
  const categories = getCategorySpendingBreakdown(periodTransactions);

  return {
    categories,
    summary,
    topCategory: categories[0] ?? null,
    transactionCount: periodTransactions.length
  };
}

function getCurrentCategoryPeriodRange(period, today = new Date()) {
  if (period === 'week') {
    const start = getWeekStart(today);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return { start, end };
  }

  if (period === 'month') {
    return {
      start: getMonthStart(today),
      end: getNextMonthStart(today)
    };
  }

  return { start: null, end: null };
}

function getPreviousCategoryPeriodRange(period, today = new Date()) {
  if (period === 'week') {
    const currentStart = getWeekStart(today);
    const start = new Date(currentStart);
    start.setDate(currentStart.getDate() - 7);
    return { start, end: currentStart };
  }

  if (period === 'month') {
    return {
      start: getPreviousMonthStart(today),
      end: getMonthStart(today)
    };
  }

  return { start: null, end: null };
}

function filterByPeriod(transactions, period, today = new Date()) {
  if (period === 'all') {
    return transactions;
  }

  const { start, end } = getCurrentCategoryPeriodRange(period, today);
  return transactions.filter((transaction) => isWithinRange(transaction.date, start, end));
}

export function filterTransactionsByCategory(transactions, category, options = {}) {
  const { period = 'all', today = new Date() } = options;

  return filterByPeriod(
    transactions.filter(
      (transaction) => transaction.type === 'expense' && transaction.category === category
    ),
    period,
    today
  ).sort((firstTransaction, secondTransaction) => {
    const firstTime = new Date(firstTransaction.createdAt || firstTransaction.date).getTime();
    const secondTime = new Date(secondTransaction.createdAt || secondTransaction.date).getTime();

    return secondTime - firstTime;
  });
}

export function calculateCategorySummary(transactions, category, options = {}) {
  const { today = new Date() } = options;
  const categoryTransactions = filterTransactionsByCategory(transactions, category);
  const visibleTransactions = filterTransactionsByCategory(transactions, category, options);
  const weeklyTransactions = filterTransactionsByCategory(transactions, category, {
    period: 'week',
    today
  });
  const monthlyTransactions = filterTransactionsByCategory(transactions, category, {
    period: 'month',
    today
  });
  const visibleTotal = visibleTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  const totalSpentThisWeek = weeklyTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  const totalSpentThisMonth = monthlyTransactions.reduce((total, transaction) => total + transaction.amount, 0);
  const largestTransaction =
    visibleTransactions.reduce((largest, transaction) => {
      if (!largest || transaction.amount > largest.amount) {
        return transaction;
      }

      return largest;
    }, null) ?? null;

  return {
    averageTransactionAmount:
      visibleTransactions.length > 0 ? visibleTotal / visibleTransactions.length : 0,
    category,
    largestTransaction,
    periodTransactionCount: visibleTransactions.length,
    totalSpentForPeriod: visibleTotal,
    totalSpentThisMonth,
    totalSpentThisWeek,
    totalTransactionCount: categoryTransactions.length,
    transactions: visibleTransactions
  };
}

export function calculateCategoryTrend(transactions, category, options = {}) {
  const { period = 'month', today = new Date() } = options;

  if (period === 'all') {
    return {
      changeAmount: 0,
      currentTotal: calculateCategorySummary(transactions, category, { period }).totalSpentForPeriod,
      direction: 'flat',
      percentageChange: 0,
      previousTotal: 0
    };
  }

  const currentRange = getCurrentCategoryPeriodRange(period, today);
  const previousRange = getPreviousCategoryPeriodRange(period, today);
  const categoryTransactions = transactions.filter(
    (transaction) => transaction.type === 'expense' && transaction.category === category
  );
  const currentTotal = categoryTransactions
    .filter((transaction) => isWithinRange(transaction.date, currentRange.start, currentRange.end))
    .reduce((total, transaction) => total + transaction.amount, 0);
  const previousTotal = categoryTransactions
    .filter((transaction) => isWithinRange(transaction.date, previousRange.start, previousRange.end))
    .reduce((total, transaction) => total + transaction.amount, 0);
  const changeAmount = currentTotal - previousTotal;

  return {
    changeAmount,
    currentTotal,
    direction: changeAmount > 0 ? 'up' : changeAmount < 0 ? 'down' : 'flat',
    percentageChange: previousTotal > 0 ? Math.round((changeAmount / previousTotal) * 100) : 0,
    previousTotal
  };
}
