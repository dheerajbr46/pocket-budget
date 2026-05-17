import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';

const MINT = '#14b8a6';
const CORAL = '#fb7185';

function TrendTooltip({ active, currency, label, payload }) {
  if (!active || !payload?.length) return null;
  const income = payload.find((p) => p.dataKey === 'income')?.value ?? 0;
  const expenses = payload.find((p) => p.dataKey === 'expenses')?.value ?? 0;
  if (income === 0 && expenses === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-card-md">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
      {income > 0 && (
        <p className="text-sm font-bold text-mint">+{formatCurrency(income, currency)}</p>
      )}
      {expenses > 0 && (
        <p className="text-sm font-bold text-coral">−{formatCurrency(expenses, currency)}</p>
      )}
    </div>
  );
}

export function SpendingTrendChart({ data }) {
  const currency = useCurrency();
  const hasData = data.some((d) => d.income > 0 || d.expenses > 0);
  const tickInterval = Math.max(1, Math.floor(data.length / 5));

  if (!hasData) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl bg-slate-50">
        <p className="text-sm font-semibold text-slate-400">No transactions yet — add some to see the trend</p>
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 5, left: -22, bottom: 0 }}>
          <defs>
            <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={MINT} stopOpacity={0.22} />
              <stop offset="100%" stopColor={MINT} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CORAL} stopOpacity={0.22} />
              <stop offset="100%" stopColor={CORAL} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{
              fontSize: 11,
              fill: '#94a3b8',
              fontFamily: '"Plus Jakarta Sans Variable", sans-serif',
              fontWeight: 600
            }}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
          />
          <Tooltip content={<TrendTooltip currency={currency} />} />
          <Area
            type="monotone"
            dataKey="income"
            stroke={MINT}
            strokeWidth={2}
            fill="url(#gradIncome)"
            dot={false}
            activeDot={{ r: 4, fill: MINT, stroke: 'white', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke={CORAL}
            strokeWidth={2}
            fill="url(#gradExpenses)"
            dot={false}
            activeDot={{ r: 4, fill: CORAL, stroke: 'white', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-3 flex justify-center gap-5">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: MINT }} />
          Income
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: CORAL }} />
          Expenses
        </span>
      </div>
    </div>
  );
}
