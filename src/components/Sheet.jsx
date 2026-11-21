import { useEffect } from "react";
import { X } from "lucide-react";

export default function Sheet({ open, onClose, title, subtitle, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="关闭"
        onClick={onClose}
        className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="sheet-enter relative flex max-h-[88%] flex-col overflow-hidden rounded-t-3xl bg-paper shadow-[0_-12px_40px_-12px_rgba(28,25,23,0.3)]"
      >
        <div className="flex items-start justify-between gap-3 border-b border-ink/5 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold leading-tight">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 text-[12px] text-ink/50">{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 shrink-0 rounded-full p-1.5 text-ink/45 transition hover:bg-ink/5"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">{children}</div>
        {footer ? (
          <div className="border-t border-ink/5 bg-paper/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
