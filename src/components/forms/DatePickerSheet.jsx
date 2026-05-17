import { CalendarDays } from 'lucide-react';
import { pressableStyles } from '../../constants/motion.js';
import { toDateInputValue } from '../../utils/dates/index.js';
import { formatShortDate } from '../../utils/formatting/index.js';
import { BottomSheet } from '../ui/BottomSheet.jsx';

function offsetDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

const quickOptions = [
  { label: 'Yesterday', value: offsetDate(-1) },
  { label: 'Today', value: offsetDate(0) },
  { label: 'Tomorrow', value: offsetDate(1) }
];

export function QuickDateChips({ onSelect, value }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {quickOptions.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`rounded-2xl px-3 py-2.5 text-xs font-bold ${
              isSelected ? 'bg-ink text-white shadow-sm' : 'bg-slate-100 text-slate-500'
            } ${pressableStyles}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function DatePickerSheet({ isOpen, onClose, onSelect, title = 'Choose date', value }) {
  const selectedDateLabel = value ? formatShortDate(value) : 'selected date';

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mt-4 space-y-4">
        <QuickDateChips onSelect={onSelect} value={value} />

        <label className={`block rounded-3xl bg-slate-50 p-4 ${pressableStyles}`}>
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            <CalendarDays size={15} />
            Calendar
          </span>
          <input
            className="mt-3 h-12 w-full rounded-2xl bg-white px-4 text-base font-bold text-ink outline-none"
            onChange={(event) => onSelect(event.target.value)}
            type="date"
            value={value}
          />
        </label>

        <button
          type="button"
          onClick={onClose}
          className={`h-12 w-full rounded-2xl bg-ink font-bold text-white ${pressableStyles}`}
        >
          Use {selectedDateLabel}
        </button>
      </div>

      {/* TODO: Add a custom calendar month view and natural language dates. */}
    </BottomSheet>
  );
}
