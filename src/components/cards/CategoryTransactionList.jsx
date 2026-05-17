import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { formatShortDate } from '../../utils/formatting/index.js';
import { EmptyState } from '../ui/EmptyState.jsx';

export function CategoryTransactionList({ period, transactions }) {
  const currency = useCurrency();

  if (transactions.length === 0) {
    return (
      <EmptyState
        title={period === 'all' ? 'No transactions yet' : 'No data for this period'}
        description={
          period === 'all'
            ? 'This category does not have any saved transactions.'
            : 'Try another period or add a transaction in this category.'
        }
      />
    );
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-lg font-bold">Transaction history</h2>
        <p className="text-sm font-semibold text-slate-400">{transactions.length} item{transactions.length === 1 ? '' : 's'}</p>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="rounded-3xl bg-white p-4 shadow-sm transition duration-200 ease-out active:scale-[0.99]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold">{transaction.note || transaction.category}</p>
                <time className="mt-1 block text-sm font-semibold text-slate-400" dateTime={transaction.date}>
                  {formatShortDate(transaction.date)}
                </time>
              </div>
              <p className="shrink-0 font-bold text-ink">-{formatCurrency(transaction.amount, currency)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Future extension: shared expense category splits can show who paid each item. */}
    </section>
  );
}
