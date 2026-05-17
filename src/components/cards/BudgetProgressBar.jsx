import { AnimatedProgressBar } from './AnimatedProgressBar.jsx';

export function BudgetProgressBar({ percentage, status }) {
  const statusGradients = {
    critical: 'bg-gradient-coral',
    exceeded: 'bg-gradient-coral',
    healthy: 'bg-gradient-indigo',
    warning: 'bg-gradient-to-r from-amber-400 to-orange-400'
  };

  return (
    <AnimatedProgressBar
      className={statusGradients[status] ?? statusGradients.healthy}
      percentage={percentage}
      shouldPulse={status === 'critical' || status === 'exceeded'}
    />
  );
}
