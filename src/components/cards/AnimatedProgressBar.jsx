export function AnimatedProgressBar({ className = '', percentage, shouldPulse = false }) {
  const width = `${Math.min(100, Math.max(4, percentage))}%`;

  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${
          shouldPulse ? 'animate-soft-pulse' : ''
        } ${className}`}
        style={{ width }}
      />
    </div>
  );
}
