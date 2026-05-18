import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';
import { ArrowUpRight, ArrowsClockwise, CalendarDots, Fire, Plus } from '@phosphor-icons/react';
import { pressableStyles, transitionPresets } from '../../constants/motion.js';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { StatCard } from '../../components/cards/StatCard.jsx';
import { TransactionItem } from '../../components/cards/TransactionItem.jsx';
import { SuccessMessage } from '../../components/feedback/SuccessMessage.jsx';
import { FinancialHealthSummary } from '../../components/cards/FinancialHealthSummary.jsx';
import { WeeklyBarChart } from '../../components/charts/WeeklyBarChart.jsx';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { useDashboardReport } from '../../hooks/useReports.js';
import { formatCurrency } from '../../utils/currency/index.js';
import { getFrequencyLabel } from '../../services/recurringService.js';
import { currentStreak } from '../../utils/transactions/index.js';

export function Dashboard({
  insights = [],
  onCategorySelect,
  onNavigate,
  onTransactionSelect,
  saveMessage,
  transactions
}) {
  const currency = useCurrency();
  const streak = currentStreak(transactions);
  const {
    categorySpending,
    monthSpending,
    recentTransactions,
    summary,
    todaySummary,
    upcomingTimeline,
    weeklyTrend,
    weekSpending
  } = useDashboardReport(transactions);

  return (
    <div className="space-y-5">
      <SuccessMessage message={saveMessage} />
      <FinancialHealthSummary insights={insights} />

      {/* Hero balance card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-hero text-white shadow-ink-glow">
        <div className="pointer-events-none absolute -right-6 -top-6 h-52 w-52 rounded-full bg-mint/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/4 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-24 w-24 rounded-full bg-coral/8 blur-2xl" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">Total balance</p>
            {streak > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                <Fire size={12} weight="fill" className="text-orange-300" />
                {streak}d streak
              </span>
            )}
          </div>
          <p className="mt-3 text-5xl font-bold tracking-tight">
            <AnimatedAmount value={summary.balance} currency={currency} />
          </p>
          <p className="mt-2 text-xs font-medium text-white/35">Stored locally · this browser</p>
        </div>
        <div className="relative mt-6 grid grid-cols-3 gap-2">
          <MiniMetric label="Today in" value={todaySummary.income} />
          <MiniMetric label="Today out" value={todaySummary.expenses} />
          <MiniMetric label="Today net" value={todaySummary.balance} />
        </div>
      </Card>

      <Card className="bg-white/80 p-4 dark:bg-slate-800">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">This week</p>
            <p className="mt-0.5 text-xl font-bold">{formatCurrency(weekSpending, currency)}</p>
          </div>
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="h-2 w-2 rounded-full bg-coral" />
            Daily expenses
          </span>
        </div>
        <WeeklyBarChart data={weeklyTrend} />
      </Card>

      <Button
        onClick={() => onNavigate('add')}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-indigo text-base font-bold text-white shadow-glow transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus size={20} />
        Add Transaction
      </Button>

      <Card className="bg-white/80 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Recurring</p>
            <h2 className="mt-1 text-lg font-bold">Upcoming</h2>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo/10 text-indigo">
            <CalendarDots size={18} />
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
          <p className="rounded-2xl bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-500">
            No upcoming recurring payments yet.
          </p>
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
        <motion.div
          className="space-y-3"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          initial="hidden"
          animate="visible"
        >
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                variants={{
                  hidden: { opacity: 0, x: -14 },
                  visible: { opacity: 1, x: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.35 } }
                }}
              >
                <TransactionItem
                  onSelect={onTransactionSelect}
                  transaction={transaction}
                />
              </motion.div>
            ))
          ) : (
            <p className="rounded-3xl bg-white px-4 py-5 text-sm font-semibold text-slate-500 shadow-card">
              No transactions yet.
            </p>
          )}
        </motion.div>
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
            {categorySpending.map((item, index) => (
              <CategoryBar
                key={item.category}
                index={index}
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
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="This week" tone="coral" value={weekSpending} />
        <StatCard label="This month" tone="slate" value={monthSpending} />
      </div>
    </div>
  );
}

function AnimatedAmount({ value, currency }) {
  const [display, setDisplay] = useState(formatCurrency(0, currency));

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(formatCurrency(Math.round(v), currency))
    });
    return controls.stop;
  }, [value, currency]);

  return <span>{display}</span>;
}

function MiniMetric({ label, value }) {
  const currency = useCurrency();

  return (
    <div className="rounded-2xl bg-white/8 p-3 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-white">{formatCurrency(value, currency)}</p>
    </div>
  );
}

function UpcomingTimelineGroup({ group }) {
  return (
    <div className="relative pl-4">
      <span className="absolute left-0 top-1 h-full w-px bg-slate-200" />
      <span className="absolute left-[-3px] top-1 h-2 w-2 rounded-full bg-gradient-mint" />
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
            <ArrowsClockwise size={10} />
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

function CategoryBar({ index = 0, item, monthSpending, onSelect }) {
  const currency = useCurrency();
  const [animWidth, setAnimWidth] = useState('0%');
  const targetWidth = `${Math.max(6, item.percentage)}%`;

  useEffect(() => {
    const id = setTimeout(() => setAnimWidth(targetWidth), 60 + index * 90);
    return () => clearTimeout(id);
  }, [targetWidth, index]);

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
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo transition-all duration-700 ease-out"
          style={{ width: animWidth }}
        />
      </div>
    </button>
  );
}
