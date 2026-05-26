import { createInsight } from '../utils/insights/index.js';

export function getMonthlyInsights({ budgetOverview, monthlySnapshot, savingsOverview }) {
  const insights = [];

  if (monthlySnapshot.summary.balance > 0) {
    insights.push(
      createInsight({
        id: 'monthly-net-savings-positive',
        message: 'You saved more than you spent this month.',
        priority: 62,
        title: 'Monthly savings',
        type: 'positive'
      })
    );
  } else if (monthlySnapshot.transactionCount > 0 && monthlySnapshot.summary.balance < 0) {
    insights.push(
      createInsight({
        id: 'monthly-net-savings-negative',
        message: 'Expenses are higher than income this month so far.',
        priority: 86,
        title: 'Monthly savings',
        type: 'warning'
      })
    );
  }

  if (monthlySnapshot.topCategory) {
    insights.push(
      createInsight({
        id: `monthly-top-category-${monthlySnapshot.topCategory.category}`,
        message: `${monthlySnapshot.topCategory.category} is your largest category this month.`,
        priority: 52,
        relatedCategory: monthlySnapshot.topCategory.category,
        title: 'Largest category',
        type: 'neutral'
      })
    );
  }

  if (monthlySnapshot.savingsRate > 0) {
    insights.push(
      createInsight({
        id: 'monthly-savings-rate',
        message: `Savings rate is ${monthlySnapshot.savingsRate}% this month.`,
        priority: 50,
        title: 'Savings rate',
        type: 'positive'
      })
    );
  }

  if (monthlySnapshot.comparison.spendingChangePercent > 15) {
    insights.push(
      createInsight({
        id: 'monthly-spending-increase',
        message: `Spending is up ${monthlySnapshot.comparison.spendingChangePercent}% vs last month.`,
        priority: 74,
        title: 'Spending trend',
        type: 'warning'
      })
    );
  } else if (monthlySnapshot.comparison.spendingChange < 0) {
    insights.push(
      createInsight({
        id: 'monthly-spending-decrease',
        message: 'Spending is lower than last month so far.',
        priority: 48,
        title: 'Spending trend',
        type: 'positive'
      })
    );
  }

  budgetOverview?.progressItems
    ?.filter((budget) => budget.status === 'warning' || budget.status === 'critical' || budget.status === 'exceeded')
    .slice(0, 3)
    .forEach((budget) => {
      insights.push(
        createInsight({
          id: `monthly-budget-${budget.id}`,
          message:
            budget.status === 'exceeded'
              ? `${budget.category} is over the monthly budget.`
              : `${budget.category} is close to the monthly budget.`,
          priority: budget.status === 'exceeded' ? 90 : 78,
          relatedCategory: budget.category,
          title: 'Budget status',
          type: budget.status === 'exceeded' || budget.status === 'critical' ? 'danger' : 'warning'
        })
      );
    });

  const activeGoal = savingsOverview?.progressItems?.find((goal) => goal.status !== 'completed');

  if (activeGoal) {
    insights.push(
      createInsight({
        id: `monthly-goal-${activeGoal.id}`,
        message: `${activeGoal.name} is ${activeGoal.progressPercentage}% funded.`,
        priority: activeGoal.status === 'behind' ? 70 : 42,
        title: 'Goal progress',
        type: activeGoal.status === 'behind' ? 'warning' : 'neutral'
      })
    );
  }

  return insights;
}

// TODO: Add monthly recap generation and optional AI-generated explanation layer later.
