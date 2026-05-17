import { CurrencyDollar } from '@phosphor-icons/react';
import { FormField } from './FormField.jsx';

export function AmountInput({ error, value, onChange }) {
  return (
    <FormField error={error} icon={CurrencyDollar} label="Amount">
      <input
        className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-slate-300"
        inputMode="decimal"
        onChange={(event) => {
          const raw = event.target.value;
          if (raw === '' || /^\d*\.?\d{0,2}$/.test(raw)) onChange(raw);
        }}
        placeholder="0.00"
        type="text"
        value={value}
      />
    </FormField>
  );
}
