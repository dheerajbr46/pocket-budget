import { DollarSign } from 'lucide-react';
import { FormField } from './FormField.jsx';

export function AmountInput({ error, value, onChange }) {
  return (
    <FormField error={error} icon={DollarSign} label="Amount">
      <input
        className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-slate-300"
        inputMode="decimal"
        onChange={(event) => onChange(event.target.value)}
        placeholder="0.00"
        type="text"
        value={value}
      />
    </FormField>
  );
}
