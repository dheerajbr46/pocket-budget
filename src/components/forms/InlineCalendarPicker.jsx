import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { pressableStyles, transitionPresets } from '../../constants/motion.js';
import { toDateInputValue } from '../../utils/dates/index.js';
import { formatShortDate } from '../../utils/formatting/index.js';

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

const defaultQuickActions = [
  { label: 'Today', value: () => addDays(0) },
  { label: 'Tomorrow', value: () => addDays(1) },
  { label: 'Next week', value: () => addDays(7) }
];

function isDateAllowed(value, minDate, maxDate) {
  if (!value) {
    return true;
  }

  if (minDate && value < minDate) {
    return false;
  }

  if (maxDate && value > maxDate) {
    return false;
  }

  return true;
}

export function InlineCalendarPicker({
  isOpen,
  maxDate,
  minDate,
  onClose,
  onSelect,
  quickActions = defaultQuickActions,
  value
}) {
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
    if (!isDateAllowed(nextValue, minDate, maxDate)) {
      return;
    }

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
          const isDisabled = !isDateAllowed(nextValue, minDate, maxDate);

          return (
            <button
              key={action.label}
              type="button"
              disabled={isDisabled}
              onClick={() => handleSelect(nextValue)}
              className={`flex-1 rounded-2xl px-2.5 py-2 text-[11px] font-bold ${
                isSelected ? 'bg-ink text-white' : 'bg-slate-100 text-slate-500'
              } ${isDisabled ? 'cursor-not-allowed opacity-40' : pressableStyles}`}
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
          const isDisabled = !isDateAllowed(day.id, minDate, maxDate);

          return (
            <button
              key={day.id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleSelect(day.id)}
              className={`h-8 rounded-xl text-xs font-bold ${
                isDisabled
                  ? 'cursor-not-allowed text-slate-200'
                  : isSelected
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

export function AppDatePicker({
  allowClear = false,
  className = '',
  disabled = false,
  label = 'Date',
  maxDate,
  minDate,
  onDateChange,
  placeholder = 'Select date',
  quickActions = defaultQuickActions,
  selectedDate
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleChange(nextDate) {
    onDateChange?.(nextDate);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className={`flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-mint/40 ${
          disabled ? 'cursor-not-allowed opacity-60' : pressableStyles
        } ${isOpen ? 'ring-2 ring-teal-100' : ''}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          <CalendarDays size={16} className="shrink-0 text-slate-400" />
          <span className="min-w-0">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {label}
            </span>
            <span className={`mt-1 block truncate text-sm font-bold ${selectedDate ? 'text-ink' : 'text-slate-400'}`}>
              {selectedDate ? formatShortDate(selectedDate) : placeholder}
            </span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {allowClear && selectedDate ? (
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onDateChange?.('');
                setIsOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onDateChange?.('');
                  setIsOpen(false);
                }
              }}
              className={`grid h-7 w-7 place-items-center rounded-xl bg-slate-100 text-slate-400 ${pressableStyles}`}
              aria-label={`Clear ${label}`}
            >
              <X size={14} />
            </span>
          ) : null}
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 motion-reduce:transition-none ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen ? 'mt-2 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
        } motion-reduce:transition-none`}
      >
        <div className="overflow-hidden">
          <InlineCalendarPicker
            isOpen={isOpen}
            maxDate={maxDate}
            minDate={minDate}
            onClose={() => setIsOpen(false)}
            onSelect={handleChange}
            quickActions={quickActions}
            value={selectedDate}
          />
        </div>
      </div>

      {/* TODO: Add natural language dates, month/year picker, recurring-specific previews, and holiday/payday markers. */}
    </div>
  );
}

export { defaultQuickActions };
