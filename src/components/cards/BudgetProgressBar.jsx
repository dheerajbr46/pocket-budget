import { AnimatedProgressBar } from './AnimatedProgressBar.jsx';

export function BudgetProgressBar({ percentage, status }) {
  const statusClasses = {
    critical: 'bg-coral',
    exceeded: 'bg-coral',
    healthy: 'bg-mint',
    warning: 'bg-amber-400'
  };

  return (
    <AnimatedProgressBar
      className={statusClasses[status] ?? statusClasses.healthy}
      percentage={percentage}
      shouldPulse={status === 'critical' || status === 'exceeded'}
    />
  );
}
