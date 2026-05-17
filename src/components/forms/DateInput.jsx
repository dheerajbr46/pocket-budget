import { CalendarDays } from 'lucide-react';
import { FormField } from './FormField.jsx';

export function DateInput({ onChange, value }) {
  return (
    <FormField icon={CalendarDays} label="Date">
      <input
        className="w-full bg-transparent font-semibold outline-none"
        onChange={(event) => onChange(event.target.value)}
        type="date"
        value={value}
      />
    </FormField>
  );
}
