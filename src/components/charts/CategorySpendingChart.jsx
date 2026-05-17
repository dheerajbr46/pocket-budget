import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';

const INDIGO = '#4f46e5';
const INDIGO_DIM = '#c7d2fe';

function SpendingTooltip({ active, currency, label, payload }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  if (val === 0) return null;

  return (
    <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-card-md dark:border-slate-700 dark:bg-slate-800">
      <p className="text-[11px] font-bold text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-indigo">{formatCurrency(val, currency)}</p>
    </div>
  );
}

export function CategorySpendingChart({ data }) {
  const currency = useCurrency();
  const hasData = data.some((d) => d.expenses > 0);
  const maxVal = Math.max(...data.map((d) => d.expenses), 1);
  const tickInterval = Math.max(1, Math.floor(data.length / 5));

  if (!hasData) {
    return (
      <div className="flex h-24 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
        <p className="text-sm font-semibold text-slate-400">No spending in this period</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} barCategoryGap="28%" margin={{ top: 4, right: 5, left: -20, bottom: 0 }}>
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: '"Plus Jakarta Sans Variable", sans-serif', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
          interval={tickInterval}
        />
        <Tooltip content={<SpendingTooltip currency={currency} />} cursor={false} />
        <Bar dataKey="expenses" radius={[4, 4, 0, 0]} maxBarSize={24}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.expenses === maxVal && maxVal > 0 ? INDIGO : INDIGO_DIM} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
