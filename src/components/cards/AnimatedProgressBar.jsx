import { motion } from 'framer-motion';

export function AnimatedProgressBar({ className = '', percentage, shouldPulse = false }) {
  const targetWidth = `${Math.min(100, Math.max(4, percentage))}%`;

  return (
    <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100/80">
      <motion.div
        className={`h-full rounded-full ${className}`}
        initial={{ width: 0 }}
        animate={{ width: targetWidth }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      />
      {shouldPulse && (
        <div className="animate-shimmer absolute inset-0 rounded-full" />
      )}
    </div>
  );
}
