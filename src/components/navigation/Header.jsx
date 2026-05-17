import { Bell, DeviceMobile, MagnifyingGlass, Monitor } from '@phosphor-icons/react';
import { Button } from '../ui/Button.jsx';

export function Header({ title, forceMobile, onToggleView }) {
  return (
    <header className="flex items-center justify-between px-5 pb-4 pt-5 lg:border-b lg:border-slate-200 lg:bg-white lg:px-8 lg:py-4 dark:lg:border-slate-700 dark:lg:bg-slate-900">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400 lg:hidden">Pocket Budget</p>
        <h1 className="mt-1 text-2xl font-bold text-ink lg:mt-0 lg:text-lg lg:font-semibold lg:text-slate-800">{title}</h1>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          onClick={onToggleView}
          className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 transition-colors duration-150 hover:bg-slate-200"
          aria-label={forceMobile ? 'Switch to desktop view' : 'Switch to mobile view'}
          title={forceMobile ? 'Switch to desktop view' : 'Switch to mobile view'}
        >
          {forceMobile ? <Monitor size={16} /> : <DeviceMobile size={16} />}
        </Button>
        <Button
          className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 transition-colors duration-150 hover:bg-slate-200"
          aria-label="Search"
        >
          <MagnifyingGlass size={16} />
        </Button>
        <Button
          className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 transition-colors duration-150 hover:bg-slate-200"
          aria-label="Notifications"
        >
          <Bell size={16} />
        </Button>
      </div>
    </header>
  );
}
