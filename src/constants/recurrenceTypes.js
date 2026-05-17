export const RECURRENCE_TYPES = {
  BIWEEKLY: 'biweekly',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly'
};

export const recurrenceOptions = [
  { id: RECURRENCE_TYPES.WEEKLY, label: 'Weekly' },
  { id: RECURRENCE_TYPES.BIWEEKLY, label: 'Biweekly' },
  { id: RECURRENCE_TYPES.MONTHLY, label: 'Monthly' },
  { id: RECURRENCE_TYPES.YEARLY, label: 'Yearly' }
];
