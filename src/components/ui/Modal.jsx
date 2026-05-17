import { X } from '@phosphor-icons/react';
import { Button } from './Button.jsx';
import { Card } from './Card.jsx';

export function Modal({ children, onClose, title }) {
  if (!children) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 px-4">
      <Card className="w-full max-w-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <Button
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500"
            aria-label="Close modal"
          >
            <X size={18} />
          </Button>
        </div>
        {children}
      </Card>
    </div>
  );
}
