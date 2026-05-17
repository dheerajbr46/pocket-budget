import { motion, useReducedMotion } from 'framer-motion';

export function Button({ children, className = '', type = 'button', ...props }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.button
      type={type}
      className={className}
      whileHover={shouldReduce ? undefined : { y: -2 }}
      whileTap={shouldReduce ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
