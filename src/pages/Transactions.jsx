import { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Pencil, Search, Trash2, X } from 'lucide-react';
import { Card } from '../components/Card.jsx';
import { useCurrency } from '../context/CurrencyContext.jsx';
import { expenseCategories, incomeCategories } from '../data/categories.js';
import { formatCurrency } from '../utils/formatters.js';

const filters = [
  { id: 'all', label: 'All' },
  { id: 'income', label: 'Income' },
  { id: 'expense', label: 'Expense' }
];

function formatGroupDate(dateValue) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date(`${dateValue}T00:00:00`));
}

function getSortedTransactions(transactions) {
  return [...transactions].sort((firstTransaction, secondTransaction) => {
    const firstDate = new Date(`${firstTransaction.date}T00:00:00`).getTime();
    const secondDate = new Date(`${secondTransaction.date}T00:00:00`).getTime();

    if (firstDate !== secondDate) {
      return secondDate - firstDate;
    }

    const firstTime = new Date(firstTransaction.createdAt || firstTransaction.date).getTime();
    const secondTime = new Date(secondTransaction.createdAt || secondTransaction.date).getTime();

    return secondTime - firstTime;
  });
}

function groupTransactionsByDate(transactions) {
  return transactions.reduce((groups, transaction) => {
    const existingGroup = groups.find((group) => group.date === transaction.date);

    if (existingGroup) {
      existingGroup.transactions.push(transaction);
    } else {
      groups.push({ date: transaction.date, transactions: [transaction] });
    }

    return groups;
  }, []);
}

export function Transactions({ onDeleteTransaction, onUpdateTransaction, transactions }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return getSortedTransactions(transactions).filter((transaction) => {
      const matchesType = activeFilter === 'all' || transaction.type === activeFilter;
      const matchesSearch =
        !normalizedSearch ||
        transaction.note.toLowerCase().includes(normalizedSearch) ||
        transaction.category.toLowerCase().includes(normalizedSearch);

      return matchesType && matchesSearch;
    });
  }, [activeFilter, searchTerm, transactions]);

  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions]
  );

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Activity</p>
            <p className="mt-1 text-xl font-bold">{transactions.length} transactions</p>
          </div>
          <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-600">
            {filteredTransactions.length} shown
          </div>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <Search size={18} className="shrink-0 text-slate-400" />
          <input
            className="w-full bg-transparent font-semibold outline-none placeholder:text-slate-400"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search note or category"
            type="search"
            value={searchTerm}
          />
        </label>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-xl px-3 py-3 text-sm font-bold transition ${
                  isActive ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </Card>

      {groupedTransactions.length > 0 ? (
        <div className="space-y-5">
          {groupedTransactions.map((group) => (
            <section key={group.date} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
                  {formatGroupDate(group.date)}
                </h2>
                <p className="text-sm font-semibold text-slate-400">
                  {group.transactions.length} item{group.transactions.length === 1 ? '' : 's'}
                </p>
              </div>

              <div className="space-y-3">
                {group.transactions.map((transaction) => (
                  <div key={transaction.id} className="space-y-3">
                    <TransactionRow
                      isEditing={editingTransaction?.id === transaction.id}
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
        <EmptyState hasTransactions={transactions.length > 0} />
      )}
    </div>
  );
}

function TransactionRow({ isEditing, onDelete, onEdit, transaction }) {
  const currency = useCurrency();
  const isIncome = transaction.type === 'income';
  const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className={`rounded-3xl bg-white p-3 shadow-sm ${
      isEditing ? 'ring-2 ring-mint/40' : ''
    }`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
          isIncome ? 'bg-teal-50 text-mint' : 'bg-rose-50 text-coral'
        }`}>
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
          <p className="mt-1 truncate text-sm text-slate-500">{transaction.note || 'No note'}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onEdit}
          className={`flex h-10 items-center justify-center gap-2 rounded-2xl text-sm font-bold ${
            isEditing ? 'bg-teal-50 text-mint' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Pencil size={16} />
          {isEditing ? 'Editing' : 'Edit'}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex h-10 items-center justify-center gap-2 rounded-2xl bg-rose-50 text-sm font-bold text-coral"
        >
          <Trash2 size={16} />
          Delete
        </button>
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
  const categories = type === 'income' ? incomeCategories : expenseCategories;

  function handleTypeChange(nextType) {
    setType(nextType);
    setCategory(nextType === 'income' ? incomeCategories[0] : expenseCategories[0]);
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
        <button
          type="button"
          onClick={onCancel}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500"
          aria-label="Cancel editing"
        >
          <X size={18} />
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
              type === 'expense' ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
              type === 'income' ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
            }`}
          >
            Income
          </button>
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
          <button
            type="button"
            onClick={onCancel}
            className="h-14 rounded-2xl bg-slate-100 font-bold text-slate-600"
          >
            Cancel
          </button>
          <button type="submit" className="h-14 rounded-2xl bg-ink font-bold text-white">
            Save
          </button>
        </div>
      </form>
    </Card>
  );
}

function EmptyState({ hasTransactions }) {
  return (
    <Card className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-slate-100 text-slate-400">
        <Search size={22} />
      </div>
      <h2 className="mt-4 text-lg font-bold">
        {hasTransactions ? 'No matching transactions' : 'No transactions yet'}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {hasTransactions
          ? 'Try a different filter or search term.'
          : 'Add your first income or expense to start building your budget history.'}
      </p>
    </Card>
  );
}
