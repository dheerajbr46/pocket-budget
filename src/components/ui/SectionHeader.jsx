export function SectionHeader({ action, eyebrow, title }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{eyebrow}</p>
        ) : null}
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {action}
    </div>
  );
}
