import { Bell, Search } from 'lucide-react';

export function Header({ title }) {
  return (
    <header className="flex items-center justify-between px-5 pb-3 pt-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Pocket Budget</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-600 shadow-sm"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-600 shadow-sm"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  );
}
