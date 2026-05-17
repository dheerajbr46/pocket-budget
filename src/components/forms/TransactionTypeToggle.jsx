import { transactionTypeOptions } from '../../constants/transactionTypes.js';

export function TransactionTypeToggle({ onChange, value }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
      {transactionTypeOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
            value === option.id ? 'bg-white text-ink shadow-sm' : 'text-slate-500'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
