import { useState } from 'react';
import { navItems } from '../../data/navigation.js';
import { BottomNav } from './BottomNav.jsx';
import { Header } from './Header.jsx';

export function AppShell({ activePage, children, currentTitle, onNavigate }) {
  const [forceMobile, setForceMobile] = useState(false);
  const desk = !forceMobile;

  return (
    <div className={`min-h-screen bg-[radial-gradient(circle_at_top,#ffffff_0%,#edf6f9_34%,#dbeafe_100%)] text-ink ${desk ? 'lg:flex' : ''}`}>

      {/* Sidebar — desktop only, hidden when forceMobile */}
      <aside className={desk ? 'hidden lg:flex lg:w-60 xl:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-slate-200/80 lg:bg-white/90 lg:backdrop-blur lg:sticky lg:top-0 lg:h-screen' : 'hidden'}>
        <div className="px-6 py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Pocket Budget</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                  isActive ? 'bg-ink text-white shadow-lg shadow-slate-300' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.7 : 2.2} />
                {item.title}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content area */}
      <div className={`flex-1 px-3 py-4 sm:px-6 sm:py-8 ${desk ? 'lg:p-0 lg:flex lg:flex-col lg:min-h-screen lg:bg-paper' : ''}`}>
        <div className={`mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[34px] border border-white/80 bg-paper shadow-soft sm:min-h-[860px] ${desk ? 'lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none lg:bg-transparent lg:overflow-visible lg:min-h-0 lg:flex-1' : ''}`}>
          <Header
            title={currentTitle}
            forceMobile={forceMobile}
            onToggleView={() => setForceMobile((v) => !v)}
          />
          <main key={activePage} className={`animate-page-in flex-1 overflow-y-auto px-5 pb-28 pt-2 ${desk ? 'lg:px-8 lg:pb-10 lg:max-w-5xl lg:w-full lg:mx-auto' : ''}`}>
            {children}
          </main>
          <BottomNav activePage={activePage} onNavigate={onNavigate} forceMobile={forceMobile} />
        </div>
      </div>

    </div>
  );
}