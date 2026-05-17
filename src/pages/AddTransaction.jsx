import { useMemo, useState } from 'react';
import { CalendarDays, DollarSign, FileText, Tag } from 'lucide-react';
import { Card } from '../components/Card.jsx';
import { expenseCategories, incomeCategories } from '../data/categories.js';

const initialType = 'expense';

function getTodayInputValue() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function AddTransaction({ onSave }) {
  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(expenseCategories[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getTodayInputValue);
  const [errors, setErrors] = useState({});

  const categories = useMemo(
    () => (type === 'expense' ? expenseCategories : incomeCategories),
    [type]
  );

  function handleTypeChange(nextType) {
    setType(nextType);
    setCategory(nextType === 'expense' ? expenseCategories[0] : incomeCategories[0]);
    setErrors((currentErrors) => ({ ...currentErrors, category: undefined }));
  }

  function validate() {
    const nextErrors = {};
    const numericAmount = Number(amount);

    if (!amount.trim()) {
      nextErrors.amount = 'Amount is required.';
    } else if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      nextErrors.amount = 'Amount must be greater than 0.';
    }

    if (!category) {
      nextErrors.category = 'Choose a category.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSave({
      id: `txn_${crypto.randomUUID()}`,
      type,
      amount: Number(amount),
      category,
      note: note.trim(),
      date,
      createdAt: new Date().toISOString()
    });
  }

  return (
    <div className="space-y-5">
      <Card>
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

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Field error={errors.amount} icon={DollarSign} label="Amount">
            <input
              className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-slate-300"
              inputMode="decimal"
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              type="text"
              value={amount}
            />
          </Field>

          <Field error={errors.category} icon={Tag} label="Category">
            <select
              className="w-full bg-transparent font-semibold outline-none"
              onChange={(event) => setCategory(event.target.value)}
              value={category}
            >
              {categories.map((categoryName) => (
                <option key={categoryName}>{categoryName}</option>
              ))}
            </select>
          </Field>

          <Field icon={FileText} label="Note">
            <input
              className="w-full bg-transparent font-semibold outline-none"
              onChange={(event) => setNote(event.target.value)}
              placeholder="What was this for?"
              value={note}
            />
          </Field>

          <Field icon={CalendarDays} label="Date">
            <input
              className="w-full bg-transparent font-semibold outline-none"
              onChange={(event) => setDate(event.target.value)}
              type="date"
              value={date}
            />
          </Field>

          <button
            type="submit"
            className="h-14 w-full rounded-2xl bg-ink text-base font-bold text-white shadow-lg shadow-slate-300"
          >
            Save Transaction
          </button>
        </form>
      </Card>

      <Card className="bg-teal-50">
        <p className="text-sm font-semibold text-teal-900">Saved on this device</p>
        <p className="mt-2 text-sm leading-6 text-teal-800">
          Transactions stay in this browser using LocalStorage. No account, backend, or external service is involved.
        </p>
      </Card>

      {/* Future feature: add edit/delete flows that update the same LocalStorage-backed state. */}
    </div>
  );
}

function Field({ children, error, icon: Icon, label }) {
  return (
    <div>
      <label className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
        error ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-slate-50'
      }`}>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-500 shadow-sm">
          <Icon size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
          <span className="mt-1 block">{children}</span>
        </span>
      </label>
      {error ? <p className="mt-2 px-2 text-sm font-semibold text-coral">{error}</p> : null}
    </div>
  );
}
