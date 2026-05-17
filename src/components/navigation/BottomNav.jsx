import { navItems } from '../../data/navigation.js';
import { Button } from '../ui/Button.jsx';

export function BottomNav({ activePage, onNavigate, forceMobile }) {
  return (
    <nav className={`border-t border-slate-200/80 bg-white/90 px-3 pb-5 pt-2 backdrop-blur ${forceMobile ? '' : 'lg:hidden'}`}>
      <div
        className="grid items-end gap-1"
        style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <Button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition-all duration-200 ${
                isActive ? 'bg-ink text-white shadow-md shadow-slate-200/80' : 'text-slate-500 hover:bg-slate-100/80 hover:text-ink'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.title}
            >
              <div className="relative flex flex-col items-center gap-1">
                {isActive && (
                  <span className="absolute -top-2.5 h-1 w-5 rounded-full bg-mint" />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
