import { MagnifyingGlass } from '@phosphor-icons/react';
import { Card } from './Card.jsx';

export function EmptyState({ description, title }) {
  return (
    <Card className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl bg-slate-100 text-slate-400">
        <MagnifyingGlass size={22} />
      </div>
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Card>
  );
}
