import { ChartBar, GearSix, House, ListBullets, PiggyBank, PlusCircle } from '@phosphor-icons/react';

export const navItems = [
  { id: 'dashboard', title: 'Dashboard', label: 'Home', icon: House },
  { id: 'transactions', title: 'Transactions', label: 'Activity', icon: ListBullets },
  { id: 'add', title: 'Add Transaction', label: 'Add', icon: PlusCircle },
  { id: 'budgets', title: 'Budgets', label: 'Budgets', icon: PiggyBank },
  { id: 'reports', title: 'Reports', label: 'Reports', icon: ChartBar },
  { id: 'settings', title: 'Settings', label: 'Settings', icon: GearSix }
];
