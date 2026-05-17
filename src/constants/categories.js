export const expenseCategories = [
  'Food',
  'Groceries',
  'Rent',
  'Utilities',
  'Transport',
  'Shopping',
  'Subscriptions',
  'Health',
  'Entertainment',
  'Other'
];

export const incomeCategories = ['Salary', 'Bonus', 'Freelance', 'Refund', 'Other'];

export function getCategoriesForType(type) {
  return type === 'income' ? incomeCategories : expenseCategories;
}
