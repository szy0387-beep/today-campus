import { BookOpen, CalendarDays, Compass, Sprout, Users } from "lucide-react";
import { cn } from "./ui.jsx";

const ICONS = {
  today: CalendarDays,
  discover: Compass,
  materials: BookOpen,
  community: Users,
  freshman: Sprout,
};

export default function BottomNav({ tabs, active, onChange }) {
  return (
    <nav className="border-t border-ink/8 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="grid grid-cols-5">
        {tabs.map((tab) => {
          const Icon = ICONS[tab.id] || CalendarDays;
          const isActive = tab.id === active;
          return (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className="flex w-full flex-col items-center gap-1 pb-2 pt-2.5 transition active:scale-95"
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className={cn("transition", isActive ? "text-brand" : "text-ink/40")}
                />
                <span
                  className={cn(
                    "text-[11px] leading-none transition",
                    isActive ? "font-semibold text-brand" : "text-ink/45"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
