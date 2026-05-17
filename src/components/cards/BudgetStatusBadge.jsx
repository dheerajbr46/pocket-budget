import { AlertTriangle, Ban, CheckCircle2, Flame } from 'lucide-react';

const iconMap = {
  alert: AlertTriangle,
  ban: Ban,
  check: CheckCircle2,
  flame: Flame
};

export function BudgetStatusBadge({ health }) {
  const Icon = iconMap[health.icon] ?? CheckCircle2;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${health.badgeClass}`}>
      <Icon size={14} />
      {health.label}
    </span>
  );
}
