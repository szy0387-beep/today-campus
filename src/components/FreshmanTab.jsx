import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Library,
  Mail,
  Users,
} from "lucide-react";
import { freshmanCopy } from "../content.js";
import { formatEventWhen } from "../lib/time.js";
import { cn, SectionHead } from "./ui.jsx";

const SYSTEM_ICONS = {
  GraduationCap,
  BookOpen,
  Mail,
  Library,
  ClipboardList,
  CreditCard,
};

export default function FreshmanTab({ events, onOpenEvent, onGoMaterials, onToast }) {
  const [checklist, setChecklist] = useState(freshmanCopy.checklist);
  const [openFaq, setOpenFaq] = useState(0);

  const freshEvents = events.filter((event) => event.freshmanFriendly);
  const doneCount = checklist.filter((item) => item.done).length;

  const toggle = (index) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, done: !item.done } : item))
    );
  };

  return (
    <div className="px-4 pb-6">
      <div className="mt-4">
        <h1 className="text-[20px] font-semibold tracking-tight">{freshmanCopy.title}</h1>
        <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">
          {freshmanCopy.subtitle}
        </p>
      </div>

      <section className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-ink/5">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-semibold">{freshmanCopy.checklistTitle}</h2>
          <span className="text-[11.5px] text-ink/45">
            {doneCount} / {checklist.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
          <div
            className="h-full rounded-full bg-brand transition-all"
            style={{ width: `${(doneCount / checklist.length) * 100}%` }}
          />
        </div>
        <ul className="mt-3 space-y-1">
          {checklist.map((item, index) => (
            <li key={item.text}>
              <button
                type="button"
                onClick={() => toggle(index)}
                className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-left active:scale-[0.995]"
              >
                {item.done ? (
                  <CheckCircle2 size={16} className="shrink-0 text-brand" />
                ) : (
                  <Circle size={16} className="shrink-0 text-ink/25" />
                )}
                <span
                  className={cn(
                    "text-[13px]",
                    item.done ? "text-ink/40 line-through" : "text-ink/75"
                  )}
                >
                  {item.text}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <SectionHead title={freshmanCopy.faqTitle} />
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5">
          {freshmanCopy.faqs.map((faq, index) => {
            const open = openFaq === index;
            return (
              <div key={faq.q} className="border-b border-ink/5 last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? -1 : index)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-2 px-3.5 py-3 text-left"
                >
                  <span className="flex-1 text-[13px] font-medium">{faq.q}</span>
                  <ChevronDown
                    size={15}
                    className={cn(
                      "shrink-0 text-ink/35 transition-transform",
                      open && "rotate-180"
                    )}
                  />
                </button>
                {open ? (
                  <p className="px-3.5 pb-3 text-[12.5px] leading-relaxed text-ink/60">
                    {faq.a}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11px] text-ink/35">{freshmanCopy.faqNote}</p>
      </section>

      <section className="mt-5">
        <SectionHead title={freshmanCopy.stepsTitle} />
        <ol className="space-y-2">
          {freshmanCopy.steps.map((step, index) => (
            <li key={step.title} className="flex gap-3 rounded-xl bg-white p-3 ring-1 ring-ink/5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[11.5px] font-semibold text-brand">
                {index + 1}
              </span>
              <div>
                <p className="text-[13px] font-medium">{step.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-ink/55">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-5">
        <SectionHead title={freshmanCopy.systemsTitle} />
        <div className="grid grid-cols-2 gap-2">
          {freshmanCopy.systems.map((system) => {
            const Icon = SYSTEM_ICONS[system.icon] || BookOpen;
            return (
              <button
                key={system.name}
                type="button"
                onClick={() => onToast(`${system.name}：示例入口，正式版接学校系统`)}
                className="flex items-center gap-2.5 rounded-xl bg-white p-3 text-left ring-1 ring-ink/5 active:scale-[0.98]"
              >
                <span className="rounded-lg bg-ink/5 p-1.5 text-ink/60">
                  <Icon size={15} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium">{system.name}</span>
                  <span className="block truncate text-[10.5px] text-ink/45">{system.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11px] text-ink/35">{freshmanCopy.systemNote}</p>
      </section>

      <section className="mt-5">
        <SectionHead title={freshmanCopy.eventsTitle} />
        <div className="space-y-2">
          {freshEvents.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => onOpenEvent(event.id)}
              className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left ring-1 ring-ink/5 active:scale-[0.995]"
            >
              <span className="text-xl">{event.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{event.title}</span>
                <span className="block text-[11px] text-ink/45">
                  {formatEventWhen(event.start, event.end)} · {event.location}
                </span>
              </span>
              <Users size={14} className="shrink-0 text-ink/25" />
            </button>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl bg-brand px-4 py-4 text-white">
        <h2 className="text-[14px] font-semibold">{freshmanCopy.resourcesTitle}</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-white/75">
          {freshmanCopy.resourcesBody}
        </p>
        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            onClick={onGoMaterials}
            className="rounded-lg bg-white px-3 py-2 text-[12px] font-semibold text-brand active:scale-95"
          >
            {freshmanCopy.resourcesButton}
          </button>
          <button
            type="button"
            onClick={() => onToast("新生群：示例入口，不会真的加群")}
            className="rounded-lg bg-white/15 px-3 py-2 text-[12px] font-medium text-white active:scale-95"
          >
            {freshmanCopy.groupButton}
          </button>
        </div>
      </section>
    </div>
  );
}
