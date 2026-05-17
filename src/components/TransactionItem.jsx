import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export function TransactionItem({ transaction }) {
  const currency = useCurrency();
  const isIncome = transaction.type === 'income';
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className="flex items-center gap-3 rounded-3xl bg-white p-3 shadow-sm">
      <div className={`grid h-12 w-12 place-items-center rounded-2xl ${isIncome ? 'bg-teal-50 text-mint' : 'bg-rose-50 text-coral'}`}>
        <Icon size={21} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate font-semibold text-ink">{transaction.category}</p>
          <p className={`font-bold ${isIncome ? 'text-mint' : 'text-ink'}`}>
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount, currency)}
          </p>
        </div>
        <div className="mt-1 flex items-center justify-between gap-3 text-sm text-slate-500">
          <p className="truncate">{transaction.note}</p>
          <time dateTime={transaction.date}>{formatDate(transaction.date)}</time>
        </div>
      </div>
    </div>
  );
}
