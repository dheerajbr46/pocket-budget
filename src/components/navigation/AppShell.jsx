import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Wallet } from '@phosphor-icons/react';
import { navItems } from '../../data/navigation.js';
import { BottomNav } from './BottomNav.jsx';
import { Header } from './Header.jsx';

export function AppShell({ activePage, children, currentTitle, onNavigate }) {
  const [forceMobile, setForceMobile] = useState(false);
  const desk = !forceMobile;

  return (
    <div className={`min-h-screen bg-[var(--app-bg)] text-ink ${desk ? 'lg:flex' : ''}`}>

      {/* Sidebar — desktop only */}
      <aside className={desk ? 'hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:bg-white dark:lg:bg-slate-900 lg:border-r lg:border-slate-200 dark:lg:border-slate-700 lg:sticky lg:top-0 lg:h-screen' : 'hidden'}>
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-700 px-5 py-5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo text-white">
            <Wallet size={15} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-ink">Pocket Budget</p>
            <p className="text-[11px] text-slate-400">Personal finance</p>
          </div>
        </div>

        {/* Nav with layoutId sliding indicator */}
        <LayoutGroup id="sidebar-nav">
          <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`pb-press relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    isActive ? 'text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bg"
                      className="absolute inset-0 rounded-xl bg-indigo shadow-sm"
                      transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    <Icon size={18} weight={isActive ? 'fill' : 'regular'} />
                    <span>{item.title}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </LayoutGroup>
      </aside>

      {/* Content area */}
      <div className={`flex-1 px-3 py-4 sm:px-6 sm:py-8 ${desk ? 'lg:p-0 lg:flex lg:flex-col lg:min-h-screen' : ''}`}>
        <div className={`mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[430px] flex-col overflow-hidden rounded-[34px] border border-white/80 dark:border-slate-700/50 bg-paper shadow-soft sm:min-h-[860px] ${desk ? 'lg:max-w-none lg:rounded-none lg:border-0 lg:shadow-none lg:bg-[var(--app-bg)] lg:overflow-visible lg:min-h-0 lg:flex-1' : ''}`}>
          <Header
            title={currentTitle}
            forceMobile={forceMobile}
            onToggleView={() => setForceMobile((v) => !v)}
          />

          {/* Page transitions */}
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className={`px-5 pb-28 pt-4 ${desk ? 'lg:px-8 lg:pb-10 lg:pt-6 lg:max-w-5xl lg:w-full lg:mx-auto' : ''}`}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>

          <BottomNav activePage={activePage} onNavigate={onNavigate} forceMobile={forceMobile} />
        </div>
      </div>

    </div>
  );
}
