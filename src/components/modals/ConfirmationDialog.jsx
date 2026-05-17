import { X } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function ConfirmationDialog({
  confirmLabel = 'Confirm',
  isOpen,
  message,
  onCancel,
  onConfirm,
  title
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-10 grid place-items-center rounded-[32px] bg-white/80 p-5 backdrop-blur-sm">
      <div className="w-full rounded-3xl bg-white p-4 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-coral">Confirm</p>
            <h3 className="mt-1 text-lg font-bold text-ink">{title}</h3>
          </div>
          <Button
            aria-label="Cancel"
            onClick={onCancel}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500"
          >
            <X size={16} />
          </Button>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button onClick={onCancel} className="h-12 rounded-2xl bg-slate-100 font-bold text-slate-600">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="h-12 rounded-2xl bg-rose-50 font-bold text-coral">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
