import { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { InsightGroup } from './InsightGroup.jsx';
import { InsightListRow } from './InsightListRow.jsx';

export function CollapsibleInsightGroup({
  defaultOpen = false,
  emptyMessage,
  insights,
  title,
  tone
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div>
      <InsightGroup
        count={insights.length}
        emptyMessage={emptyMessage}
        isOpen={isOpen}
        onToggle={() => setIsOpen((currentValue) => !currentValue)}
        trailing={
          <CaretDown
            size={16}
            className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        }
        title={title}
        tone={tone}
      >
        {insights.map((insight, index) => (
          <InsightListRow key={insight.id} index={index} insight={insight} />
        ))}
      </InsightGroup>
    </div>
  );
}
