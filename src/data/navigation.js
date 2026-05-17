import { BarChart3, Home, List, PlusCircle, Settings } from 'lucide-react';

export const navItems = [
  { id: 'dashboard', title: 'Dashboard', label: 'Home', icon: Home },
  { id: 'transactions', title: 'Transactions', label: 'Activity', icon: List },
  { id: 'add', title: 'Add Transaction', label: 'Add', icon: PlusCircle },
  { id: 'reports', title: 'Reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', title: 'Settings', label: 'Settings', icon: Settings }
];
