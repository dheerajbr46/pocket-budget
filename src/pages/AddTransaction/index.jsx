import { useState } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { AmountInput } from '../../components/forms/AmountInput.jsx';
import { CategorySelect } from '../../components/forms/CategorySelect.jsx';
import { DateInput } from '../../components/forms/DateInput.jsx';
import { NoteInput } from '../../components/forms/NoteInput.jsx';
import { RecurringOptions } from '../../components/forms/RecurringOptions.jsx';
import { TransactionTypeToggle } from '../../components/forms/TransactionTypeToggle.jsx';
import { getCategoriesForType } from '../../constants/categories.js';
import { RECURRENCE_TYPES } from '../../constants/recurrenceTypes.js';
import { TRANSACTION_TYPES } from '../../constants/transactionTypes.js';
import { toDateInputValue } from '../../utils/dates/index.js';

export function AddTransaction({ onSave }) {
  const [type, setType] = useState(TRANSACTION_TYPES.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(getCategoriesForType(TRANSACTION_TYPES.EXPENSE)[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(toDateInputValue);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState(RECURRENCE_TYPES.MONTHLY);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState('');
  const [neverEnds, setNeverEnds] = useState(true);
  const [errors, setErrors] = useState({});

  function handleTypeChange(nextType) {
    setType(nextType);
    setCategory(getCategoriesForType(nextType)[0]);
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
      type,
      amount,
      category,
      note,
      date,
      isRecurring,
      recurrenceEndDate: isRecurring && !neverEnds ? recurrenceEndDate : undefined,
      recurrenceFrequency: isRecurring ? recurrenceFrequency : undefined,
      recurrenceStartDate: isRecurring ? date : undefined
    });
  }

  return (
    <div className="space-y-5">
      <Card>
        <TransactionTypeToggle value={type} onChange={handleTypeChange} />

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <AmountInput value={amount} onChange={setAmount} error={errors.amount} />
          <CategorySelect value={category} onChange={setCategory} type={type} error={errors.category} />
          <NoteInput value={note} onChange={setNote} />
          <DateInput value={date} onChange={setDate} />
          <RecurringOptions
            endDate={recurrenceEndDate}
            frequency={recurrenceFrequency}
            isRecurring={isRecurring}
            neverEnds={neverEnds}
            onEndDateChange={setRecurrenceEndDate}
            onFrequencyChange={setRecurrenceFrequency}
            onNeverEndsChange={setNeverEnds}
            onRecurringChange={setIsRecurring}
            onStartDateChange={setDate}
            startDate={date}
          />

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

      {/* TODO: Add recurring transaction editing modes for single occurrence vs entire series. */}
    </div>
  );
}
