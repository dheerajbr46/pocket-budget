function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getWeekStart(date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

function getMonthStart(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isOnOrAfter(transactionDate, startDate) {
  return new Date(`${transactionDate}T00:00:00`) >= startDate;
}

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
  const todaysTransactions = transactions.filter((transaction) => transaction.date === todayValue);

  return summarizeTransactions(todaysTransactions);
}

export function getWeekSpending(transactions, today = new Date()) {
  const weekStart = getWeekStart(today);

  return getTransactionsSince(transactions, weekStart)
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getMonthSpending(transactions, today = new Date()) {
  const monthStart = getMonthStart(today);

  return getTransactionsSince(transactions, monthStart)
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getRecentTransactions(transactions, count = 5) {
  return [...transactions]
    .sort((firstTransaction, secondTransaction) => {
      const firstTime = new Date(firstTransaction.createdAt || firstTransaction.date).getTime();
      const secondTime = new Date(secondTransaction.createdAt || secondTransaction.date).getTime();

      return secondTime - firstTime;
    })
    .slice(0, count);
}

export function getMonthlyCategorySpending(transactions, today = new Date()) {
  const monthStart = getMonthStart(today);

  return getCategorySpendingBreakdown(getTransactionsSince(transactions, monthStart));
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
