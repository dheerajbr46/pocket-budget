import {
  generateBudgetInsights,
  generateRecurringInsights,
  generateTransactionInsights,
  prioritizeInsights
} from '../utils/insights/index.js';

export function getSmartInsights({ budgetOverview, limit = 4, transactions }) {
  return prioritizeInsights(
    [
      ...generateBudgetInsights(budgetOverview),
      ...generateRecurringInsights(transactions),
      ...generateTransactionInsights(transactions)
    ],
    limit
  );
}
