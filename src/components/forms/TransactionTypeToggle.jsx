import { segmentedControlMotion } from '../../constants/motion.js';
import { transactionTypeOptions } from '../../constants/transactionTypes.js';

export function TransactionTypeToggle({ onChange, value }) {
  const activeIndex = Math.max(
    0,
    transactionTypeOptions.findIndex((option) => option.id === value)
  );

  return (
    <div className="relative grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1" role="group" aria-label="Transaction type">
      <span
        className={`absolute bottom-1 top-1 rounded-xl bg-white shadow-sm ${segmentedControlMotion.activePill}`}
        style={{
          transform: `translateX(calc(${activeIndex} * (100% + 0.5rem)))`,
          width: 'calc((100% - 0.5rem) / 2)'
        }}
      />
      {transactionTypeOptions.map((option) => {
        const isActive = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
            className={`relative z-10 rounded-xl px-4 py-3 text-sm font-bold ${segmentedControlMotion.option} ${
              isActive ? 'text-ink' : 'text-slate-500 hover:text-ink'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
