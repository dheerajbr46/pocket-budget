import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { pressableStyles, transitionPresets } from '../../constants/motion.js';
import { toDateInputValue } from '../../utils/dates/index.js';

const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function parseDateValue(value) {
  if (!value) {
    return new Date();
  }

  return new Date(`${value}T00:00:00`);
}

function getMonthLabel(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

function buildMonthDays(visibleMonth) {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = firstDay.getDay();

  return [
    ...Array.from({ length: leadingBlanks }, (_, index) => ({
      id: `blank-${index}`,
      isBlank: true
    })),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const date = new Date(year, month, day);

      return {
        date,
        id: toDateInputValue(date),
        isBlank: false,
        label: day
      };
    })
  ];
}

const quickActions = [
  { label: 'Today', value: () => addDays(0) },
  { label: 'Tomorrow', value: () => addDays(1) },
  { label: 'Next week', value: () => addDays(7) }
];

export function InlineCalendarPicker({ isOpen, onClose, onSelect, value }) {
  const [visibleMonth, setVisibleMonth] = useState(() => parseDateValue(value));
  const todayValue = toDateInputValue();
  const monthDays = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);

  useEffect(() => {
    if (isOpen) {
      setVisibleMonth(parseDateValue(value));
    }
  }, [isOpen, value]);

  if (!isOpen) {
    return null;
  }

  function handleSelect(nextValue) {
    onSelect?.(nextValue);
    onClose?.();
  }

  function moveMonth(monthOffset) {
    setVisibleMonth((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1));
  }

  return (
    <div className={`rounded-3xl bg-white p-3 shadow-sm ring-1 ring-slate-100 ${transitionPresets.soft}`}>
      <div className="mb-3 flex items-center gap-2">
        {quickActions.map((action) => {
          const nextValue = action.value();
          const isSelected = value === nextValue;

          return (
            <button
              key={action.label}
              type="button"
              onClick={() => handleSelect(nextValue)}
              className={`flex-1 rounded-2xl px-2.5 py-2 text-[11px] font-bold ${
                isSelected ? 'bg-ink text-white' : 'bg-slate-100 text-slate-500'
              } ${pressableStyles}`}
            >
              {action.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className={`grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 text-slate-500 ${pressableStyles}`}
          aria-label="Previous month"
        >
          <ChevronLeft size={17} />
        </button>
        <p className="text-sm font-bold text-ink">{getMonthLabel(visibleMonth)}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => moveMonth(1)}
            className={`grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 text-slate-500 ${pressableStyles}`}
            aria-label="Next month"
          >
            <ChevronRight size={17} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className={`grid h-9 w-9 place-items-center rounded-2xl bg-slate-50 text-slate-500 ${pressableStyles}`}
            aria-label="Close calendar"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
        {weekdayLabels.map((label, index) => (
          <span key={`${label}-${index}`}>{label}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {monthDays.map((day) => {
          if (day.isBlank) {
            return <span key={day.id} className="h-8" />;
          }

          const isSelected = value === day.id;
          const isToday = todayValue === day.id;

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => handleSelect(day.id)}
              className={`h-8 rounded-xl text-xs font-bold ${
                isSelected
                  ? 'bg-ink text-white shadow-sm'
                  : isToday
                    ? 'bg-teal-50 text-mint ring-1 ring-teal-100'
                    : 'text-slate-600 hover:bg-slate-50'
              } ${transitionPresets.base} active:scale-95 motion-reduce:active:scale-100`}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      {/* TODO: Add drag calendar gestures, recurring previews, holiday highlighting, and paycheck scheduling. */}
    </div>
  );
}
