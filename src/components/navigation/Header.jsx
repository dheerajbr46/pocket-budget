import { Bell, Search } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function Header({ title }) {
  return (
    <header className="flex items-center justify-between px-5 pb-3 pt-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Pocket Budget</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-600 shadow-sm"
          aria-label="Search"
        >
          <Search size={18} />
        </Button>
        <Button
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-600 shadow-sm"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </Button>
      </div>
    </header>
  );
}
