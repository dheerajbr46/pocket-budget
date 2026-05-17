import { useCurrency } from '../../context/CurrencyContext.jsx';
import { toneClasses } from '../../constants/colors.js';
import { formatCurrency } from '../../utils/currency/index.js';

export function StatCard({ label, tone = 'slate', value }) {
  const currency = useCurrency();

  return (
    <div className={`rounded-3xl p-4 ${toneClasses[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] opacity-70">{label}</p>
      <p className="mt-2 text-xl font-bold">{formatCurrency(value, currency)}</p>
    </div>
  );
}
