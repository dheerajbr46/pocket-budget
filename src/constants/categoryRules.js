export const categoryRules = [
  {
    category: 'Food',
    confidence: 'high',
    keywords: ['starbucks', 'coffee', 'cafe', 'chipotle', 'restaurant', 'pizza', 'dining', 'burger']
  },
  {
    category: 'Groceries',
    confidence: 'medium',
    keywords: ['costco', 'grocery', 'groceries', 'trader joes', 'whole foods', 'market']
  },
  {
    category: 'Shopping',
    confidence: 'medium',
    keywords: ['target', 'walmart', 'amazon', 'shopping', 'store']
  },
  {
    category: 'Subscriptions',
    confidence: 'high',
    keywords: ['netflix', 'spotify', 'hulu', 'subscription', 'prime', 'disney']
  },
  {
    category: 'Transport',
    confidence: 'high',
    keywords: ['uber', 'lyft', 'gas', 'shell', 'chevron', 'parking', 'transit']
  },
  {
    category: 'Rent',
    confidence: 'high',
    keywords: ['rent', 'apartment', 'landlord', 'lease']
  },
  {
    category: 'Health',
    confidence: 'medium',
    keywords: ['gym', 'pharmacy', 'doctor', 'dentist', 'clinic', 'health']
  },
  {
    category: 'Salary',
    confidence: 'high',
    keywords: ['paycheck', 'salary', 'payroll']
  },
  {
    category: 'Freelance',
    confidence: 'high',
    keywords: ['freelance', 'client', 'project', 'invoice']
  }
];

export const confidenceRank = {
  high: 3,
  medium: 2,
  low: 1
};

// TODO: Add merchant database, emoji category icons, user-defined rules, bulk recategorization, and optional AI explanation layer later.
