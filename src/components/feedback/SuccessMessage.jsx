import { CheckCircle } from '@phosphor-icons/react';

export function SuccessMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 rounded-3xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 shadow-sm">
      <CheckCircle size={19} />
      <span>{message}</span>
    </div>
  );
}
