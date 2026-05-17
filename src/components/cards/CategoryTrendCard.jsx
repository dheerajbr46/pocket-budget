import { ArrowDownRight, ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { Card } from '../ui/Card.jsx';

const trendCopy = {
  all: 'All-time view has no previous period comparison.',
  month: 'Compared with last month',
  week: 'Compared with last week'
};

export function CategoryTrendCard({ period, trend }) {
  const currency = useCurrency();
  const isUp = trend.direction === 'up';
  const isDown = trend.direction === 'down';
  const Icon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : ArrowRight;
  const tone = isUp ? 'text-coral bg-rose-50' : isDown ? 'text-mint bg-teal-50' : 'text-slate-500 bg-slate-100';

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className={`grid h-11 w-11 place-items-center rounded-2xl ${tone}`}>
          <Icon size={20} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Trend</p>
          <h2 className="mt-1 text-lg font-bold">
            {isUp ? 'Spending is up' : isDown ? 'Spending is down' : 'Spending is steady'}
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-500">{trendCopy[period]}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <TrendMetric label="Current" value={formatCurrency(trend.currentTotal, currency)} />
        <TrendMetric label="Previous" value={formatCurrency(trend.previousTotal, currency)} />
      </div>
      <p className={`mt-4 text-sm font-bold ${isUp ? 'text-coral' : isDown ? 'text-mint' : 'text-slate-500'}`}>
        {trend.changeAmount === 0
          ? 'No change'
          : `${trend.changeAmount > 0 ? '+' : ''}${formatCurrency(trend.changeAmount, currency)} ${
              trend.percentageChange ? `(${trend.percentageChange}%)` : ''
            }`}
      </p>

      {/* Future extension: AI spending insights can explain the reason behind category trend changes. */}
    </Card>
  );
}

function TrendMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-bold">{value}</p>
    </div>
  );
}
