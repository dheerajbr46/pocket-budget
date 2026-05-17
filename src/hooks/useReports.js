import { useMemo } from 'react';
import {
  getMonthSpending,
  getMonthlyCategorySpending,
  getPeriodReport,
  getTodaySummary,
  getWeekSpending,
  summarizeTransactions
} from '../services/reportService.js';
import { getRecentTransactions } from '../services/transactionService.js';
import { getUpcomingTimeline } from '../services/upcomingTimelineService.js';

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

export function useReports(transactions) {
  return useMemo(
    () => ({
      monthlyReport: getPeriodReport(transactions, 'month'),
      weeklyReport: getPeriodReport(transactions, 'week')
    }),
    [transactions]
  );
}
