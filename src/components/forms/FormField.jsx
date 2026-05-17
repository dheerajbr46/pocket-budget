export function FormField({ children, error, icon: Icon, label }) {
  return (
    <div>
      <label className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
        error ? 'bg-rose-50 ring-1 ring-rose-200' : 'bg-slate-50'
      }`}>
        {Icon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-500 shadow-sm">
            <Icon size={18} />
          </span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
          <span className="mt-1 block">{children}</span>
        </span>
      </label>
      {error ? <p className="mt-2 px-2 text-sm font-semibold text-coral">{error}</p> : null}
    </div>
  );
}
