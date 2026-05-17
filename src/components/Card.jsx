export function Card({ children, className = '' }) {
  const backgroundClass = className.includes('bg-') ? '' : 'bg-white';

  return (
    <section className={`rounded-[26px] border border-white p-5 shadow-sm ${backgroundClass} ${className}`}>
      {children}
    </section>
  );
}
