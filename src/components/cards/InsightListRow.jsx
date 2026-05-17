import { CheckCircle, Info, Warning, XCircle } from '@phosphor-icons/react';
import { transitionPresets } from '../../constants/motion.js';

const rowStyles = {
  danger: {
    icon: XCircle,
    iconClass: 'bg-rose-100 text-coral',
    textClass: 'text-rose-950'
  },
  neutral: {
    icon: Info,
    iconClass: 'bg-slate-100 text-slate-500',
    textClass: 'text-slate-700'
  },
  positive: {
    icon: CheckCircle,
    iconClass: 'bg-teal-50 text-mint',
    textClass: 'text-teal-900'
  },
  warning: {
    icon: Warning,
    iconClass: 'bg-amber-100 text-amber-600',
    textClass: 'text-amber-900'
  }
};

export function InsightListRow({ insight, index = 0 }) {
  const style = rowStyles[insight.type] ?? rowStyles.neutral;
  const Icon = style.icon;

  return (
    <div
      className={`animate-insight-row flex items-center gap-3 rounded-2xl bg-white/75 px-3 py-2.5 opacity-0 ${transitionPresets.base}`}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${style.iconClass}`}>
        <Icon size={16} />
      </span>
      <p className={`min-w-0 flex-1 truncate text-sm font-semibold ${style.textClass}`}>
        {insight.message}
      </p>
    </div>
  );
}
