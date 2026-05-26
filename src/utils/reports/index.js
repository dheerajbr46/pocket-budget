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

export function getMonthlySnapshotReport(transactions, today = new Date()) {
  const currentStart = getMonthStart(today);
  const nextStart = getNextMonthStart(today);
  const previousStart = getPreviousMonthStart(today);
  const currentTransactions = transactions.filter((transaction) => isWithinRange(transaction.date, currentStart, nextStart));
  const previousTransactions = transactions.filter((transaction) => isWithinRange(transaction.date, previousStart, currentStart));
  const currentSummary = summarizeTransactions(currentTransactions);
  const previousSummary = summarizeTransactions(previousTransactions);
  const categories = getCategorySpendingBreakdown(currentTransactions);
  const savingsRate = currentSummary.income > 0
    ? Math.round((currentSummary.balance / currentSummary.income) * 100)
    : 0;
  const previousSavingsRate = previousSummary.income > 0
    ? Math.round((previousSummary.balance / previousSummary.income) * 100)
    : 0;
  const spendingChange = currentSummary.expenses - previousSummary.expenses;
  const spendingChangePercent = previousSummary.expenses > 0
    ? Math.round((spendingChange / previousSummary.expenses) * 100)
    : currentSummary.expenses > 0
      ? 100
      : 0;
  const savingsChange = currentSummary.balance - previousSummary.balance;

  return {
    categories,
    comparison: {
      savingsChange,
      savingsRateChange: savingsRate - previousSavingsRate,
      spendingChange,
      spendingChangePercent
    },
    previousSummary,
    savingsRate,
    summary: currentSummary,
    topCategory: categories[0] ?? null,
    transactionCount: currentTransactions.length
  };
}

export function getDonutCategorySegments(categories, limit = 5) {
  const topCategories = categories.slice(0, limit);
  const otherAmount = categories.slice(limit).reduce((total, category) => total + category.amount, 0);
  const total = categories.reduce((sum, category) => sum + category.amount, 0);
  const segments = otherAmount > 0
    ? [...topCategories, { amount: otherAmount, category: 'Other', percentage: total > 0 ? Math.round((otherAmount / total) * 100) : 0 }]
    : topCategories;

  return {
    segments,
    total
  };
}

export function getMiniTrendReport(transactions, budgetOverview, today = new Date()) {
  const weekStart = getWeekStart(today);
  const previousWeekStart = new Date(weekStart);
  previousWeekStart.setDate(weekStart.getDate() - 7);
  const monthStart = getMonthStart(today);
  const previousMonthStart = getPreviousMonthStart(today);
  const currentWeekTransactions = transactions.filter((transaction) => isOnOrAfter(transaction.date, weekStart));
  const previousWeekTransactions = transactions.filter((transaction) => isWithinRange(transaction.date, previousWeekStart, weekStart));
  const currentMonthTransactions = transactions.filter((transaction) => isOnOrAfter(transaction.date, monthStart));
  const previousMonthTransactions = transactions.filter((transaction) => isWithinRange(transaction.date, previousMonthStart, monthStart));
  const currentWeekSpending = summarizeTransactions(currentWeekTransactions).expenses;
  const previousWeekSpending = summarizeTransactions(previousWeekTransactions).expenses;
  const currentMonthSummary = summarizeTransactions(currentMonthTransactions);
  const previousMonthSummary = summarizeTransactions(previousMonthTransactions);
  const currentTopCategory = getCategorySpendingBreakdown(currentMonthTransactions)[0] ?? null;
  const previousTopCategory = getCategorySpendingBreakdown(previousMonthTransactions).find(
    (category) => category.category === currentTopCategory?.category
  );
  const currentWeekCategories = getCategorySpendingBreakdown(currentWeekTransactions);
  const currentWeekBiggestCategory = currentWeekCategories[0] ?? null;
  const currentWeekCount = currentWeekTransactions.length;
  const previousWeekCount = previousWeekTransactions.length;
  const categoryBudget = budgetOverview?.progressItems?.find(
    (budget) => budget.category === currentTopCategory?.category
  );

  return {
    categoryTrend: {
      budgetStatus: categoryBudget?.statusLabel ?? 'No budget set',
      category: currentTopCategory?.category ?? 'No category yet',
      changeAmount: currentTopCategory ? currentTopCategory.amount - (previousTopCategory?.amount ?? 0) : 0,
      contributionPercentage: currentTopCategory?.percentage ?? 0,
      currentTotal: currentTopCategory?.amount ?? 0,
      direction: currentTopCategory && previousTopCategory && currentTopCategory.amount < previousTopCategory.amount ? 'down' : 'up',
      previousTotal: previousTopCategory?.amount ?? 0,
      type: 'category'
    },
    savingsTrend: {
      changeAmount: currentMonthSummary.balance - previousMonthSummary.balance,
      currentTotal: currentMonthSummary.balance,
      direction: currentMonthSummary.balance >= previousMonthSummary.balance ? 'up' : 'down',
      previousTotal: previousMonthSummary.balance,
      type: 'savings'
    },
    weeklySpending: {
      biggestCategory: currentWeekBiggestCategory?.category ?? 'None yet',
      changeAmount: currentWeekSpending - previousWeekSpending,
      currentTotal: currentWeekSpending,
      currentTransactionCount: currentWeekCount,
      direction: currentWeekSpending <= previousWeekSpending ? 'down' : 'up',
      percentageChange: previousWeekSpending > 0
        ? Math.round(((currentWeekSpending - previousWeekSpending) / previousWeekSpending) * 100)
        : currentWeekSpending > 0
          ? 100
          : 0,
      previousTotal: previousWeekSpending,
      previousTransactionCount: previousWeekCount,
      type: 'weekly'
    }
  };
}

export function getReportInsights(snapshot, budgetOverview) {
  const insights = [];

  if (snapshot.topCategory) {
    insights.push({
      id: `report-top-${snapshot.topCategory.category}`,
      message: `${snapshot.topCategory.category} is your highest spending category this month.`,
      priority: 58,
      title: 'Top spending area',
      type: 'neutral'
    });
  }

  if (snapshot.comparison.spendingChangePercent > 15) {
    insights.push({
      id: 'report-spending-up',
      message: `Spending is up ${snapshot.comparison.spendingChangePercent}% vs last month.`,
      priority: 74,
      title: 'Spending increased',
      type: 'warning'
    });
  } else if (snapshot.comparison.spendingChange < 0) {
    insights.push({
      id: 'report-spending-down',
      message: 'Spending is lower than last month so far.',
      priority: 50,
      title: 'Spending eased',
      type: 'positive'
    });
  }

  if (snapshot.savingsRate > 0) {
    insights.push({
      id: 'report-positive-savings-rate',
      message: `Savings rate is ${snapshot.savingsRate}% this month.`,
      priority: 52,
      title: 'Savings rate',
      type: 'positive'
    });
  }

  budgetOverview?.progressItems
    ?.filter((budget) => budget.status === 'exceeded' || budget.status === 'critical')
    .slice(0, 2)
    .forEach((budget) => {
      insights.push({
        id: `report-budget-${budget.id}`,
        message: `${budget.category} budget needs attention.`,
        priority: budget.status === 'exceeded' ? 82 : 76,
        title: 'Budget warning',
        type: budget.status === 'exceeded' ? 'danger' : 'warning'
      });
    });

  return insights.sort((firstInsight, secondInsight) => secondInsight.priority - firstInsight.priority);
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
