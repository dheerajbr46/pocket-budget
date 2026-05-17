import { Card } from '../components/Card.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { getPeriodReport } from '../utils/summaries.js';

export function Reports({ transactions }) {
  const weeklyReport = getPeriodReport(transactions, 'week');
  const monthlyReport = getPeriodReport(transactions, 'month');

  return (
    <div className="space-y-5">
      <ReportSection
        description="A quick look at money in and out since Sunday."
        report={weeklyReport}
        title="Weekly Summary"
      />

      <ReportSection
        description="Your month-to-date view for everyday budgeting."
        report={monthlyReport}
        title="Monthly Summary"
      />

      <Card className="bg-slate-100">
        <p className="text-sm font-semibold text-slate-700">Report notes</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Income is money coming in. Expenses are money going out. Net savings is income minus expenses for the period.
        </p>
      </Card>

      {/* Future feature: add date range pickers, exportable summaries, and richer charts. */}
    </div>
  );
}

function ReportSection({ description, report, title }) {
  const currency = useCurrency();
  const { categories, summary, topCategory, transactionCount } = report;

  return (
    <section className="space-y-3">
      <div className="px-1">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Income" tone="mint" value={summary.income} />
        <StatCard label="Expenses" tone="coral" value={summary.expenses} />
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-3">
          <PlainMetric label="Net savings" value={summary.balance} />
          <PlainMetric label="Transactions" value={transactionCount} variant="count" />
        </div>

        <div className="mt-4 rounded-3xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Top spending category</p>
          {topCategory ? (
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-lg font-bold">{topCategory.category}</p>
                <p className="text-sm font-semibold text-slate-500">{topCategory.percentage}% of spending</p>
              </div>
              <p className="text-lg font-bold text-coral">{formatCurrency(topCategory.amount, currency)}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm font-semibold text-slate-500">No expenses in this period yet.</p>
          )}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Breakdown</p>
            <h3 className="mt-1 text-lg font-bold">Spending by category</h3>
          </div>
          <p className="text-sm font-bold text-slate-500">{formatCurrency(summary.expenses, currency)}</p>
        </div>

        {categories.length > 0 ? (
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryBar key={category.category} category={category} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-500">
            No category spending to show yet.
          </p>
        )}
      </Card>
    </section>
  );
}

function PlainMetric({ label, value, variant = 'currency' }) {
  const currency = useCurrency();

  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-bold text-ink">
        {variant === 'currency' ? formatCurrency(value, currency) : value}
      </p>
    </div>
  );
}

function CategoryBar({ category }) {
  const currency = useCurrency();
  const width = `${Math.max(6, category.percentage)}%`;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{category.category}</p>
          <p className="text-xs font-semibold text-slate-400">{category.percentage}% of expenses</p>
        </div>
        <p className="shrink-0 text-sm font-bold">{formatCurrency(category.amount, currency)}</p>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-mint" style={{ width }} />
      </div>
    </div>
  );
}
