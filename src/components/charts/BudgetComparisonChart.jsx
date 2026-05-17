import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';

const STATUS_COLORS = {
  healthy: '#14b8a6',
  warning: '#f59e0b',
  critical: '#fb7185',
  exceeded: '#fb7185'
};

function BudgetTooltip({ active, currency, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;

  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 shadow-card-md dark:border-slate-700 dark:bg-slate-800">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{d.category}</p>
      <p className="mt-1 text-sm font-bold text-ink">
        {formatCurrency(d.spent, currency)}
        <span className="ml-1 font-semibold text-slate-400">/ {formatCurrency(d.budget, currency)}</span>
      </p>
      <p className="mt-0.5 text-[11px] font-semibold text-slate-400">{d.pct}% used</p>
    </div>
  );
}

export function BudgetComparisonChart({ progressItems }) {
  const currency = useCurrency();

  if (!progressItems.length) return null;

  const data = progressItems.map((b) => ({
    category: b.category.length > 11 ? b.category.slice(0, 10) + '…' : b.category,
    fullCategory: b.category,
    pct: Math.min(100, b.percentageUsed),
    spent: b.currentSpending,
    budget: b.amount,
    status: b.status
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 40)}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 0, right: 12, left: 0, bottom: 0 }}
        barCategoryGap="28%"
      >
        <XAxis
          type="number"
          domain={[0, 100]}
          hide
        />
        <YAxis
          type="category"
          dataKey="category"
          width={72}
          tick={{
            fontSize: 11,
            fill: '#64748b',
            fontFamily: '"Plus Jakarta Sans Variable", sans-serif',
            fontWeight: 600
          }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<BudgetTooltip currency={currency} />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
        <Bar dataKey="pct" radius={[0, 6, 6, 0]} background={{ fill: '#f1f5f9', radius: [0, 6, 6, 0] }}>
          {data.map((entry, i) => (
            <Cell key={i} fill={STATUS_COLORS[entry.status] ?? STATUS_COLORS.healthy} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
