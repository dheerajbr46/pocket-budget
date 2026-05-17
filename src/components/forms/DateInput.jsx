import { CalendarDots } from '@phosphor-icons/react';
import { FormField } from './FormField.jsx';

export function DateInput({ onChange, value }) {
  return (
    <FormField icon={CalendarDots} label="Date">
      <input
        className="w-full bg-transparent font-semibold outline-none"
        onChange={(event) => onChange(event.target.value)}
        type="date"
        value={value}
      />
    </FormField>
  );
}
