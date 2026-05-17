import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';

const COLORS = [
  '#4f46e5',
  '#14b8a6',
  '#fb7185',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#84cc16',
  '#f97316'
];

function DonutTooltip({ active, currency, payload }) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-card-md">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{entry.name}</p>
      <p className="mt-1 text-sm font-bold text-ink">{formatCurrency(entry.value, currency)}</p>
      <p className="text-[11px] font-semibold text-slate-400">{entry.payload.percentage}%</p>
    </div>
  );
}

export function CategoryDonutChart({ data }) {
  const currency = useCurrency();
  const total = data.reduce((s, d) => s + d.amount, 0);
  const pieData = data.map((d) => ({ name: d.category, value: d.amount, percentage: d.percentage }));

  if (!data.length) return null;

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius="52%"
              outerRadius="76%"
              dataKey="value"
              stroke="white"
              strokeWidth={2}
              paddingAngle={2}
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip currency={currency} />} />
          </PieChart>
        </ResponsiveContainer>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Total</p>
          <p className="mt-0.5 text-base font-bold text-ink">{formatCurrency(total, currency)}</p>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 px-2">
        {data.slice(0, 8).map((item, i) => (
          <div key={item.category} className="flex items-center gap-2 overflow-hidden">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="truncate text-xs font-semibold text-slate-500">{item.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
