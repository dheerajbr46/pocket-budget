import {
  generateBudgetInsights,
  generateRecurringInsights,
  generateSavingsInsights,
  generateTransactionInsights
} from '../utils/insights/index.js';
import { limitInsightsForPage, rankInsightsByPriority } from './insightPriorityService.js';

export function getAdaptiveInsightsForPage({
  budgetOverview,
  page = 'dashboard',
  savingsOverview,
  transactions
}) {
  if (page === 'budgets') {
    return limitInsightsForPage(generateBudgetInsights(budgetOverview), 'budgets');
  }

  if (page === 'goals') {
    return limitInsightsForPage(generateSavingsInsights(savingsOverview), 'goals');
  }

  return limitInsightsForPage(
    [
      ...generateBudgetInsights(budgetOverview),
      ...generateSavingsInsights(savingsOverview),
      ...generateRecurringInsights(transactions),
      ...generateTransactionInsights(transactions)
    ],
    page
  );
}

export function getGroupedReportInsights(monthlyInsights, weeklyInsights) {
  return rankInsightsByPriority([...monthlyInsights, ...weeklyInsights]);
}

// TODO: Add adaptive ranking by user behavior and user-configurable insight frequency.
