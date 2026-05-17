import { Check, Circle } from 'lucide-react';
import { pressableStyles } from '../../constants/motion.js';
import { BottomSheet } from './BottomSheet.jsx';

export function OptionRow({ disabled = false, isSelected, label, meta, onSelect }) {
  const Icon = isSelected ? Check : Circle;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${
        isSelected ? 'bg-teal-50 text-teal-900' : 'bg-slate-50 text-slate-600'
      } ${disabled ? 'cursor-not-allowed opacity-40' : pressableStyles}`}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-400">
        <span className="h-3 w-3 rounded-full bg-slate-200" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold">{label}</span>
        {meta ? <span className="mt-0.5 block text-xs font-semibold text-slate-400">{meta}</span> : null}
      </span>
      <Icon size={17} className={isSelected ? 'text-mint' : 'text-slate-300'} />
    </button>
  );
}

export function SelectSheet({ isOpen, onClose, onSelect, options, title, value }) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
      <div className="mt-4 max-h-[58vh] space-y-2 overflow-y-auto pb-1">
        {options.map((option) => (
          <OptionRow
            key={option.value}
            disabled={option.disabled}
            isSelected={option.value === value}
            label={option.label}
            meta={option.meta}
            onSelect={() => {
              if (option.disabled) {
                return;
              }

              onSelect(option.value);
              onClose();
            }}
          />
        ))}
      </div>

      {/* TODO: Add emoji category icons and merchant-based category suggestions in option rows. */}
    </BottomSheet>
  );
}
