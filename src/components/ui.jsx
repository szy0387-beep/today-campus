export function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

// 封面用内联渐变，避免 Tailwind 动态类名被 purge 掉。
export const COVER_STYLES = {
  teal: "linear-gradient(135deg,#0f766e,#2dd4bf)",
  indigo: "linear-gradient(135deg,#3730a3,#818cf8)",
  amber: "linear-gradient(135deg,#b45309,#fbbf24)",
  rose: "linear-gradient(135deg,#9f1239,#fb7185)",
  orange: "linear-gradient(135deg,#c2410c,#fb923c)",
  sky: "linear-gradient(135deg,#0369a1,#38bdf8)",
  violet: "linear-gradient(135deg,#6d28d9,#c4b5fd)",
  emerald: "linear-gradient(135deg,#047857,#34d399)",
  stone: "linear-gradient(135deg,#44403c,#a8a29e)",
};

export function coverStyle(theme) {
  return { backgroundImage: COVER_STYLES[theme] || COVER_STYLES.teal };
}

export function Chip({ active, onClick, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium transition active:scale-95",
        active
          ? "bg-brand text-white shadow-sm"
          : "bg-white text-ink/70 ring-1 ring-ink/10 hover:text-ink",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SectionHead({ title, action }) {
  return (
    <div className="mb-2 flex items-end justify-between">
      <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      {action}
    </div>
  );
}

export function SourceBadge({ event }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-0.5 text-[11px] text-ink/60">
      {event.source} · {event.sourceName}
    </span>
  );
}

export function Empty({ title, body, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 px-4 py-8 text-center">
      <p className="text-sm font-medium">{title}</p>
      {body ? <p className="mt-1 text-[13px] text-ink/55">{body}</p> : null}
      {action}
    </div>
  );
}

export function PrimaryButton({ className, children, ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.99] disabled:opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({ className, children, ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-medium text-ink/65 ring-1 ring-ink/10 transition active:scale-[0.99] hover:text-ink",
        className
      )}
    >
      {children}
    </button>
  );
}
