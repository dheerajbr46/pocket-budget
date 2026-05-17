import { CheckCircle, Fire, Prohibit, Warning } from '@phosphor-icons/react';

const iconMap = {
  alert: Warning,
  ban: Prohibit,
  check: CheckCircle,
  flame: Fire
};

export function BudgetStatusBadge({ health }) {
  const Icon = iconMap[health.icon] ?? CheckCircle;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${health.badgeClass}`}>
      <Icon size={14} />
      {health.label}
    </span>
  );
}
