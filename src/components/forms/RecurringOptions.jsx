import { ChevronDown, Repeat2 } from 'lucide-react';
import { useState } from 'react';
import { recurrenceOptions } from '../../constants/recurrenceTypes.js';
import { motionVariants, pressableStyles, transitionPresets } from '../../constants/motion.js';
import { getRecurrencePreviewText } from '../../utils/recurrence/index.js';

function formatStartSummary(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(`${value}T00:00:00`));
}

export function RecurringOptions({
  endDate,
  frequency,
  isRecurring,
  neverEnds = true,
  onEndDateChange,
  onFrequencyChange,
  onNeverEndsChange,
  onRecurringChange,
  onStartDateChange,
  startDate
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const previewText = getRecurrencePreviewText({
    endDate,
    frequency,
    neverEnds,
    startDate
  });
  const selectedFrequency = recurrenceOptions.find((option) => option.id === frequency);
  const summary = `${selectedFrequency?.label || 'Monthly'} • Starts ${formatStartSummary(startDate)}`;
  const selectedFrequencyIndex = Math.max(
    0,
    recurrenceOptions.findIndex((option) => option.id === frequency)
  );

  return (
    <div className={`rounded-2xl bg-slate-50 p-3 ${transitionPresets.soft}`}>
      <label className={`flex items-center justify-between gap-4 rounded-2xl ${pressableStyles}`}>
        <span className="flex min-w-0 items-center gap-2.5">
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white text-mint ${transitionPresets.base} ${isRecurring ? 'shadow-sm ring-1 ring-teal-100' : ''}`}>
            <Repeat2 size={17} />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-ink">Recurring transaction</span>
            <span className="mt-0.5 block truncate text-xs font-semibold text-slate-400">
              {isRecurring ? summary : 'Auto-create future entries locally'}
            </span>
          </span>
        </span>
        <input
          checked={isRecurring}
          className="h-5 w-5 accent-teal-500 transition-transform duration-200 ease-out active:scale-90 motion-reduce:transition-none"
          onChange={(event) => {
            onRecurringChange(event.target.checked);
            setIsExpanded(false);
          }}
          type="checkbox"
        />
      </label>

      {isRecurring ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setIsExpanded((currentValue) => !currentValue)}
            className={`flex w-full items-center justify-between gap-3 rounded-2xl bg-white px-3 py-2.5 text-left ${pressableStyles}`}
          >
            <span className="min-w-0">
              <span className="block text-sm font-bold text-ink">{summary}</span>
              <span className="mt-0.5 block text-xs font-semibold text-mint">
                {isExpanded ? 'Hide settings' : 'Configure'}
              </span>
            </span>
            <ChevronDown
              size={17}
              className={`shrink-0 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          <div
            className={`grid transition-all duration-300 ease-out ${
              isExpanded ? 'mt-3 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className={`space-y-3 overflow-hidden ${isExpanded ? motionVariants.fadeSlideIn : ''}`}>
              <div className="relative grid grid-cols-4 gap-1 rounded-2xl bg-white p-1">
                <span
                  className="absolute bottom-1 top-1 rounded-xl bg-ink shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    transform: `translateX(calc(${selectedFrequencyIndex} * (100% + 0.25rem)))`,
                    width: 'calc((100% - 0.5rem) / 4)'
                  }}
                />
                {recurrenceOptions.map((option) => {
                  const isActive = frequency === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => onFrequencyChange(option.id)}
                      className={`relative z-10 rounded-xl px-1.5 py-2.5 text-[11px] font-bold transition duration-200 ease-out active:scale-95 motion-reduce:transition-none ${
                        isActive ? 'text-white' : 'text-slate-500 hover:text-ink'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className={`rounded-2xl bg-white px-3 py-2.5 ${pressableStyles}`}>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Starts
                  </span>
                  <input
                    className="mt-1 w-full bg-transparent text-sm font-bold text-ink outline-none"
                    onChange={(event) => onStartDateChange?.(event.target.value)}
                    type="date"
                    value={startDate}
                  />
                </label>

                <label className={`rounded-2xl bg-white px-3 py-2.5 ${pressableStyles} ${neverEnds ? 'opacity-60' : ''}`}>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                    Ends
                  </span>
                  <input
                    className="mt-1 w-full bg-transparent text-sm font-bold text-ink outline-none"
                    disabled={neverEnds}
                    onChange={(event) => onEndDateChange?.(event.target.value)}
                    type="date"
                    value={endDate}
                  />
                </label>
              </div>

              <label className={`flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 ${pressableStyles}`}>
                <span className="text-sm font-bold text-slate-600">No end date</span>
                <input
                  checked={neverEnds}
                  className="h-5 w-5 accent-teal-500 transition-transform duration-200 ease-out active:scale-90 motion-reduce:transition-none"
                  onChange={(event) => onNeverEndsChange?.(event.target.checked)}
                  type="checkbox"
                />
              </label>

              <p className={`rounded-2xl bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 ${transitionPresets.base}`}>
                {previewText}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* TODO: Move advanced recurring configuration into a dedicated recurring detail sheet if the feature grows. */}
    </div>
  );
}
