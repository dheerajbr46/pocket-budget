import { getAdaptiveInsightsForPage } from './adaptiveInsightService.js';

export function getSmartInsights({ budgetOverview, page = 'dashboard', savingsOverview, transactions }) {
  return getAdaptiveInsightsForPage({
    budgetOverview,
    page,
    savingsOverview,
    transactions
  });
}
