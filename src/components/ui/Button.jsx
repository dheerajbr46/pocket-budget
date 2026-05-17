import { pressableStyles } from '../../constants/motion.js';

export function Button({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`${pressableStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
