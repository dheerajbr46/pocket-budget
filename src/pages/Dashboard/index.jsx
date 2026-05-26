import { ArrowUpRight, CalendarClock, Plus, Repeat2, Target } from 'lucide-react';
import { pressableStyles, transitionPresets } from '../../constants/motion.js';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { StatCard } from '../../components/cards/StatCard.jsx';
import { TransactionItem } from '../../components/cards/TransactionItem.jsx';
import { SuccessMessage } from '../../components/feedback/SuccessMessage.jsx';
import { FinancialHealthSummary } from '../../components/cards/FinancialHealthSummary.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { useDashboardReport } from '../../hooks/useReports.js';
import { formatCurrency } from '../../utils/currency/index.js';
import { formatShortDate } from '../../utils/formatting/index.js';
import { getFrequencyLabel } from '../../services/recurringService.js';

export function Dashboard({
  insights = [],
  onCategorySelect,
  onNavigate,
  onTransactionSelect,
  saveMessage,
  savingsOverview,
  transactions
}) {
  const currency = useCurrency();
  const {
    categorySpending,
    monthSpending,
    recentTransactions,
    summary,
    todaySummary,
    upcomingTimeline,
    weekSpending
  } = useDashboardReport(transactions);

  return (
    <div className="space-y-5">
      <SuccessMessage message={saveMessage} />
      <FinancialHealthSummary insights={insights} />

      <Card className="bg-ink text-white">
        <div>
          <p className="text-sm font-medium text-white/65">Total balance</p>
          <p className="mt-2 text-4xl font-bold">{formatCurrency(summary.balance, currency)}</p>
          <p className="mt-2 text-sm text-white/65">Saved locally in this browser</p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <MiniMetric label="Today in" value={todaySummary.income} />
          <MiniMetric label="Today out" value={todaySummary.expenses} />
          <MiniMetric label="Today net" value={todaySummary.balance} />
        </div>
      </Card>

      <Button
        onClick={() => onNavigate('add')}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-3xl bg-mint text-base font-bold text-white shadow-lg shadow-teal-100"
      >
        <Plus size={20} />
        Add Transaction
      </Button>

      {savingsOverview ? (
        <Card className="bg-white/80 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Savings Goals</p>
              <h2 className="mt-1 text-lg font-bold">Goal progress</h2>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-mint">
              <Target size={18} />
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <SavingsMetric label="Saved" value={savingsOverview.totalSaved} />
            <SavingsMetric label="Remaining" value={savingsOverview.totalRemaining} />
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <div className="min-w-0 rounded-2xl bg-slate-50 px-3 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Nearest deadline</p>
              <p className="mt-1 truncate text-sm font-bold text-ink">
                {savingsOverview.nearestDeadline
                  ? `${savingsOverview.nearestDeadline.name} • ${formatShortDate(savingsOverview.nearestDeadline.targetDate)}`
                  : 'No dated goals'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Done</p>
              <p className="mt-1 text-sm font-bold text-ink">{savingsOverview.completedCount}</p>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => onNavigate('savings')}
              className="shrink-0 rounded-2xl bg-white px-3 py-2 text-sm font-bold text-mint"
            >
              View
            </Button>
          </div>
        </Card>
      ) : null}

      <Card className="bg-white/80 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Recurring</p>
            <h2 className="mt-1 text-lg font-bold">Upcoming</h2>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-mint">
            <CalendarClock size={18} />
          </span>
        </div>

        {upcomingTimeline.items.length > 0 ? (
          <div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <UpcomingTotal label="This week" value={upcomingTimeline.totals.week} />
              <UpcomingTotal label="This month" value={upcomingTimeline.totals.month} />
            </div>
            <div className="space-y-3">
              {upcomingTimeline.groups.map((group) => (
                <UpcomingTimelineGroup key={group.id} group={group} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-slate-50 px-4 py-4">
            <p className="text-sm font-bold text-slate-700">No recurring transactions yet</p>
            <p className="mt-1 text-sm text-slate-500">Create one for rent, subscriptions, or paychecks.</p>
            <Button onClick={() => onNavigate('add')} className="mt-3 rounded-2xl bg-white px-3 py-2 text-sm font-bold text-mint">
              Create recurring payment
            </Button>
          </div>
        )}
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
          <Button
            onClick={() => onNavigate('transactions')}
            className="text-sm font-semibold text-mint"
          >
            View all
          </Button>
        </div>
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                onSelect={onTransactionSelect}
                transaction={transaction}
              />
            ))
          ) : (
            <div className="rounded-3xl bg-white px-4 py-5 shadow-sm">
              <p className="text-sm font-bold text-slate-700">No transactions yet</p>
              <p className="mt-1 text-sm text-slate-500">Add your first transaction to start seeing activity.</p>
              <Button onClick={() => onNavigate('add')} className="mt-3 rounded-2xl bg-teal-50 px-3 py-2 text-sm font-bold text-mint">
                Add your first transaction
              </Button>
            </div>
          )}
        </div>
      </section>

      <Card className="bg-white/70 p-4">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">This month</p>
          <div className="mt-1 flex items-end justify-between gap-3">
            <h2 className="text-lg font-bold">Top categories</h2>
            <p className="text-sm font-bold text-slate-500">{formatCurrency(monthSpending, currency)}</p>
          </div>
        </div>

        {categorySpending.length > 0 ? (
          <div className="space-y-4">
            {categorySpending.map((item) => (
              <CategoryBar
                key={item.category}
                item={item}
                monthSpending={monthSpending}
                onSelect={onCategorySelect}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-500">
            No spending recorded this month yet.
          </p>
        )}

        {/* TODO: Add horizontal top-category cards for faster scanning. */}
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="This week" tone="coral" value={weekSpending} />
        <StatCard label="This month" tone="slate" value={monthSpending} />
      </div>

      {/* Future extension: budget goals can surface here beside monthly progress. */}
      {/* TODO: Add a compact dashboard mode for dense everyday check-ins. */}
    </div>
  );
}

function MiniMetric({ label, value }) {
  const currency = useCurrency();

  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-white">{formatCurrency(value, currency)}</p>
    </div>
  );
}

function SavingsMetric({ label, value }) {
  const currency = useCurrency();

  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-ink">{formatCurrency(value, currency)}</p>
    </div>
  );
}

function UpcomingTimelineGroup({ group }) {
  return (
    <div className="relative pl-4">
      <span className="absolute left-0 top-1 h-full w-px bg-slate-200" />
      <span className="absolute left-[-3px] top-1 h-2 w-2 rounded-full bg-mint" />
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{group.label}</p>
      <div className="space-y-2">
        {group.items.map((transaction) => (
          <UpcomingRecurringItem key={`${transaction.id}-${transaction.nextDate}`} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}

function UpcomingRecurringItem({ transaction }) {
  const currency = useCurrency();
  const isIncome = transaction.type === 'income';

  return (
    <div className={`flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3 ${pressableStyles}`}>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">
          {transaction.note || transaction.category}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-xs font-semibold text-slate-400">{transaction.category}</p>
          <span className={`inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-bold text-slate-500 ${transitionPresets.base}`}>
            <Repeat2 size={10} />
            {getFrequencyLabel(transaction.recurrenceFrequency)}
          </span>
        </div>
      </div>
      <p className={`shrink-0 text-sm font-bold ${isIncome ? 'text-mint' : 'text-ink'}`}>
        {isIncome ? '+' : '-'}
        {formatCurrency(transaction.amount, currency)}
      </p>
    </div>
  );
}

function UpcomingTotal({ label, value }) {
  const currency = useCurrency();

  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-ink">{formatCurrency(value, currency)}</p>
    </div>
  );
}

function CategoryBar({ item, monthSpending, onSelect }) {
  const currency = useCurrency();
  const width = `${Math.max(6, item.percentage)}%`;

  return (
    <button type="button" onClick={() => onSelect(item.category)} className={`block w-full rounded-2xl text-left ${pressableStyles}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-teal-50 text-mint">
            <ArrowUpRight size={16} />
          </span>
          <span className="truncate text-sm font-bold">{item.category}</span>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{formatCurrency(item.amount, currency)}</p>
          <p className="text-xs font-semibold text-slate-400">
            {monthSpending > 0 ? `${item.percentage}%` : '0%'}
          </p>
        </div>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-mint transition-all duration-700 ease-out" style={{ width }} />
      </div>
    </button>
  );
}
