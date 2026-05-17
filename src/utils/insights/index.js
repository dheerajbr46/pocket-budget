import {
  getMonthStart,
  getNextMonthStart,
  getPreviousMonthStart,
  isWithinRange
} from '../dates/index.js';
import {
  getCategorySpendingBreakdown,
  getPeriodReport
} from '../reports/index.js';
import { getUpcomingRecurringTransactions } from '../transactions/index.js';

function expenseTransactionsForRange(transactions, startDate, endDate) {
  return transactions
    .filter((transaction) => transaction.type === 'expense')
    .filter((transaction) => isWithinRange(transaction.date, startDate, endDate));
}

function getMostRecentTransaction(transactions) {
  return [...transactions].sort((firstTransaction, secondTransaction) => {
    const firstTime = new Date(firstTransaction.createdAt || firstTransaction.date).getTime();
    const secondTime = new Date(secondTransaction.createdAt || secondTransaction.date).getTime();
    return secondTime - firstTime;
  })[0];
}

function daysBetween(firstDate, secondDate) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((secondDate.getTime() - firstDate.getTime()) / millisecondsPerDay);
}

export function createInsight({
  id,
  message,
  priority = 1,
  relatedCategory = null,
  title,
  type = 'neutral'
}) {
  return {
    id,
    message,
    priority,
    relatedCategory,
    title,
    type
  };
}

export function generateTransactionInsights(transactions, today = new Date()) {
  const insights = [];
  const currentMonthStart = getMonthStart(today);
  const nextMonthStart = getNextMonthStart(today);
  const previousMonthStart = getPreviousMonthStart(today);
  const currentMonthExpenses = expenseTransactionsForRange(transactions, currentMonthStart, nextMonthStart);
  const previousMonthExpenses = expenseTransactionsForRange(transactions, previousMonthStart, currentMonthStart);
  const currentMonthSpending = currentMonthExpenses.reduce((total, transaction) => total + transaction.amount, 0);
  const previousMonthSpending = previousMonthExpenses.reduce((total, transaction) => total + transaction.amount, 0);
  const monthlyReport = getPeriodReport(transactions, 'month', today);
  const categoryBreakdown = getCategorySpendingBreakdown(currentMonthExpenses);
  const mostRecentTransaction = getMostRecentTransaction(transactions);

  if (previousMonthSpending > 0 && currentMonthSpending > previousMonthSpending * 1.15) {
    insights.push(
      createInsight({
        id: 'spending-increased-month',
        title: 'Spending picked up',
        message: 'Spending is higher than the previous month so far.',
        type: 'warning',
        priority: 75
      })
    );
  }

  const unusuallyHighCategory = categoryBreakdown.find((category) => category.percentage >= 45);

  if (unusuallyHighCategory) {
    insights.push(
      createInsight({
        id: `category-high-${unusuallyHighCategory.category}`,
        title: 'Category is running high',
        message: `${unusuallyHighCategory.category} spending is higher than usual this month.`,
        type: 'warning',
        relatedCategory: unusuallyHighCategory.category,
        priority: 70
      })
    );
  }

  if (monthlyReport.topCategory) {
    insights.push(
      createInsight({
        id: `top-category-${monthlyReport.topCategory.category}`,
        title: 'Top category',
        message: `${monthlyReport.topCategory.category} is your top spending category this month.`,
        type: 'neutral',
        relatedCategory: monthlyReport.topCategory.category,
        priority: 35
      })
    );
  }

  if (monthlyReport.summary.balance > 0) {
    insights.push(
      createInsight({
        id: 'positive-monthly-savings',
        title: 'Positive savings',
        message: 'Nice work — your monthly savings are positive.',
        type: 'positive',
        priority: 50
      })
    );
  } else if (monthlyReport.transactionCount > 0 && monthlyReport.summary.balance < 0) {
    insights.push(
      createInsight({
        id: 'negative-monthly-savings',
        title: 'Savings dipped',
        message: 'Monthly expenses are currently higher than income.',
        type: 'danger',
        priority: 85
      })
    );
  }

  if (!mostRecentTransaction) {
    insights.push(
      createInsight({
        id: 'no-transactions',
        title: 'No activity yet',
        message: 'You have not logged any transactions yet.',
        type: 'neutral',
        priority: 30
      })
    );
  } else {
    const recentDate = new Date(`${mostRecentTransaction.date}T00:00:00`);

    if (daysBetween(recentDate, today) >= 7) {
      insights.push(
        createInsight({
          id: 'no-recent-transactions',
          title: 'No recent activity',
          message: 'You have not logged any transactions recently.',
          type: 'neutral',
          priority: 45
        })
      );
    }
  }

  return insights;
}

export function generateBudgetInsights(budgetOverview) {
  return budgetOverview.progressItems
    .filter((budget) => budget.status === 'warning' || budget.status === 'critical' || budget.status === 'exceeded')
    .map((budget) =>
      createInsight({
        id: `budget-${budget.status}-${budget.category}`,
        title:
          budget.status === 'exceeded'
            ? 'Budget exceeded'
            : budget.status === 'critical'
              ? 'Budget is critical'
              : 'Budget is close',
        message:
          budget.status === 'exceeded'
            ? `${budget.category} budget exceeded.`
            : budget.status === 'critical'
              ? `${budget.category} budget is near its limit.`
              : `You are close to your ${budget.category} budget.`,
        type: budget.status === 'exceeded' || budget.status === 'critical' ? 'danger' : 'warning',
        relatedCategory: budget.category,
        priority: budget.status === 'exceeded' ? 95 : budget.status === 'critical' ? 88 : 80
      })
    );
}

function normalizeRecurringMonthlyAmount(transaction) {
  if (transaction.recurrenceFrequency === 'weekly') {
    return (transaction.amount * 52) / 12;
  }

  if (transaction.recurrenceFrequency === 'biweekly') {
    return (transaction.amount * 26) / 12;
  }

  if (transaction.recurrenceFrequency === 'yearly') {
    return transaction.amount / 12;
  }

  return transaction.amount;
}

export function generateRecurringInsights(transactions, today = new Date()) {
  const insights = [];
  const upcoming = getUpcomingRecurringTransactions(transactions, 10, today);
  const weekAhead = new Date(today);
  weekAhead.setDate(today.getDate() + 7);
  const recurringExpenses = transactions.filter(
    (transaction) => transaction.isRecurring && !transaction.generatedFromRecurringId && transaction.type === 'expense'
  );
  const upcomingThisWeek = upcoming.filter(
    (transaction) => new Date(`${transaction.nextDate}T00:00:00`) <= weekAhead
  );
  const nearestExpense = upcoming.find((transaction) => transaction.type === 'expense');
  const nearestIncome = upcoming.find((transaction) => transaction.type === 'income');
  const largeRecurringExpensesThisWeek = upcomingThisWeek
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);
  const subscriptionMonthlyTotal = recurringExpenses
    .filter((transaction) => transaction.category === 'Subscriptions')
    .reduce((total, transaction) => total + normalizeRecurringMonthlyAmount(transaction), 0);
  const currentBalance = getPeriodReport(transactions, 'month', today).summary.balance;
  const upcomingExpenseTotal = upcoming
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  if (nearestExpense) {
    const dueDate = new Date(`${nearestExpense.nextDate}T00:00:00`);
    const daysUntilDue = daysBetween(today, dueDate);
    const dueText = daysUntilDue <= 0 ? 'today' : `in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;

    insights.push(
      createInsight({
        id: `upcoming-recurring-${nearestExpense.id}`,
        title: 'Upcoming recurring payment',
        message: `${nearestExpense.note || nearestExpense.category} due ${dueText}.`,
        type: daysUntilDue <= 3 ? 'warning' : 'neutral',
        relatedCategory: nearestExpense.category,
        priority: daysUntilDue <= 3 ? 82 : 46
      })
    );
  }

  if (upcomingThisWeek.length >= 2) {
    insights.push(
      createInsight({
        id: 'recurring-payments-this-week',
        title: 'Recurring payments this week',
        message: `${upcomingThisWeek.length} recurring payments this week.`,
        type: 'neutral',
        priority: 44
      })
    );
  }

  if (largeRecurringExpensesThisWeek >= 500) {
    insights.push(
      createInsight({
        id: 'large-recurring-expenses-this-week',
        title: 'Recurring expenses ahead',
        message: 'Large recurring expenses are coming this week.',
        type: 'warning',
        priority: 78
      })
    );
  }

  if (nearestIncome) {
    const dueDate = new Date(`${nearestIncome.nextDate}T00:00:00`);
    const daysUntilDue = daysBetween(today, dueDate);

    if (daysUntilDue >= 0 && daysUntilDue <= 7) {
      const expectedText = daysUntilDue === 1 ? 'tomorrow' : `in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;

      insights.push(
        createInsight({
          id: `expected-income-${nearestIncome.id}`,
          title: 'Expected income',
          message: `${nearestIncome.note || nearestIncome.category} expected ${daysUntilDue === 0 ? 'today' : expectedText}.`,
          type: 'positive',
          relatedCategory: nearestIncome.category,
          priority: 58
        })
      );
    }
  }

  if (subscriptionMonthlyTotal > 0) {
    insights.push(
      createInsight({
        id: 'subscriptions-monthly-total',
        title: 'Subscription total',
        message: `Subscriptions total $${subscriptionMonthlyTotal.toFixed(0)}/month.`,
        type: 'neutral',
        relatedCategory: 'Subscriptions',
        priority: 42
      })
    );
  }

  if (currentBalance > 0 && upcomingExpenseTotal > currentBalance) {
    insights.push(
      createInsight({
        id: 'upcoming-recurring-exceeds-balance',
        title: 'Upcoming payments',
        message: 'Upcoming recurring payments exceed remaining balance.',
        type: 'danger',
        priority: 90
      })
    );
  }

  return insights;
}

export function prioritizeInsights(insights, limit = 4) {
  const uniqueInsights = new Map();

  insights.forEach((insight) => {
    if (!uniqueInsights.has(insight.id)) {
      uniqueInsights.set(insight.id, insight);
    }
  });

  return [...uniqueInsights.values()]
    .sort((firstInsight, secondInsight) => secondInsight.priority - firstInsight.priority)
    .slice(0, limit);
}

// TODO: Add personalized insight thresholds once users can tune sensitivity.
// TODO: Add weekly digest and monthly summary generation from this same local rules engine.
// TODO: Add optional AI-generated explanations later, behind a privacy-first user setting.
// TODO: Add merchant recognition and recurring transaction editing modes for single occurrence vs entire series.
