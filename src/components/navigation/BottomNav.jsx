import { LayoutGroup, motion } from 'framer-motion';
import { navItems } from '../../data/navigation.js';

export function BottomNav({ activePage, onNavigate, forceMobile }) {
  return (
    <nav className={`border-t border-slate-200/80 bg-white/90 px-3 pb-5 pt-2 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/95 ${forceMobile ? '' : 'lg:hidden'}`}>
      <LayoutGroup id="bottom-nav">
        <div
          className="grid items-end gap-1"
          style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl text-[11px] font-semibold transition-colors duration-150 ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-ink'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.title}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-2xl bg-indigo"
                    transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center gap-1">
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
    </nav>
  );
}
