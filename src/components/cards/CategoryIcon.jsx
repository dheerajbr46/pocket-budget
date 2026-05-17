import {
  HeartPulse,
  Home,
  MoreHorizontal,
  Music,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Utensils,
  Zap,
  Car
} from 'lucide-react';

const categoryIconMap = {
  Entertainment: Music,
  Food: Utensils,
  Groceries: ShoppingCart,
  Health: HeartPulse,
  Other: MoreHorizontal,
  Rent: Home,
  Shopping: ShoppingBag,
  Subscriptions: Receipt,
  Transport: Car,
  Utilities: Zap
};

export function CategoryIcon({ category, className = 'h-11 w-11 rounded-2xl bg-teal-50 text-mint' }) {
  const Icon = categoryIconMap[category] ?? MoreHorizontal;

  return (
    <span className={`grid shrink-0 place-items-center ${className}`}>
      <Icon size={20} />
    </span>
  );
}
