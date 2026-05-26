import { CalendarDays, CheckCircle2, Minus, Pencil, Plus, Target, Trash2 } from 'lucide-react';
import { pressableStyles } from '../../constants/motion.js';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { formatShortDate } from '../../utils/formatting/index.js';
import { Button } from '../ui/Button.jsx';
import { GoalProgressBar } from './GoalProgressBar.jsx';

function getStatusClasses(status) {
  if (status === 'completed') {
    return {
      badge: 'bg-teal-50 text-mint',
      icon: 'bg-teal-50 text-mint',
      ring: 'ring-1 ring-teal-100'
    };
  }

  if (status === 'behind') {
    return {
      badge: 'bg-amber-50 text-amber-700',
      icon: 'bg-amber-50 text-amber-600',
      ring: 'ring-1 ring-amber-100'
    };
  }

  return {
    badge: 'bg-slate-100 text-slate-600',
    icon: 'bg-slate-100 text-slate-600',
    ring: ''
  };
}

export function GoalCard({ goal, onContribute, onDelete, onEdit, onSubtract }) {
  const currency = useCurrency();
  const classes = getStatusClasses(goal.status);
  const isCompleted = goal.currentAmount >= goal.targetAmount;

  return (
    <div className={`rounded-3xl bg-white p-4 shadow-sm ${classes.ring} ${
      isCompleted ? 'shadow-teal-100/70' : pressableStyles
    }`}>
      <div className="flex items-start gap-3">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${classes.icon} ${
          isCompleted ? 'animate-goal-complete motion-reduce:animate-none' : ''
        }`}>
          {isCompleted ? <CheckCircle2 size={21} /> : goal.icon ? <span className="text-lg">{goal.icon}</span> : <Target size={20} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-bold text-ink">{goal.name}</p>
              <p className="mt-1 text-sm font-semibold text-slate-400">
                Saved {formatCurrency(goal.currentAmount, currency)} of {formatCurrency(goal.targetAmount, currency)}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${classes.badge} ${
              isCompleted ? 'animate-soft-slide-in motion-reduce:animate-none' : ''
            }`}>
              {isCompleted ? (
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  {goal.statusLabel}
                </span>
              ) : (
                goal.statusLabel
              )}
            </span>
          </div>

          <div className="mt-3">
            <GoalProgressBar percentage={goal.progressPercentage} status={goal.status} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className={`text-xs font-bold ${isCompleted ? 'text-mint' : 'text-slate-400'}`}>
              {isCompleted ? 'Goal fully funded' : `${goal.progressPercentage}% funded`}
            </p>
            {goal.targetDate ? (
              <p className="inline-flex items-center gap-1 text-xs font-bold text-slate-400">
                <CalendarDays size={13} />
                {formatShortDate(goal.targetDate)}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <GoalMetric label="Remaining" value={formatCurrency(goal.remainingAmount, currency)} />
        <GoalMetric label="Target" value={formatCurrency(goal.targetAmount, currency)} />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        <Button
          disabled={isCompleted}
          onClick={() => onContribute(goal)}
          className={`flex h-10 items-center justify-center gap-1 rounded-2xl text-xs font-bold ${
            isCompleted
              ? 'cursor-not-allowed bg-teal-50 text-mint opacity-70 hover:translate-y-0 hover:shadow-none active:scale-100'
              : 'bg-teal-50 text-mint'
          }`}
          aria-disabled={isCompleted}
        >
          {isCompleted ? <CheckCircle2 size={15} /> : <Plus size={15} />}
          {isCompleted ? 'Funded' : 'Add'}
        </Button>
        <Button
          onClick={() => onSubtract(goal)}
          className="flex h-10 items-center justify-center gap-1 rounded-2xl bg-slate-100 text-xs font-bold text-slate-600"
        >
          <Minus size={15} />
          Subtract
        </Button>
        <Button
          onClick={() => onEdit(goal)}
          className="flex h-10 items-center justify-center gap-1 rounded-2xl bg-slate-100 text-xs font-bold text-slate-600"
        >
          <Pencil size={15} />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(goal.id)}
          className="flex h-10 items-center justify-center gap-1 rounded-2xl bg-rose-50 text-xs font-bold text-coral"
        >
          <Trash2 size={15} />
          Delete
        </Button>
      </div>

      {/* TODO: Archive completed goals, add a celebration screen, auto-move excess funds, and show goal history/timeline. */}
      {/* TODO: Link savings goals to budgets and shared savings groups. */}
    </div>
  );
}

function GoalMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}
