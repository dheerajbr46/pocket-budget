import { TrendingDown, TrendingUp } from 'lucide-react';
import { pressableStyles } from '../../constants/motion.js';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { Card } from '../ui/Card.jsx';

export function TrendCard({ label, onSelect, positiveWhen, trend }) {
  const currency = useCurrency();
  const isPositive = trend.direction === positiveWhen;
  const Icon = trend.direction === 'down' ? TrendingDown : TrendingUp;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`block w-full text-left ${pressableStyles}`}
      aria-label={`Open ${label} trend details`}
    >
      <Card className="bg-white/80 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className={`grid h-10 w-10 place-items-center rounded-2xl ${
              isPositive ? 'bg-teal-50 text-mint' : 'bg-amber-50 text-amber-600'
            }`}>
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">{label}</p>
              <p className="mt-1 text-xs font-semibold text-slate-400">
                {trend.direction === 'down' ? 'Lower than before' : 'Higher than before'}
              </p>
            </div>
          </div>
          <p className={`shrink-0 text-sm font-bold ${isPositive ? 'text-mint' : 'text-amber-600'}`}>
            {trend.changeAmount >= 0 ? '+' : '-'}
            {formatCurrency(Math.abs(trend.changeAmount), currency)}
          </p>
        </div>
      </Card>
    </button>
  );
}
