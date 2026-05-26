import { AnimatedProgressBar } from './AnimatedProgressBar.jsx';

export function GoalProgressBar({ percentage, status }) {
  const colorClass =
    status === 'completed'
      ? 'bg-mint'
      : status === 'behind'
        ? 'bg-amber-400'
        : 'bg-ink';

  return (
    <AnimatedProgressBar
      className={colorClass}
      percentage={percentage}
      shouldPulse={status === 'behind'}
    />
  );
}
