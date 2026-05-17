import { useEffect, useState } from 'react';

export function AnimatedProgressBar({ className = '', percentage, shouldPulse = false }) {
  const [animWidth, setAnimWidth] = useState('0%');
  const targetWidth = `${Math.min(100, Math.max(4, percentage))}%`;

  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimWidth(targetWidth)));
    return () => cancelAnimationFrame(id);
  }, [targetWidth]);

  return (
    <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100/80">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${className}`}
        style={{ width: animWidth }}
      />
      {shouldPulse && (
        <div className="animate-shimmer absolute inset-0 rounded-full" />
      )}
    </div>
  );
}
