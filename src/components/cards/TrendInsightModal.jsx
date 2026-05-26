import { AlertTriangle, CheckCircle2, Info, TrendingDown, TrendingUp } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { BottomSheet } from '../ui/BottomSheet.jsx';

function getTone(trend, positiveWhen) {
  if (trend.direction === positiveWhen) {
    return {
      bg: 'bg-teal-50',
      icon: CheckCircle2,
      text: 'text-mint',
      title: 'Looking good'
    };
  }

  if (trend.type === 'savings') {
    return {
      bg: 'bg-rose-50',
      icon: AlertTriangle,
      text: 'text-coral',
      title: 'Needs attention'
    };
  }

  return {
    bg: 'bg-amber-50',
    icon: AlertTriangle,
    text: 'text-amber-600',
    title: 'Watch closely'
  };
}

function getSummary(trend, label, positiveWhen) {
  const isPositive = trend.direction === positiveWhen;

  if (trend.type === 'weekly') {
    return isPositive
      ? 'Weekly spending is lower than the previous week.'
      : 'Weekly spending is running higher than the previous week.';
  }

  if (trend.type === 'savings') {
    return isPositive
      ? 'Savings improved compared with last month.'
      : 'Savings are lower than last month.';
  }

  return isPositive
    ? `${label} spending is lower than last month.`
    : `${label} is contributing more to spending this month.`;
}

export function TrendMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-2 truncate text-sm font-bold text-ink">{value}</p>
    </div>
  );
}

export function InsightRow({ icon: Icon = Info, label, tone = 'slate', value }) {
  const toneClass = {
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-coral',
    slate: 'bg-slate-50 text-slate-600',
    teal: 'bg-teal-50 text-mint'
  }[tone];

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-3">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${toneClass}`}>
        <Icon size={16} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
        <p className="mt-1 truncate text-sm font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

export function TrendInsightModal({ isOpen, onClose, selectedTrend }) {
  const currency = useCurrency();

  if (!selectedTrend) {
    return null;
  }

  const { label, positiveWhen, trend } = selectedTrend;
  const tone = getTone(trend, positiveWhen);
  const ToneIcon = tone.icon;
  const DirectionIcon = trend.direction === 'down' ? TrendingDown : TrendingUp;
  const percentText = typeof trend.percentageChange === 'number'
    ? `${Math.abs(trend.percentageChange)}% ${trend.direction === 'down' ? 'decrease' : 'increase'}`
    : `${trend.direction === 'down' ? 'Lower' : 'Higher'} than before`;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={label}>
      <div className="mt-4 space-y-4">
        <div className={`rounded-3xl p-4 ${tone.bg}`}>
          <div className="flex items-start gap-3">
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white ${tone.text}`}>
              <ToneIcon size={18} />
            </span>
            <div>
              <p className={`text-sm font-bold ${tone.text}`}>{tone.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">{getSummary(trend, label, positiveWhen)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <TrendMetric label="Current" value={formatCurrency(trend.currentTotal ?? 0, currency)} />
          <TrendMetric label="Previous" value={formatCurrency(trend.previousTotal ?? 0, currency)} />
          <TrendMetric label="Difference" value={formatCurrency(Math.abs(trend.changeAmount ?? 0), currency)} />
          <TrendMetric label="Direction" value={trend.direction === 'down' ? 'Down' : 'Up'} />
        </div>

        <div className="space-y-2 rounded-3xl bg-slate-50 p-2">
          {trend.type === 'weekly' ? (
            <>
              <InsightRow icon={DirectionIcon} label="Week-over-week" tone={trend.direction === 'down' ? 'teal' : 'amber'} value={percentText} />
              <InsightRow icon={Info} label="Biggest category" value={trend.biggestCategory} />
              <InsightRow
                icon={Info}
                label="Transactions"
                value={`${trend.currentTransactionCount} this week • ${trend.previousTransactionCount} last week`}
              />
            </>
          ) : null}

          {trend.type === 'savings' ? (
            <>
              <InsightRow icon={DirectionIcon} label="Savings movement" tone={trend.direction === 'up' ? 'teal' : 'rose'} value={formatCurrency(trend.changeAmount, currency)} />
              <InsightRow icon={Info} label="Current savings" value={formatCurrency(trend.currentTotal, currency)} />
              <InsightRow icon={Info} label="Previous month" value={formatCurrency(trend.previousTotal, currency)} />
            </>
          ) : null}

          {trend.type === 'category' ? (
            <>
              <InsightRow icon={DirectionIcon} label="Month-over-month" tone={trend.direction === 'down' ? 'teal' : 'amber'} value={formatCurrency(trend.changeAmount, currency)} />
              <InsightRow icon={Info} label="Contribution" value={`${trend.contributionPercentage}% of spending`} />
              <InsightRow icon={Info} label="Budget status" value={trend.budgetStatus} />
            </>
          ) : null}
        </div>
      </div>

      {/* TODO: Add sparkline mini charts, AI-generated insights, predictive trends, anomaly detection, and custom time range comparison. */}
    </BottomSheet>
  );
}
