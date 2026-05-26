import {
  calculateSavingsOverview,
  getSavingsGoalInsights
} from '../utils/savings/index.js';
import {
  clearStoredSavingsGoals,
  getStoredSavingsGoals,
  saveStoredSavingsGoals
} from '../utils/storage/index.js';

export function createSavingsGoal({
  category = '',
  currentAmount = 0,
  icon = '',
  name,
  targetAmount,
  targetDate = ''
}) {
  const now = new Date().toISOString();
  const numericTarget = Number(targetAmount);
  const numericCurrent = Math.max(0, Number(currentAmount) || 0);

  return {
    id: `savings_${crypto.randomUUID()}`,
    category,
    createdAt: now,
    currentAmount: Math.min(numericTarget, numericCurrent),
    icon,
    name: name.trim(),
    targetAmount: numericTarget,
    targetDate,
    updatedAt: now
  };
}

export function getInitialSavingsGoals() {
  return getStoredSavingsGoals() ?? [];
}

export function persistSavingsGoals(goals) {
  return saveStoredSavingsGoals(goals);
}

export function clearSavingsGoals() {
  return clearStoredSavingsGoals();
}

export function upsertSavingsGoal(goals, goalValues) {
  if (!goalValues.id) {
    return [createSavingsGoal(goalValues), ...goals];
  }

  const numericTarget = Number(goalValues.targetAmount);
  const numericCurrent = Math.max(0, Number(goalValues.currentAmount) || 0);

  return goals.map((goal) =>
    goal.id === goalValues.id
      ? {
          ...goal,
          category: goalValues.category ?? '',
          currentAmount: Math.min(numericTarget, numericCurrent),
          icon: goalValues.icon ?? '',
          name: goalValues.name.trim(),
          targetAmount: numericTarget,
          targetDate: goalValues.targetDate ?? '',
          updatedAt: new Date().toISOString()
        }
      : goal
  );
}

export function deleteSavingsGoal(goals, goalId) {
  return goals.filter((goal) => goal.id !== goalId);
}

export function addSavingsContribution(goals, goalId, amount) {
  const numericAmount = Math.max(0, Number(amount) || 0);

  return goals.map((goal) =>
    goal.id === goalId
      ? {
          ...goal,
          currentAmount: Math.min(goal.targetAmount, goal.currentAmount + numericAmount),
          updatedAt: new Date().toISOString()
        }
      : goal
  );
}

export function subtractSavingsContribution(goals, goalId, amount) {
  const numericAmount = Math.max(0, Number(amount) || 0);

  return goals.map((goal) =>
    goal.id === goalId
      ? {
          ...goal,
          currentAmount: Math.max(0, goal.currentAmount - numericAmount),
          updatedAt: new Date().toISOString()
        }
      : goal
  );
}

export function getSavingsOverview(goals) {
  const overview = calculateSavingsOverview(goals);

  return {
    ...overview,
    insights: getSavingsGoalInsights(overview.progressItems)
  };
}

// TODO: Add recurring goal reminders and savings forecasting once notification preferences exist.
