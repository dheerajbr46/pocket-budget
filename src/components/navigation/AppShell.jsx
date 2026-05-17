import { useState } from 'react';
import { Wallet } from 'lucide-react';
import { navItems } from '../../data/navigation.js';
import { BottomNav } from './BottomNav.jsx';
import { Header } from './Header.jsx';

export function AppShell({ activePage, children, currentTitle, onNavigate }) {
  const [forceMobile, setForceMobile] = useState(false);
  const desk = !forceMobile;

  return (
    <div className={`min-h-screen bg-[#f6f8fc] text-ink ${desk ? 'lg:flex' : ''}`}>

      {/* Sidebar — desktop only */}
      <aside className={desk ? 'hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:bg-white lg:border-r lg:border-slate-200 lg:sticky lg:top-0 lg:h-screen' : 'hidden'}>
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo text-white">
            <Wallet size={15} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-ink">Pocket Budget</p>
            <p className="text-[11px] text-slate-400">Personal finance</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-ink'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content area */}
      <div className={`flex-1 px-3 py-4 sm:px-6 sm:py-8 ${desk ? 'lg:p-0 lg:flex lg:flex-col lg:min-h-screen' : ''}`}>
        <div className={`mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[34px] border border-white/80 bg-paper shadow-soft sm:min-h-[860px] ${desk ? 'lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none lg:bg-[#f6f8fc] lg:overflow-visible lg:min-h-0 lg:flex-1' : ''}`}>
          <Header
            title={currentTitle}
            forceMobile={forceMobile}
            onToggleView={() => setForceMobile((v) => !v)}
          />
          <main key={activePage} className={`animate-page-in flex-1 overflow-y-auto px-5 pb-28 pt-4 ${desk ? 'lg:px-8 lg:pb-10 lg:pt-6 lg:max-w-5xl lg:w-full lg:mx-auto' : ''}`}>
            {children}
          </main>
          <BottomNav activePage={activePage} onNavigate={onNavigate} forceMobile={forceMobile} />
        </div>
      </div>

    </div>
  );
}
