import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { CategorySummaryCard } from '../../components/cards/CategorySummaryCard.jsx';
import { CategoryTransactionList } from '../../components/cards/CategoryTransactionList.jsx';
import { CategoryTrendCard } from '../../components/cards/CategoryTrendCard.jsx';
import {
  calculateCategorySummary,
  calculateCategoryTrend
} from '../../services/reportService.js';

const periodOptions = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' }
];

export function CategoryDetail({ category, onBack, onPeriodChange, period, transactions }) {
  if (!category) {
    return (
      <div className="space-y-5">
        <Card>
          <p className="font-bold">No category selected</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Choose a category from Dashboard or Reports to see its details.
          </p>
          <Button onClick={onBack} className="mt-4 h-12 rounded-2xl bg-ink px-5 font-bold text-white">
            Back
          </Button>
        </Card>
      </div>
    );
  }

  const summary = calculateCategorySummary(transactions, category, { period });
  const trend = calculateCategoryTrend(transactions, category, { period });

  return (
    <div className="space-y-5">
      <Button
        onClick={onBack}
        className="flex h-11 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-slate-600 shadow-sm"
      >
        <ArrowLeft size={18} />
        Back
      </Button>

      <CategorySummaryCard summary={summary} />

      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
        {periodOptions.map((option) => {
          const isActive = period === option.id;

          return (
            <Button
              key={option.id}
              onClick={() => onPeriodChange(option.id)}
              className={`rounded-xl px-2 py-3 text-xs font-bold transition ${
                isActive ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
              }`}
            >
              {option.label}
            </Button>
          );
        })}
      </div>

      <CategoryTrendCard period={period} trend={trend} />
      <CategoryTransactionList period={period} transactions={summary.transactions} />

      {/* Future extension: recurring category expenses can be detected and summarized here. */}
    </div>
  );
}
