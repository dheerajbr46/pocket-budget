import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { Card } from '../ui/Card.jsx';
import { CategoryIcon } from './CategoryIcon.jsx';

export function CategorySummaryCard({ summary }) {
  const currency = useCurrency();

  return (
    <Card>
      <div className="flex items-start gap-3">
        <CategoryIcon category={summary.category} className="h-14 w-14 rounded-3xl bg-teal-50 text-mint" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Category</p>
          <h2 className="mt-1 truncate text-2xl font-bold">{summary.category}</h2>
          <p className="mt-1 text-sm text-slate-500">{summary.totalTransactionCount} total transactions</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <SummaryMetric label="This week" value={formatCurrency(summary.totalSpentThisWeek, currency)} />
        <SummaryMetric label="This month" value={formatCurrency(summary.totalSpentThisMonth, currency)} />
        <SummaryMetric label="Average" value={formatCurrency(summary.averageTransactionAmount, currency)} />
        <SummaryMetric
          label="Largest"
          value={summary.largestTransaction ? formatCurrency(summary.largestTransaction.amount, currency) : formatCurrency(0, currency)}
        />
      </div>

      {/* Future extension: category budgets can compare these totals with a user-defined limit. */}
    </Card>
  );
}

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-3xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-lg font-bold">{value}</p>
    </div>
  );
}
