import { useMemo } from 'react';
import {
  getMonthSpending,
  getMonthlyCategorySpending,
  getDonutCategorySegments,
  getMiniTrendReport,
  getMonthlySnapshotReport,
  getPeriodReport,
  getTodaySummary,
  getWeekSpending,
  summarizeTransactions
} from '../services/reportService.js';
import { getRecentTransactions } from '../services/transactionService.js';
import { getUpcomingTimeline } from '../services/upcomingTimelineService.js';
import { getGroupedReportInsights } from '../services/adaptiveInsightService.js';
import { getMonthlyInsights } from '../services/monthlyInsightService.js';
import { getWeeklyInsights } from '../services/weeklyInsightService.js';

export function useDashboardReport(transactions) {
  return useMemo(
    () => ({
      categorySpending: getMonthlyCategorySpending(transactions).slice(0, 4),
      monthSpending: getMonthSpending(transactions),
      recentTransactions: getRecentTransactions(transactions, 5),
      summary: summarizeTransactions(transactions),
      todaySummary: getTodaySummary(transactions),
      upcomingTimeline: getUpcomingTimeline(transactions),
      weekSpending: getWeekSpending(transactions)
    }),
    [transactions]
  );
}

export function useReports(transactions, budgetOverview, savingsOverview) {
  return useMemo(
    () => {
      const monthlySnapshot = getMonthlySnapshotReport(transactions);
      const miniTrends = getMiniTrendReport(transactions, budgetOverview);
      const monthlyInsights = getMonthlyInsights({
        budgetOverview,
        monthlySnapshot,
        savingsOverview
      });
      const weeklyAwareness = getWeeklyInsights(miniTrends);

      return {
        donutBreakdown: getDonutCategorySegments(monthlySnapshot.categories),
        miniTrends,
        monthlyReport: getPeriodReport(transactions, 'month'),
        monthlyInsights,
        monthlySnapshot,
        reportInsights: getGroupedReportInsights(monthlyInsights, weeklyAwareness.insights),
        weeklyAwareness,
        weeklyReport: getPeriodReport(transactions, 'week')
      };
    },
    [budgetOverview, savingsOverview, transactions]
  );
}
