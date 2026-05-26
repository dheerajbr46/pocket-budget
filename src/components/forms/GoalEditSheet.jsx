import { useEffect, useState } from 'react';
import { toDateInputValue } from '../../utils/dates/index.js';
import { BottomSheet } from '../ui/BottomSheet.jsx';
import { Button } from '../ui/Button.jsx';
import { DatePickerButton } from './DateInput.jsx';

export function GoalEditSheet({ goal, isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [icon, setIcon] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setName(goal?.name ?? '');
    setTargetAmount(goal ? String(goal.targetAmount) : '');
    setCurrentAmount(goal ? String(goal.currentAmount) : '0');
    setTargetDate(goal?.targetDate ?? '');
    setIcon(goal?.icon ?? '');
    setError('');
  }, [goal, isOpen]);

  function handleSubmit(event) {
    event.preventDefault();

    const numericTarget = Number(targetAmount);
    const numericCurrent = Number(currentAmount);

    if (!name.trim()) {
      setError('Name your savings goal.');
      return;
    }

    if (!targetAmount.trim() || !Number.isFinite(numericTarget) || numericTarget <= 0) {
      setError('Enter a target amount greater than 0.');
      return;
    }

    if (!Number.isFinite(numericCurrent) || numericCurrent < 0) {
      setError('Saved amount cannot be negative.');
      return;
    }

    if (numericCurrent > numericTarget) {
      setError('Saved amount cannot exceed the target.');
      return;
    }

    onSave({
      ...goal,
      currentAmount: numericCurrent,
      icon: icon.trim(),
      name,
      targetAmount: numericTarget,
      targetDate
    });
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={goal ? 'Edit goal' : 'New savings goal'}>
      <form className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto pb-1" onSubmit={handleSubmit}>
        <label className="block rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Goal name</span>
          <input
            className="mt-2 w-full bg-transparent font-bold text-ink outline-none placeholder:text-slate-300"
            onChange={(event) => setName(event.target.value)}
            placeholder="Emergency Fund"
            value={name}
          />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Target</span>
            <input
              className="mt-2 w-full bg-transparent text-lg font-bold text-ink outline-none placeholder:text-slate-300"
              inputMode="decimal"
              onChange={(event) => setTargetAmount(event.target.value)}
              placeholder="5000"
              value={targetAmount}
            />
          </label>

          <label className="block rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Saved</span>
            <input
              className="mt-2 w-full bg-transparent text-lg font-bold text-ink outline-none placeholder:text-slate-300"
              inputMode="decimal"
              onChange={(event) => setCurrentAmount(event.target.value)}
              placeholder="0"
              value={currentAmount}
            />
          </label>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Target date</span>
          <DatePickerButton
            allowClear
            className="mt-2"
            label="Goal target date"
            minDate={toDateInputValue()}
            onChange={setTargetDate}
            placeholder="Optional"
            value={targetDate}
          />
        </div>

        <label className="block rounded-2xl bg-slate-50 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Icon optional</span>
          <input
            className="mt-2 w-full bg-transparent font-bold text-ink outline-none placeholder:text-slate-300"
            maxLength={3}
            onChange={(event) => setIcon(event.target.value)}
            placeholder="Optional"
            value={icon}
          />
        </label>

        {error ? <p className="text-sm font-semibold text-coral">{error}</p> : null}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button onClick={onClose} className="h-12 rounded-2xl bg-slate-100 font-bold text-slate-600">
            Cancel
          </Button>
          <button type="submit" className="h-12 rounded-2xl bg-ink font-bold text-white">
            Save
          </button>
        </div>
      </form>

      {/* TODO: Add goal reminders and optional cloud sync settings for savings goals. */}
    </BottomSheet>
  );
}
