import { useMemo } from 'react';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';

const palette = ['#14b8a6', '#fb7185', '#f59e0b', '#64748b', '#14213d', '#cbd5e1'];

export function SpendingDonutChart({ onCategorySelect, segments = [], total = 0 }) {
  const currency = useCurrency();
  const gradient = useMemo(() => {
    if (!segments.length || total <= 0) {
      return '#e2e8f0';
    }

    let offset = 0;
    const parts = segments.map((segment, index) => {
      const color = palette[index % palette.length];
      const start = offset;
      const size = (segment.amount / total) * 100;
      offset += size;
      return `${color} ${start}% ${offset}%`;
    });

    return `conic-gradient(${parts.join(', ')})`;
  }, [segments, total]);

  return (
    <div className="grid gap-4 sm:grid-cols-[150px_1fr] sm:items-center">
      <div className="mx-auto grid h-36 w-36 place-items-center rounded-full p-4 animate-soft-slide-in motion-reduce:animate-none" style={{ background: gradient }} aria-label={`Spending breakdown total ${formatCurrency(total, currency)}`}>
        <div className="grid h-full w-full place-items-center rounded-full bg-white text-center shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Spent</p>
            <p className="mt-1 text-sm font-bold text-ink">{formatCurrency(total, currency)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {segments.length > 0 ? (
          segments.map((segment, index) => (
            <button
              key={segment.category}
              type="button"
              onClick={() => segment.category !== 'Other' && onCategorySelect?.(segment.category)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-left transition duration-200 ease-out hover:bg-white hover:shadow-sm active:scale-[0.99] motion-reduce:transition-none"
              aria-label={`${segment.category}, ${segment.percentage}% of spending`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                <span className="truncate text-sm font-bold text-ink">{segment.category}</span>
              </span>
              <span className="shrink-0 text-xs font-bold text-slate-400">{segment.percentage}%</span>
            </button>
          ))
        ) : (
          <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-500">
            No spending breakdown yet.
          </p>
        )}
      </div>

      {/* TODO: Add advanced trends and recurring spend analysis overlays without making reports feel dense. */}
    </div>
  );
}
