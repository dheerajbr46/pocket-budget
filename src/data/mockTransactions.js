export const mockTransactions = [
  {
    id: 'txn_001',
    type: 'income',
    amount: 4200,
    category: 'Salary',
    note: 'May paycheck',
    date: '2026-05-01',
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    recurrenceStartDate: '2026-05-01',
    lastGeneratedDate: '2026-05-01',
    nextOccurrenceDate: '2026-06-01',
    recurringSeriesId: 'txn_001',
    createdAt: '2026-05-01T09:15:00.000Z'
  },
  {
    id: 'txn_002',
    type: 'expense',
    amount: 1850,
    category: 'Rent',
    note: 'Apartment rent',
    date: '2026-05-02',
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    recurrenceStartDate: '2026-05-02',
    lastGeneratedDate: '2026-05-02',
    nextOccurrenceDate: '2026-06-02',
    recurringSeriesId: 'txn_002',
    createdAt: '2026-05-02T08:30:00.000Z'
  },
  {
    id: 'txn_003',
    type: 'expense',
    amount: 82.46,
    category: 'Groceries',
    note: 'Weekly groceries',
    date: '2026-05-04',
    createdAt: '2026-05-04T18:42:00.000Z'
  },
  {
    id: 'txn_004',
    type: 'expense',
    amount: 14.99,
    category: 'Subscriptions',
    note: 'Music streaming',
    date: '2026-05-06',
    isRecurring: true,
    recurrenceFrequency: 'monthly',
    recurrenceStartDate: '2026-05-06',
    lastGeneratedDate: '2026-05-06',
    nextOccurrenceDate: '2026-06-06',
    recurringSeriesId: 'txn_004',
    createdAt: '2026-05-06T12:05:00.000Z'
  },
  {
    id: 'txn_005',
    type: 'income',
    amount: 620,
    category: 'Freelance',
    note: 'Logo project',
    date: '2026-05-09',
    createdAt: '2026-05-09T16:20:00.000Z'
  },
  {
    id: 'txn_006',
    type: 'expense',
    amount: 36.5,
    category: 'Transport',
    note: 'Transit card reload',
    date: '2026-05-11',
    createdAt: '2026-05-11T10:12:00.000Z'
  }
];
