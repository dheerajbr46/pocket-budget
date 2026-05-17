export const transitionPresets = {
  base: 'transition duration-200 ease-out motion-reduce:transition-none',
  soft: 'transition-all duration-300 ease-out motion-reduce:transition-none',
  sheet: 'transition-all duration-300 ease-out motion-reduce:transition-none'
};

export const pressableStyles = `${transitionPresets.base} hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100`;

export const motionVariants = {
  fadeSlideIn: 'animate-soft-slide-in motion-reduce:animate-none'
};

// TODO: Add transition presets for PWA/native migration and haptic feedback for the native app shell.
// TODO: Add animated category icons once icon states carry richer transaction context.
