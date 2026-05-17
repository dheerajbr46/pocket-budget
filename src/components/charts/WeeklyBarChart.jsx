import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';

const CORAL = '#fb7185';
const CORAL_DIM = '#fecdd3';

function BarTooltip({ active, currency, label, payload }) {
  if (!active || !payload?.length) return null;
  const expenses = payload[0]?.value ?? 0;
  if (expenses === 0) return null;

  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-card-md dark:border-slate-700 dark:bg-slate-800">
      <p className="text-[11px] font-bold text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-coral">
        {formatCurrency(expenses, currency)}
      </p>
    </div>
  );
}

export function WeeklyBarChart({ data }) {
  const currency = useCurrency();
  const maxVal = Math.max(...data.map((d) => d.expenses), 1);

  return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: '"Plus Jakarta Sans Variable", sans-serif', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<BarTooltip currency={currency} />} cursor={false} />
        <Bar dataKey="expenses" radius={[4, 4, 0, 0]} maxBarSize={28}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.expenses === maxVal && maxVal > 0 ? CORAL : CORAL_DIM} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
