import { useEffect, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Pencil, Repeat2, Search, Trash2, X } from 'lucide-react';
import { pressableStyles, transitionPresets } from '../../constants/motion.js';
import { Button } from '../../components/ui/Button.jsx';
import { Card } from '../../components/ui/Card.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { expenseCategories, getCategoriesForType, incomeCategories } from '../../constants/categories.js';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import {
  calculateFilteredTransactionSummary,
  filterTransactions,
  formatRelativeTransactionDate,
  getCategoryChipStyle,
  getTransactionAccentStyle,
  getTransactionGroupNetAmount,
  groupTransactionsByFriendlyDate,
  isRecurringRelated
} from '../../utils/transactions/index.js';
import { formatCurrency } from '../../utils/currency/index.js';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'income', label: 'Income' },
  { id: 'expense', label: 'Expense' }
];

const dateFilters = [
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'all', label: 'All Time' }
];

const categoryOptions = ['all', ...new Set([...expenseCategories, ...incomeCategories])];

export function Activity({
  onDeleteTransaction,
  onEditHandled,
  onTransactionSelect,
  onUpdateTransaction,
  pendingEditTransactionId,
  transactions
}) {
  const currency = useCurrency();
  const [activeFilter, setActiveFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filteredTransactions = useMemo(
    () =>
      filterTransactions(transactions, {
        category: categoryFilter,
        dateRange,
        searchTerm,
        type: activeFilter
      }),
    [activeFilter, categoryFilter, dateRange, searchTerm, transactions]
  );

  const filteredSummary = useMemo(
    () => calculateFilteredTransactionSummary(filteredTransactions),
    [filteredTransactions]
  );

  const groupedTransactions = useMemo(
    () => groupTransactionsByFriendlyDate(filteredTransactions),
    [filteredTransactions]
  );

  const hasActiveFilters = activeFilter !== 'all' || categoryFilter !== 'all' || dateRange !== 'all' || searchTerm.trim();
  const periodOnlyEmpty =
    transactions.length > 0 &&
    dateRange !== 'all' &&
    activeFilter === 'all' &&
    categoryFilter === 'all' &&
    filteredTransactions.length === 0 &&
    !searchTerm.trim();

  useEffect(() => {
    if (!pendingEditTransactionId) {
      return;
    }

    const transactionToEdit = transactions.find((transaction) => transaction.id === pendingEditTransactionId);

    if (transactionToEdit) {
      setEditingTransaction(transactionToEdit);
      setActiveFilter('all');
      setCategoryFilter('all');
      setDateRange('all');
      setSearchTerm('');
    }

    onEditHandled?.();
  }, [onEditHandled, pendingEditTransactionId, transactions]);

  return (
    <div className="space-y-5">
      <div className="px-1">
        <p className="text-sm font-semibold text-slate-500">Manage and explore your activity.</p>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Transaction Center</p>
            <p className="mt-1 text-xl font-bold">{filteredSummary.count} transactions</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
            Net {formatCurrency(filteredSummary.net, currency)}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <SummaryMetric label="Income" tone="mint" value={filteredSummary.income} />
          <SummaryMetric label="Expenses" tone="coral" value={filteredSummary.expenses} />
          <SummaryMetric label="Net" tone="slate" value={filteredSummary.net} />
        </div>
      </Card>

      <Card>
        <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            className="w-full bg-transparent font-semibold outline-none placeholder:text-slate-400"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search note, category, or amount"
            type="search"
            value={searchTerm}
          />
        </label>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                  isActive ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
                }`}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
          {dateFilters.map((filter) => {
            const isActive = dateRange === filter.id;

            return (
              <Button
                key={filter.id}
                onClick={() => setDateRange(filter.id)}
                className={`rounded-xl px-2 py-3 text-xs font-bold transition ${
                  isActive ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
                }`}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>

        <label className="mt-4 block">
          <span className="mb-2 block px-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Category
          </span>
          <select
            className="h-14 w-full rounded-2xl bg-slate-50 px-4 py-3 font-semibold text-ink outline-none"
            onChange={(event) => setCategoryFilter(event.target.value)}
            value={categoryFilter}
          >
            {categoryOptions.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName === 'all' ? 'All categories' : categoryName}
              </option>
            ))}
          </select>
        </label>
      </Card>

      {groupedTransactions.length > 0 ? (
        <div className="space-y-5">
          {groupedTransactions.map((group) => (
            <section key={group.id} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
                  {group.label}
                </h2>
                <p className="text-sm font-semibold text-slate-400">
                  {group.transactions.length} item{group.transactions.length === 1 ? '' : 's'} •{' '}
                  {formatCurrency(getTransactionGroupNetAmount(group.transactions), currency)}
                </p>
              </div>

              <div className="space-y-3">
                {group.transactions.map((transaction) => (
                  <div key={transaction.id} className="space-y-3">
                    <TransactionRow
                      isEditing={editingTransaction?.id === transaction.id}
                      onSelect={onTransactionSelect}
                      transaction={transaction}
                      onDelete={() => {
                        if (editingTransaction?.id === transaction.id) {
                          setEditingTransaction(null);
                        }

                        onDeleteTransaction(transaction.id);
                      }}
                      onEdit={() => setEditingTransaction(transaction)}
                    />

                    {editingTransaction?.id === transaction.id ? (
                      <EditTransactionPanel
                        key={transaction.id}
                        transaction={editingTransaction}
                        onCancel={() => setEditingTransaction(null)}
                        onSave={(updatedTransaction) => {
                          onUpdateTransaction(updatedTransaction);
                          setEditingTransaction(null);
                          setActiveFilter('all');
                          setCategoryFilter('all');
                          setDateRange('all');
                          setSearchTerm('');
                        }}
                      />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            transactions.length === 0
              ? 'No transactions yet'
              : periodOnlyEmpty
                ? 'No transactions in this period'
                : 'No matching transactions'
          }
          description={
            transactions.length === 0
              ? 'Add your first income or expense to start building your budget history.'
              : hasActiveFilters
                ? 'Try a different search, category, type, or date range.'
                : 'Your transaction center will fill in as you add activity.'
          }
        />
      )}

      {/* Future extension: shared expenses can add split metadata to each transaction row. */}
      {/* TODO: Add swipe-to-delete and swipe-to-edit gesture handlers for mobile use. */}
      {/* TODO: Trigger haptic feedback when gesture actions commit. */}
      {/* TODO: Add duplicate transaction, recurring transaction conversion, merchant auto-categorization, emoji category icons, and advanced CSV export. */}
      {/* TODO: Add Splitwise support and split expense flows for shared household spending. */}
    </div>
  );
}

function SummaryMetric({ label, tone, value }) {
  const currency = useCurrency();
  const toneClass =
    tone === 'mint'
      ? 'bg-teal-50 text-teal-700'
      : tone === 'coral'
        ? 'bg-rose-50 text-rose-700'
        : 'bg-slate-50 text-slate-700';

  return (
    <div className={`rounded-2xl p-3 ${toneClass}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-70">{label}</p>
      <p className="mt-2 truncate text-sm font-bold">{formatCurrency(value, currency)}</p>
    </div>
  );
}

function TransactionRow({ isEditing, onDelete, onEdit, onSelect, transaction }) {
  const currency = useCurrency();
  const isIncome = transaction.type === 'income';
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
  const accentClass = getTransactionAccentStyle(transaction.type);
  const chipClass = getCategoryChipStyle(transaction.type);

  return (
    <div className={`rounded-3xl border-l-4 ${accentClass} bg-white p-3 shadow-sm ${pressableStyles} ${
      isEditing ? 'ring-2 ring-mint/40' : ''
    }`}>
      <button type="button" onClick={() => onSelect?.(transaction)} className="flex w-full items-center gap-3 text-left">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
          isIncome ? 'bg-teal-50 text-mint' : 'bg-rose-50 text-coral'
        }`}>
          <Icon size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate font-semibold text-ink">{transaction.note || transaction.category}</p>
            <p className={`shrink-0 font-bold ${isIncome ? 'text-mint' : 'text-ink'}`}>
              {isIncome ? '+' : '-'}
              {formatCurrency(transaction.amount, currency)}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
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
      </button>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button
          onClick={onEdit}
          className={`flex h-10 items-center justify-center gap-2 rounded-2xl text-sm font-bold ${
            isEditing ? 'bg-teal-50 text-mint' : 'bg-slate-50 text-slate-500'
          }`}
        >
          <Pencil size={16} />
          {isEditing ? 'Editing' : 'Edit'}
        </Button>
        <Button
          onClick={onDelete}
          className="flex h-10 items-center justify-center gap-2 rounded-2xl bg-rose-50/80 text-sm font-bold text-coral"
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>
    </div>
  );
}

function EditTransactionPanel({ onCancel, onSave, transaction }) {
  const [type, setType] = useState(transaction.type);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [category, setCategory] = useState(transaction.category);
  const [note, setNote] = useState(transaction.note);
  const [date, setDate] = useState(transaction.date);
  const [error, setError] = useState('');
  const categories = getCategoriesForType(type);

  function handleTypeChange(nextType) {
    setType(nextType);
    setCategory(getCategoriesForType(nextType)[0]);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter an amount greater than 0.');
      return;
    }

    if (!category) {
      setError('Choose a category.');
      return;
    }

    onSave({
      ...transaction,
      type,
      amount: numericAmount,
      category,
      note: note.trim(),
      date
    });
  }

  return (
    <Card className="border-teal-100 bg-white">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Editing</p>
          <h2 className="mt-1 text-lg font-bold">Update transaction</h2>
        </div>
        <Button
          onClick={onCancel}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500"
          aria-label="Cancel editing"
        >
          <X size={18} />
        </Button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          {['expense', 'income'].map((option) => (
            <Button
              key={option}
              onClick={() => handleTypeChange(option)}
              className={`rounded-xl px-4 py-3 text-sm font-bold capitalize transition ${
                type === option ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
              }`}
            >
              {option}
            </Button>
          ))}
        </div>

        <input
          className="h-14 w-full rounded-2xl bg-slate-50 px-4 text-lg font-bold outline-none placeholder:text-slate-300"
          inputMode="decimal"
          onChange={(event) => setAmount(event.target.value)}
          placeholder="0.00"
          value={amount}
        />

        <select
          className="h-14 w-full rounded-2xl bg-slate-50 px-4 font-semibold outline-none"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          {categories.map((categoryName) => (
            <option key={categoryName}>{categoryName}</option>
          ))}
        </select>

        <input
          className="h-14 w-full rounded-2xl bg-slate-50 px-4 font-semibold outline-none placeholder:text-slate-400"
          onChange={(event) => setNote(event.target.value)}
          placeholder="Note"
          value={note}
        />

        <input
          className="h-14 w-full rounded-2xl bg-slate-50 px-4 font-semibold outline-none"
          onChange={(event) => setDate(event.target.value)}
          type="date"
          value={date}
        />

        {error ? <p className="text-sm font-semibold text-coral">{error}</p> : null}

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onCancel} className="h-14 rounded-2xl bg-slate-100 font-bold text-slate-600">
            Cancel
          </Button>
          <button type="submit" className="h-14 rounded-2xl bg-ink font-bold text-white">
            Save
          </button>
        </div>
      </form>
    </Card>
  );
}
