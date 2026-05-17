import { Pencil, Trash2 } from 'lucide-react';
import { pressableStyles } from '../../constants/motion.js';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { Button } from '../ui/Button.jsx';
import { CategoryIcon } from './CategoryIcon.jsx';
import { BudgetProgressBar } from './BudgetProgressBar.jsx';
import { BudgetStatusBadge } from './BudgetStatusBadge.jsx';

export function BudgetCard({ budget, onDelete, onEdit }) {
  const currency = useCurrency();
  const health = budget.health;
  const iconTintClass = {
    critical: 'h-11 w-11 rounded-2xl bg-rose-50 text-coral',
    exceeded: 'h-11 w-11 rounded-2xl bg-rose-100 text-coral',
    healthy: 'h-11 w-11 rounded-2xl bg-teal-50 text-mint',
    warning: 'h-11 w-11 rounded-2xl bg-amber-50 text-amber-600'
  }[budget.status];

  return (
    <div className={`rounded-3xl bg-white p-4 shadow-sm ${pressableStyles} ${health.accentClass}`}>
      <div className="flex items-start gap-3">
        <CategoryIcon category={budget.category} className={iconTintClass} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-bold">{budget.category}</p>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                Budget {formatCurrency(budget.amount, currency)}
              </p>
            </div>
            <BudgetStatusBadge health={health} />
          </div>

          <div className="mt-3">
            <BudgetProgressBar percentage={budget.percentageUsed} status={budget.status} />
          </div>
          <p className="mt-2 text-xs font-bold text-slate-400">{budget.percentageUsed}% used</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <BudgetMetric label="Spent" value={formatCurrency(budget.currentSpending, currency)} />
        <BudgetMetric
          label={budget.remainingAmount < 0 ? 'Over by' : 'Remaining'}
          value={formatCurrency(Math.abs(budget.remainingAmount), currency)}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          onClick={() => onEdit(budget)}
          className="flex h-10 items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-bold text-slate-600"
        >
          <Pencil size={16} />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(budget.id)}
          className="flex h-10 items-center justify-center gap-2 rounded-2xl bg-rose-50 text-sm font-bold text-coral"
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>

      {/* Future extension: recurring budget resets can snapshot progress before a new month begins. */}
    </div>
  );
}

function BudgetMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-bold">{value}</p>
    </div>
  );
}
