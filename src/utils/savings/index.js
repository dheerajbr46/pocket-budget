import { toDateInputValue } from '../dates/index.js';

function parseDate(value) {
  return value ? new Date(`${value.slice(0, 10)}T00:00:00`) : null;
}

function daysBetween(firstDate, secondDate) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.ceil((secondDate.getTime() - firstDate.getTime()) / millisecondsPerDay);
}

export function isValidSavingsGoal(goal) {
  return (
    goal &&
    typeof goal.id === 'string' &&
    typeof goal.name === 'string' &&
    typeof goal.targetAmount === 'number' &&
    Number.isFinite(goal.targetAmount) &&
    goal.targetAmount > 0 &&
    typeof goal.currentAmount === 'number' &&
    Number.isFinite(goal.currentAmount) &&
    goal.currentAmount >= 0 &&
    (typeof goal.targetDate === 'undefined' || goal.targetDate === '' || typeof goal.targetDate === 'string') &&
    (typeof goal.category === 'undefined' || typeof goal.category === 'string') &&
    (typeof goal.icon === 'undefined' || typeof goal.icon === 'string') &&
    typeof goal.createdAt === 'string' &&
    typeof goal.updatedAt === 'string'
  );
}

export function areValidSavingsGoals(goals) {
  return Array.isArray(goals) && goals.every(isValidSavingsGoal);
}

export function calculateSavingsGoalProgress(goal, today = new Date()) {
  const targetAmount = Number(goal.targetAmount) || 0;
  const currentAmount = Number(goal.currentAmount) || 0;
  const remainingAmount = Math.max(0, targetAmount - currentAmount);
  const progressPercentage = targetAmount > 0 ? Math.min(100, Math.round((currentAmount / targetAmount) * 100)) : 0;
  const targetDate = parseDate(goal.targetDate);
  const createdDate = parseDate(goal.createdAt) ?? today;
  const daysLeft = targetDate ? daysBetween(today, targetDate) : null;
  const totalGoalDays = targetDate ? Math.max(1, daysBetween(createdDate, targetDate)) : null;
  const elapsedDays = targetDate ? Math.max(0, daysBetween(createdDate, today)) : 0;
  const expectedProgress = totalGoalDays ? Math.min(100, Math.round((elapsedDays / totalGoalDays) * 100)) : 0;
  const isCompleted = currentAmount >= targetAmount;
  const isNearDeadline = typeof daysLeft === 'number' && daysLeft >= 0 && daysLeft <= 30;
  const isBehind = !isCompleted && targetDate && (progressPercentage + 8 < expectedProgress || (isNearDeadline && progressPercentage < 75));
  const status = isCompleted ? 'completed' : isBehind ? 'behind' : 'on-track';
  const statusLabel = isCompleted ? 'Completed' : isBehind ? 'Behind' : 'On track';

  return {
    ...goal,
    currentAmount,
    daysLeft,
    isNearDeadline,
    progressPercentage,
    remainingAmount,
    status,
    statusLabel,
    targetAmount,
    targetDateLabel: goal.targetDate ? toDateInputValue(parseDate(goal.targetDate)) : ''
  };
}

export function calculateSavingsOverview(goals, today = new Date()) {
  const progressItems = goals
    .map((goal) => calculateSavingsGoalProgress(goal, today))
    .sort((firstGoal, secondGoal) => {
      const statusRank = { behind: 0, 'on-track': 1, completed: 2 };
      const rankDifference = statusRank[firstGoal.status] - statusRank[secondGoal.status];

      if (rankDifference !== 0) {
        return rankDifference;
      }

      if (firstGoal.targetDate && secondGoal.targetDate) {
        return firstGoal.targetDate.localeCompare(secondGoal.targetDate);
      }

      return secondGoal.progressPercentage - firstGoal.progressPercentage;
    });
  const activeDeadlines = progressItems
    .filter((goal) => goal.targetDate && goal.status !== 'completed')
    .sort((firstGoal, secondGoal) => firstGoal.targetDate.localeCompare(secondGoal.targetDate));

  return {
    completedCount: progressItems.filter((goal) => goal.status === 'completed').length,
    nearestDeadline: activeDeadlines[0] ?? null,
    progressItems,
    totalRemaining: progressItems.reduce((total, goal) => total + goal.remainingAmount, 0),
    totalSaved: progressItems.reduce((total, goal) => total + goal.currentAmount, 0),
    totalTarget: progressItems.reduce((total, goal) => total + goal.targetAmount, 0)
  };
}

export function getSavingsGoalInsights(progressItems) {
  return progressItems.slice(0, 4).flatMap((goal) => {
    if (goal.status === 'completed') {
      return [
        {
          id: `goal-completed-${goal.id}`,
          message: `${goal.name} is fully funded.`,
          priority: 72,
          title: 'Goal completed',
          type: 'positive'
        }
      ];
    }

    if (goal.progressPercentage >= 80) {
      return [
        {
          id: `goal-close-${goal.id}`,
          message: `${goal.name} is close to completion.`,
          priority: 62,
          title: 'Goal is close',
          type: 'positive'
        }
      ];
    }

    if (goal.status === 'behind') {
      return [
        {
          id: `goal-behind-${goal.id}`,
          message: `${goal.name} needs ${Math.round(goal.remainingAmount)} more to stay comfortable.`,
          priority: 76,
          title: 'Goal needs attention',
          type: 'warning'
        }
      ];
    }

    return [
      {
        id: `goal-progress-${goal.id}`,
        message: `You are ${goal.progressPercentage}% toward your ${goal.name}.`,
        priority: 38,
        title: 'Goal progress',
        type: 'neutral'
      }
    ];
  });
}

// TODO: Auto-contribute from positive monthly savings when users opt into automation.
// TODO: Link savings goals to budgets and goal reminders.
// TODO: Add shared savings goals, Splitwise/shared expense integration, and optional cloud sync.
