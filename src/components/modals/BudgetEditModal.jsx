import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { expenseCategories } from '../../constants/categories.js';
import { pressableStyles } from '../../constants/motion.js';
import { Button } from '../ui/Button.jsx';
import { Modal } from '../ui/Modal.jsx';
import { SelectSheet } from '../ui/SelectSheet.jsx';

export function BudgetEditModal({ budget, existingCategories = [], isOpen, onClose, onSave }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(expenseCategories[0]);
  const [error, setError] = useState('');
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const categoryOptions = expenseCategories.map((categoryName) => ({
    disabled: !budget && existingCategories.includes(categoryName),
    label: categoryName,
    meta: !budget && existingCategories.includes(categoryName) ? 'Budget already exists' : '',
    value: categoryName
  }));

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setAmount(budget ? String(budget.amount) : '');
    setCategory(budget?.category ?? getFirstAvailableCategory(existingCategories));
    setError('');
  }, [budget, existingCategories, isOpen]);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!category) {
      setError('Choose a category.');
      return;
    }

    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter a budget greater than 0.');
      return;
    }

    onSave({
      ...budget,
      amount: numericAmount,
      category
    });
  }

  return (
    <Modal title={budget ? 'Edit budget' : 'New budget'} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Category</span>
          <button
            type="button"
            onClick={() => setIsCategorySheetOpen(true)}
            className={`mt-2 flex h-10 w-full items-center justify-between bg-transparent text-left font-bold outline-none focus-visible:ring-2 focus-visible:ring-mint/40 ${pressableStyles}`}
          >
            <span>{category || 'Select category'}</span>
            <ChevronDown size={18} className="text-slate-400" />
          </button>
          <SelectSheet
            isOpen={isCategorySheetOpen}
            onClose={() => setIsCategorySheetOpen(false)}
            onSelect={setCategory}
            options={categoryOptions}
            title="Choose budget category"
            value={category}
          />
        </div>

        <label className="block rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Monthly budget</span>
          <input
            className="mt-2 w-full bg-transparent text-2xl font-bold outline-none placeholder:text-slate-300"
            inputMode="decimal"
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            value={amount}
          />
        </label>

        {error ? <p className="text-sm font-semibold text-coral">{error}</p> : null}

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={onClose} className="h-12 rounded-2xl bg-slate-100 font-bold text-slate-600">
            Cancel
          </Button>
          <button type="submit" className="h-12 rounded-2xl bg-ink font-bold text-white">
            Save
          </button>
        </div>
      </form>

      {/* Future extension: shared group budgets can add household/member scopes here. */}
    </Modal>
  );
}

function getFirstAvailableCategory(existingCategories) {
  return expenseCategories.find((category) => !existingCategories.includes(category)) ?? expenseCategories[0];
}
