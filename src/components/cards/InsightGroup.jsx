import { pressableStyles, transitionPresets } from '../../constants/motion.js';

const groupStyles = {
  danger: {
    accent: 'bg-coral',
    count: 'bg-rose-100 text-rose-700',
    empty: 'text-rose-500',
    title: 'text-rose-950'
  },
  good: {
    accent: 'bg-mint',
    count: 'bg-teal-50 text-teal-700',
    empty: 'text-teal-600',
    title: 'text-teal-900'
  },
  warning: {
    accent: 'bg-amber-400',
    count: 'bg-amber-100 text-amber-700',
    empty: 'text-amber-600',
    title: 'text-amber-900'
  }
};

export function InsightGroup({
  children,
  count,
  emptyMessage,
  isOpen = true,
  onToggle,
  trailing,
  title,
  tone = 'good'
}) {
  const style = groupStyles[tone] ?? groupStyles.good;
  const HeaderElement = onToggle ? 'button' : 'div';

  return (
    <div className={`rounded-3xl bg-white/70 p-3 ${transitionPresets.base}`}>
      <HeaderElement
        type={onToggle ? 'button' : undefined}
        onClick={onToggle}
        className={`flex w-full items-center gap-2 rounded-2xl text-left ${onToggle ? pressableStyles : transitionPresets.base}`}
      >
        <span className={`h-2.5 w-2.5 rounded-full ${style.accent}`} />
        <h3 className={`flex-1 text-sm font-bold ${style.title}`}>{title}</h3>
        <span className={`rounded-full px-2 py-1 text-xs font-bold ${style.count}`}>{count}</span>
        {trailing}
      </HeaderElement>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'mt-3 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {count > 0 ? (
            <div className="space-y-2">{children}</div>
          ) : (
            <p className={`rounded-2xl bg-white/60 px-3 py-2.5 text-sm font-semibold ${style.empty}`}>
              {emptyMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
