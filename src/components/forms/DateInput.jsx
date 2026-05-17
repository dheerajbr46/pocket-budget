import { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { pressableStyles } from '../../constants/motion.js';
import { formatShortDate } from '../../utils/formatting/index.js';
import { FormField } from './FormField.jsx';
import { DatePickerSheet } from './DatePickerSheet.jsx';

export function DatePickerButton({
  className = '',
  disabled = false,
  label = 'Choose date',
  onChange,
  value
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={`flex w-full items-center justify-between gap-3 bg-transparent text-left font-semibold outline-none focus-visible:ring-2 focus-visible:ring-mint/40 ${
          disabled ? 'cursor-not-allowed opacity-50' : pressableStyles
        } ${className}`}
      >
        <span className={value ? 'text-ink' : 'text-slate-400'}>{value ? formatShortDate(value) : 'Select date'}</span>
        <ChevronDown size={18} className="text-slate-400" />
      </button>

      <DatePickerSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={onChange}
        title={label}
        value={value}
      />
    </>
  );
}

export function DateInput({ onChange, value }) {
  return (
    <FormField icon={CalendarDays} label="Date">
      <DatePickerButton onChange={onChange} value={value} />
    </FormField>
  );
}
