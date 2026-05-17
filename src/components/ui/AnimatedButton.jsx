import { pressableStyles } from '../../constants/motion.js';

export function AnimatedButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`${pressableStyles} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
