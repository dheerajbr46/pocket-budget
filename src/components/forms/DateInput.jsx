import { CalendarDays } from 'lucide-react';
import { FormField } from './FormField.jsx';
import { AppDatePicker } from './InlineCalendarPicker.jsx';

export function DatePickerButton({
  allowClear = false,
  className = '',
  disabled = false,
  label = 'Choose date',
  maxDate,
  minDate,
  onChange,
  placeholder = 'Select date',
  quickActions,
  value
}) {
  return (
    <AppDatePicker
      allowClear={allowClear}
      className={className}
      disabled={disabled}
      label={label}
      maxDate={maxDate}
      minDate={minDate}
      onDateChange={onChange}
      placeholder={placeholder}
      quickActions={quickActions}
      selectedDate={value}
    />
  );
}

export function DateInput({ onChange, value }) {
  return (
    <FormField icon={CalendarDays} label="Date">
      <AppDatePicker
        className="-mx-1"
        label="Date"
        onDateChange={onChange}
        selectedDate={value}
      />
    </FormField>
  );
}
