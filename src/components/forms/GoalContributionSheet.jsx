import { useEffect, useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext.jsx';
import { formatCurrency } from '../../utils/currency/index.js';
import { BottomSheet } from '../ui/BottomSheet.jsx';
import { Button } from '../ui/Button.jsx';

export function GoalContributionSheet({ goal, isOpen, mode = 'add', onClose, onSave }) {
  const currency = useCurrency();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const isSubtracting = mode === 'subtract';
  const remainingAmount = Math.max(0, goal?.targetAmount - goal?.currentAmount);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError('');
    }
  }, [isOpen]);

  if (!goal) {
    return null;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const numericAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter an amount greater than 0.');
      return;
    }

    if (!isSubtracting && numericAmount > remainingAmount) {
      setError(`This goal only needs ${formatCurrency(remainingAmount, currency)} more.`);
      return;
    }

    onSave(goal.id, numericAmount);
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={isSubtracting ? 'Subtract from goal' : 'Add contribution'}>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-ink">{goal.name}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Current saved: {formatCurrency(goal.currentAmount, currency)}
          </p>
          {!isSubtracting ? (
            <p className="mt-1 text-xs font-bold text-mint">
              Remaining: {formatCurrency(remainingAmount, currency)}
            </p>
          ) : null}
        </div>

        <label className="block rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {isSubtracting ? 'Amount to subtract' : 'Contribution amount'}
          </span>
          <input
            autoFocus
            className="mt-2 w-full bg-transparent text-2xl font-bold text-ink outline-none placeholder:text-slate-300"
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
          <button
            type="submit"
            className={`h-12 rounded-2xl font-bold text-white ${isSubtracting ? 'bg-ink' : 'bg-mint'}`}
          >
            {isSubtracting ? 'Subtract' : 'Add'}
          </button>
        </div>
      </form>

      {/* TODO: Auto-contribute from positive monthly savings after users opt in. */}
    </BottomSheet>
  );
}
