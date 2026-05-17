import { navItems } from '../data/navigation.js';

export function BottomNav({ activePage, onNavigate }) {
  return (
    <nav className="border-t border-slate-200/80 bg-white/90 px-3 pb-5 pt-2 backdrop-blur">
      <div className="grid grid-cols-5 items-end gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[11px] font-semibold transition ${
                isActive ? 'bg-ink text-white shadow-lg shadow-slate-300' : 'text-slate-500 hover:bg-slate-100'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.title}
            >
              <Icon size={20} strokeWidth={isActive ? 2.7 : 2.2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
