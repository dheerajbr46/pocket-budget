import { useEffect, useState } from 'react';
import { transitionPresets } from '../../constants/motion.js';

export function BottomSheet({ children, isOpen, onClose, title }) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    setIsVisible(false);
    const timeoutId = window.setTimeout(() => setIsMounted(false), 260);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-3">
      <button
        type="button"
        aria-label="Close bottom sheet"
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] ${transitionPresets.sheet} ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <section
        className={`relative w-full max-w-[430px] rounded-[32px] border border-white bg-white p-5 shadow-soft ${transitionPresets.sheet} ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-[0.98] opacity-0'
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
        {title ? <h2 className="text-xl font-bold">{title}</h2> : null}
        {children}
      </section>

      {/* Future extension: haptic feedback can fire when the sheet opens, saves, or closes. */}
      {/* TODO: Add swipe gestures for dismissing sheets in the native/PWA shell. */}
    </div>
  );
}
