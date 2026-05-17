import { getMonthStart, getNextMonthStart, isWithinRange } from '../dates/index.js';
import { getBudgetHealthState } from '../budgetHealth.js';

export function calculateRemainingBudget(budgetAmount, currentSpending) {
  return budgetAmount - currentSpending;
}

export function calculateBudgetStatus(percentageUsed) {
  return getBudgetHealthState(percentageUsed).status;
}

export function calculateBudgetProgress(budget, transactions, today = new Date()) {
  const monthStart = getMonthStart(today);
  const monthEnd = getNextMonthStart(today);
  const currentSpending = transactions
    .filter((transaction) => transaction.type === 'expense')
    .filter((transaction) => transaction.category === budget.category)
    .filter((transaction) => isWithinRange(transaction.date, monthStart, monthEnd))
    .reduce((total, transaction) => total + transaction.amount, 0);
  const remainingAmount = calculateRemainingBudget(budget.amount, currentSpending);
  const percentageUsed = budget.amount > 0 ? Math.round((currentSpending / budget.amount) * 100) : 0;
  const health = getBudgetHealthState(percentageUsed);

  return {
    ...budget,
    currentSpending,
    health,
    percentageUsed,
    remainingAmount,
    status: health.status
  };
}

export function getBudgetInsights(budgetProgressItems) {
  return budgetProgressItems
    .filter((budget) => budget.status === 'warning' || budget.status === 'critical' || budget.status === 'exceeded')
    .map((budget) => ({
      id: budget.id,
      category: budget.category,
      message:
        budget.status === 'exceeded'
          ? `${budget.category} budget exceeded`
          : `${budget.category} budget is nearing its limit`,
      status: budget.status
    }));
}

export function isValidBudgetGoal(budget) {
  return (
    budget &&
    typeof budget.id === 'string' &&
    typeof budget.category === 'string' &&
    typeof budget.amount === 'number' &&
    Number.isFinite(budget.amount) &&
    budget.amount > 0 &&
    typeof budget.createdAt === 'string' &&
    typeof budget.updatedAt === 'string'
  );
}

export function areValidBudgetGoals(budgets) {
  return Array.isArray(budgets) && budgets.every(isValidBudgetGoal);
}
