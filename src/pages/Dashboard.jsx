import { ArrowUpRight, CheckCircle2, Plus } from 'lucide-react';
import { Card } from '../components/Card.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { TransactionItem } from '../components/TransactionItem.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import {
  getMonthSpending,
  getMonthlyCategorySpending,
  getRecentTransactions,
  getTodaySummary,
  getWeekSpending,
  summarizeTransactions
} from '../utils/summaries.js';

export function Dashboard({ onNavigate, saveMessage, transactions }) {
  const currency = useCurrency();
  const summary = summarizeTransactions(transactions);
  const todaySummary = getTodaySummary(transactions);
  const weekSpending = getWeekSpending(transactions);
  const monthSpending = getMonthSpending(transactions);
  const recentTransactions = getRecentTransactions(transactions, 5);
  const categorySpending = getMonthlyCategorySpending(transactions).slice(0, 4);

  return (
    <div className="space-y-5">
      {saveMessage ? (
        <div className="flex items-center gap-3 rounded-3xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 shadow-sm">
          <CheckCircle2 size={19} />
          <span>{saveMessage}</span>
        </div>
      ) : null}

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

      <button
        type="button"
        onClick={() => onNavigate('add')}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-3xl bg-mint text-base font-bold text-white shadow-lg shadow-teal-100"
      >
        <Plus size={20} />
        Add Transaction
      </button>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="This week" tone="coral" value={weekSpending} />
        <StatCard label="This month" tone="slate" value={monthSpending} />
      </div>

      <Card>
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
              <CategoryBar key={item.category} item={item} monthSpending={monthSpending} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-500">
            No spending recorded this month yet.
          </p>
        )}
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent activity</h2>
          <button
            type="button"
            onClick={() => onNavigate('transactions')}
            className="text-sm font-semibold text-mint"
          >
            See all
          </button>
        </div>
        <div className="space-y-3">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <p className="rounded-3xl bg-white px-4 py-5 text-sm font-semibold text-slate-500 shadow-sm">
              No transactions yet.
            </p>
          )}
        </div>
      </section>
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

function CategoryBar({ item, monthSpending }) {
  const currency = useCurrency();
  const width = `${Math.max(6, item.percentage)}%`;

  return (
    <div>
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
        <div className="h-full rounded-full bg-mint" style={{ width }} />
      </div>
    </div>
  );
}
