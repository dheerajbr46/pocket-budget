import {
  areValidBudgetGoals,
  calculateBudgetProgress,
  getBudgetInsights
} from '../utils/budgets/index.js';
import { getBudgetHealthRank } from '../utils/budgetHealth.js';
import {
  clearStoredBudgetGoals,
  getStoredBudgetGoals,
  saveStoredBudgetGoals
} from '../utils/storage/index.js';

export function createBudgetGoal({ amount, category }) {
  const now = new Date().toISOString();

  return {
    id: `budget_${crypto.randomUUID()}`,
    amount: Number(amount),
    category,
    createdAt: now,
    updatedAt: now
  };
}

export function getInitialBudgetGoals() {
  return getStoredBudgetGoals() ?? [];
}

export function persistBudgetGoals(budgets) {
  return saveStoredBudgetGoals(budgets);
}

export function clearBudgetGoals() {
  return clearStoredBudgetGoals();
}

export function upsertBudgetGoal(budgets, budgetValues) {
  const existingBudget = budgets.find((budget) => budget.category === budgetValues.category);

  if (!existingBudget) {
    return [createBudgetGoal(budgetValues), ...budgets];
  }

  return budgets.map((budget) =>
    budget.id === existingBudget.id
      ? {
          ...budget,
          amount: Number(budgetValues.amount),
          updatedAt: new Date().toISOString()
        }
      : budget
  );
}

export function updateBudgetGoal(budgets, updatedBudget) {
  return budgets.map((budget) =>
    budget.id === updatedBudget.id
      ? {
          ...budget,
          amount: Number(updatedBudget.amount),
          category: updatedBudget.category,
          updatedAt: new Date().toISOString()
        }
      : budget
  );
}

export function deleteBudgetGoal(budgets, budgetId) {
  return budgets.filter((budget) => budget.id !== budgetId);
}

export function getBudgetOverview(budgets, transactions) {
  const progressItems = budgets
    .map((budget) => calculateBudgetProgress(budget, transactions))
    .sort((firstBudget, secondBudget) => {
      const rankDifference = getBudgetHealthRank(firstBudget.status) - getBudgetHealthRank(secondBudget.status);

      if (rankDifference !== 0) {
        return rankDifference;
      }

      return secondBudget.percentageUsed - firstBudget.percentageUsed;
    });

  return {
    insights: getBudgetInsights(progressItems),
    progressItems,
    totalBudgeted: progressItems.reduce((total, budget) => total + budget.amount, 0),
    totalRemaining: progressItems.reduce((total, budget) => total + budget.remainingAmount, 0),
    totalSpent: progressItems.reduce((total, budget) => total + budget.currentSpending, 0)
  };
}

export function parseBudgetImport(value) {
  return areValidBudgetGoals(value) ? value : [];
}
