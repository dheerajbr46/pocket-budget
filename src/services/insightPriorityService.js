const typeRank = {
  danger: 0,
  warning: 1,
  positive: 2,
  neutral: 3
};

export function rankInsightsByPriority(insights = []) {
  const uniqueInsights = new Map();

  insights.forEach((insight) => {
    if (!uniqueInsights.has(insight.id)) {
      uniqueInsights.set(insight.id, insight);
    }
  });

  return [...uniqueInsights.values()].sort((firstInsight, secondInsight) => {
    const typeDifference = (typeRank[firstInsight.type] ?? typeRank.neutral) - (typeRank[secondInsight.type] ?? typeRank.neutral);

    if (typeDifference !== 0) {
      return typeDifference;
    }

    return (secondInsight.priority ?? 0) - (firstInsight.priority ?? 0);
  });
}

export function limitInsightsForPage(insights, page = 'dashboard') {
  const limits = {
    budgets: 5,
    dashboard: 3,
    goals: 5,
    reports: 8
  };

  return rankInsightsByPriority(insights).slice(0, limits[page] ?? 4);
}

export function getInsightContextForPage(page) {
  return {
    budgets: 'budget',
    dashboard: 'overview',
    goals: 'goal',
    reports: 'report'
  }[page] ?? 'overview';
}

// TODO: Add personalized insight ranking and user-configurable insight frequency.
