import { useEffect, useRef, useState } from 'react';
import { getCategoriesForType } from '../../constants/categories.js';
import { RECURRENCE_TYPES } from '../../constants/recurrenceTypes.js';
import { TRANSACTION_TYPES } from '../../constants/transactionTypes.js';
import { toDateInputValue } from '../../utils/dates/index.js';
import { AnimatedButton } from '../ui/AnimatedButton.jsx';
import { BottomSheet } from '../ui/BottomSheet.jsx';
import { CategorySelect } from './CategorySelect.jsx';
import { NoteInput } from './NoteInput.jsx';
import { RecurringOptions } from './RecurringOptions.jsx';
import { TransactionTypeToggle } from './TransactionTypeToggle.jsx';

export function QuickAddTransactionSheet({ isOpen, onClose, onSave }) {
  const [type, setType] = useState(TRANSACTION_TYPES.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(getCategoriesForType(TRANSACTION_TYPES.EXPENSE)[0]);
  const [note, setNote] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(RECURRENCE_TYPES.MONTHLY);
  const [recurrenceStartDate, setRecurrenceStartDate] = useState(toDateInputValue());
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [neverEnds, setNeverEnds] = useState(true);
  const [error, setError] = useState('');
  const amountFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setError('');
    setRecurrenceStartDate(toDateInputValue());
    const timeoutId = window.setTimeout(() => amountFocusRef.current?.focus(), 260);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

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

    const todayValue = toDateInputValue();
    const transactionDate = isRecurring ? recurrenceStartDate : todayValue;

    onSave({
      type,
      amount,
      category,
      note,
      date: transactionDate,
      isRecurring,
      recurrenceEndDate: isRecurring && !neverEnds ? recurrenceEndDate : undefined,
      recurrenceFrequency: isRecurring ? recurrenceFrequency : undefined,
      recurrenceStartDate: isRecurring ? recurrenceStartDate : undefined
    });

    setAmount('');
    setNote('');
    setIsRecurring(false);
    setRecurrenceFrequency(RECURRENCE_TYPES.MONTHLY);
    setRecurrenceStartDate(toDateInputValue());
    setRecurrenceEndDate('');
    setNeverEnds(true);
    setError('');
    onClose();
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Quick Add">
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        <TransactionTypeToggle value={type} onChange={handleTypeChange} />
        <QuickAmountInput value={amount} onChange={setAmount} inputRef={amountFocusRef} error={error} />
        <CategorySelect value={category} onChange={setCategory} type={type} />
        <NoteInput value={note} onChange={setNote} />
        <RecurringOptions
          endDate={recurrenceEndDate}
          frequency={recurrenceFrequency}
          isRecurring={isRecurring}
          neverEnds={neverEnds}
          onEndDateChange={setRecurrenceEndDate}
          onFrequencyChange={setRecurrenceFrequency}
          onNeverEndsChange={setNeverEnds}
          onRecurringChange={setIsRecurring}
          onStartDateChange={setRecurrenceStartDate}
          startDate={recurrenceStartDate}
        />

        <AnimatedButton
          type="submit"
          className="h-14 w-full rounded-2xl bg-ink text-base font-bold text-white shadow-lg shadow-slate-300"
        >
          Save Transaction
        </AnimatedButton>
      </form>

      {/* Future extension: shared expense quick add can add split options inside this sheet. */}
      {/* Future extension: voice expense entry can prefill amount, category, and note here. */}
    </BottomSheet>
  );
}

function QuickAmountInput({ error, inputRef, onChange, value }) {
  return (
    <div>
      <label className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
        error ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-slate-50'
      }`}>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Amount</span>
          <input
            ref={inputRef}
            className="mt-1 w-full bg-transparent text-4xl font-bold outline-none placeholder:text-slate-300"
            inputMode="decimal"
            onChange={(event) => onChange(event.target.value)}
            placeholder="0.00"
            type="text"
            value={value}
          />
        </span>
      </label>
      {error ? <p className="mt-2 px-2 text-sm font-semibold text-coral">{error}</p> : null}
    </div>
  );
}
