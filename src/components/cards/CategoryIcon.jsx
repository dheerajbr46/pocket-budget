import {
  Heartbeat,
  House,
  DotsThree,
  MusicNote,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  ForkKnife,
  Lightning,
  Car
} from '@phosphor-icons/react';

const categoryIconMap = {
  Entertainment: MusicNote,
  Food: ForkKnife,
  Groceries: ShoppingCart,
  Health: Heartbeat,
  Other: DotsThree,
  Rent: House,
  Shopping: ShoppingBag,
  Subscriptions: Receipt,
  Transport: Car,
  Utilities: Lightning
};

export function CategoryIcon({ category, className = 'h-11 w-11 rounded-2xl bg-teal-50 text-mint' }) {
  const Icon = categoryIconMap[category] ?? DotsThree;

  return (
    <span className={`grid shrink-0 place-items-center ${className}`}>
      <Icon size={20} />
    </span>
  );
}
