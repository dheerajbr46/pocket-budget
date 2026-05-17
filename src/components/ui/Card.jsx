import { transitionPresets } from '../../constants/motion.js';

export function Card({ children, className = '' }) {
  const backgroundClass = className.includes('bg-') ? '' : 'bg-white';

  return (
    <section className={`rounded-[22px] p-5 shadow-card ${transitionPresets.base} ${backgroundClass} ${className}`}>
      {children}
    </section>
  );
}
