import { Sparkles } from 'lucide-react';
import { pressableStyles } from '../../constants/motion.js';

export function CategorySuggestionChip({ currentCategory, onAccept, suggestion }) {
  if (!suggestion) {
    return null;
  }

  const matchesCurrentCategory = suggestion.category === currentCategory;
  const sourceLabel = suggestion.source === 'learned' ? 'Suggested locally' : 'Suggested from note';
  const title = matchesCurrentCategory
    ? suggestion.confidence === 'high'
      ? `Auto-detected: ${suggestion.category}`
      : `Category looks right: ${suggestion.category}`
    : `Suggested: ${suggestion.category}`;
  const detail = matchesCurrentCategory
    ? `Detected from note with ${suggestion.confidence} confidence`
    : `${sourceLabel} • ${suggestion.confidence} confidence`;
  const WrapperElement = matchesCurrentCategory ? 'div' : 'button';

  return (
    <WrapperElement
      type={matchesCurrentCategory ? undefined : 'button'}
      onClick={matchesCurrentCategory ? undefined : () => onAccept(suggestion.category)}
      className={`flex w-full items-center justify-between gap-3 rounded-2xl bg-teal-50 px-3 py-2 text-left ${pressableStyles}`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white text-mint">
          <Sparkles size={15} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-teal-900">
            {title}
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-teal-700">
            {detail}
          </span>
        </span>
      </span>
      {matchesCurrentCategory ? null : (
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-teal-700">
          Apply
        </span>
      )}
    </WrapperElement>
  );
}
