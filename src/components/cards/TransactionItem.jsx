import { ArrowDownLeft, ArrowUpRight, Repeat2 } from 'lucide-react';
import { pressableStyles, transitionPresets } from '../../constants/motion.js';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import {
  formatRelativeTransactionDate,
  getCategoryChipStyle,
  getTransactionAccentStyle,
  isRecurringRelated
} from '../../utils/transactions/index.js';

export function TransactionItem({ onSelect, transaction }) {
  const currency = useCurrency();
  const isIncome = transaction.type === 'income';
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
  const accentClass = getTransactionAccentStyle(transaction.type);
  const chipClass = getCategoryChipStyle(transaction.type);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(transaction)}
      className={`flex w-full items-center gap-3 rounded-3xl border-l-4 ${accentClass} bg-white p-3 text-left shadow-sm ${pressableStyles}`}
    >
      <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${isIncome ? 'bg-teal-50 text-mint' : 'bg-rose-50 text-coral'}`}>
        <Icon size={21} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {transaction.note || transaction.category}
            </p>
          </div>
          <p className={`shrink-0 font-bold ${isIncome ? 'text-mint' : 'text-ink'}`}>
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount, currency)}
          </p>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-sm text-slate-500">
          <span className={`max-w-[58%] truncate rounded-full px-2.5 py-1 text-xs font-bold ${chipClass}`}>
            {transaction.category}
          </span>
          {isRecurringRelated(transaction) ? (
            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500 ${transitionPresets.base}`}>
              <Repeat2 size={12} />
              Recurring
            </span>
          ) : null}
          <time className="shrink-0 text-xs font-semibold text-slate-400" dateTime={transaction.date}>
            {formatRelativeTransactionDate(transaction.date)}
          </time>
        </div>
      </div>

      {/* TODO: Add transaction swipe actions and merchant-style transaction names. */}
    </button>
  );
}
