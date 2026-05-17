import { CheckCircle, X } from '@phosphor-icons/react';
import { AnimatedButton } from '../ui/AnimatedButton.jsx';

export function Toast({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-[390px] animate-toast-in items-center gap-3 rounded-3xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-soft">
        <CheckCircle size={19} className="shrink-0 text-mint" />
        <span className="min-w-0 flex-1">{message}</span>
        <AnimatedButton
          onClick={onClose}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </AnimatedButton>
      </div>
    </div>
  );
}
