import { isNearWeekend } from '../utils/dates/index.js';
import { createInsight } from '../utils/insights/index.js';

export function getWeeklyInsightMode(today = new Date()) {
  return isNearWeekend(today) ? 'review' : 'lightweight';
}

export function getWeeklyInsights(miniTrends, today = new Date()) {
  const mode = getWeeklyInsightMode(today);
  const insights = [];
  const weeklyTrend = miniTrends.weeklySpending;
  const savingsTrend = miniTrends.savingsTrend;
  const categoryTrend = miniTrends.categoryTrend;

  insights.push(
    createInsight({
      id: 'weekly-spending-trend',
      message:
        weeklyTrend.direction === 'down'
          ? 'Weekly spending is lower so far.'
          : mode === 'review'
            ? 'Weekly spending is higher than last week.'
            : 'Weekly spending is trending up.',
      priority: weeklyTrend.direction === 'down' ? 44 : 68,
      title: 'Weekly spending',
      type: weeklyTrend.direction === 'down' ? 'positive' : 'warning'
    })
  );

  if (categoryTrend.category !== 'No category yet') {
    insights.push(
      createInsight({
        id: 'weekly-category-trend',
        message:
          categoryTrend.direction === 'down'
            ? `${categoryTrend.category} spending is easing.`
            : `${categoryTrend.category} spending is trending up.`,
        priority: categoryTrend.direction === 'down' ? 36 : 56,
        relatedCategory: categoryTrend.category,
        title: 'Category trend',
        type: categoryTrend.direction === 'down' ? 'positive' : 'neutral'
      })
    );
  }

  insights.push(
    createInsight({
      id: 'weekly-savings-trend',
      message:
        savingsTrend.currentTotal >= 0
          ? 'Savings are positive this week.'
          : 'Expenses are ahead of income this week.',
      priority: savingsTrend.currentTotal >= 0 ? 40 : 72,
      title: 'Weekly savings',
      type: savingsTrend.currentTotal >= 0 ? 'positive' : 'warning'
    })
  );

  if (mode === 'review') {
    insights.push(
      createInsight({
        id: 'weekly-review-detail',
        message: `${weeklyTrend.currentTransactionCount} transactions this week. Biggest category: ${weeklyTrend.biggestCategory}.`,
        priority: 46,
        title: 'Weekly review',
        type: 'neutral'
      })
    );
  }

  return {
    insights,
    mode
  };
}

// TODO: Add weekly digest notification and weekend financial review mode.
