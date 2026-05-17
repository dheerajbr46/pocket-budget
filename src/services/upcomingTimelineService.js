import {
  getUpcomingRecurringTotals,
  getUpcomingRecurringTransactions
} from './recurringService.js';
import { formatUpcomingDueDate } from '../utils/transactions/index.js';

export function getUpcomingTimeline(transactions, today = new Date()) {
  const upcomingItems = getUpcomingRecurringTransactions(transactions, 5, today);
  const groups = upcomingItems.reduce((timelineGroups, transaction) => {
    const label = formatUpcomingDueDate(transaction.nextDate, today);
    const existingGroup = timelineGroups.find((group) => group.label === label);

    if (existingGroup) {
      existingGroup.items.push(transaction);
    } else {
      timelineGroups.push({ id: transaction.nextDate, label, items: [transaction] });
    }

    return timelineGroups;
  }, []);

  return {
    groups,
    items: upcomingItems,
    totals: getUpcomingRecurringTotals(transactions, today)
  };
}
