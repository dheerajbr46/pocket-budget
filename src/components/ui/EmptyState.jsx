import { Search } from 'lucide-react';
import { Button } from './Button.jsx';
import { Card } from './Card.jsx';

export function EmptyState({ actionLabel, description, onAction, title }) {
  return (
    <Card className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-slate-100 text-slate-400">
        <Search size={22} />
      </div>
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} className="mt-4 rounded-2xl bg-teal-50 px-4 py-2 text-sm font-bold text-mint">
          {actionLabel}
        </Button>
      ) : null}
    </Card>
  );
}
