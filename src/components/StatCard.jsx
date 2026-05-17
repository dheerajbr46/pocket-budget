import { formatCurrency } from '../utils/formatters.js';
import { useCurrency } from '../context/CurrencyContext.jsx';

export function StatCard({ label, tone = 'slate', value }) {
  const currency = useCurrency();
  const toneClasses = {
    coral: 'bg-rose-50 text-coral',
    mint: 'bg-teal-50 text-mint',
    slate: 'bg-slate-100 text-ink'
  };

  return (
    <div className={`rounded-3xl p-4 ${toneClasses[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-2 text-xl font-bold">{formatCurrency(value, currency)}</p>
    </div>
  );
}
