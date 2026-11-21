import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Sparkles,
} from "lucide-react";
import { todayCopy } from "../content.js";
import { demoNow, formatDate, formatDeadline, formatTime } from "../lib/time.js";
import { itemStatus } from "../lib/today.js";
import { cn, Empty, SectionHead } from "./ui.jsx";

const KIND_META = {
  course: { label: "课程", color: "#0f766e", Icon: BookOpen },
  event: { label: "活动", color: "#7c3aed", Icon: Sparkles },
  deadline: { label: "报名截止", color: "#b45309", Icon: CalendarClock },
  todo: { label: "待办", color: "#0369a1", Icon: CheckCircle2 },
};

const STATUS_TEXT = {
  ongoing: "进行中",
  past: "已结束",
  done: "已完成",
  upcoming: "待开始",
};

function StatusPill({ status }) {
  const style =
    status === "ongoing"
      ? "bg-brand-soft text-brand"
      : status === "past" || status === "done"
        ? "bg-ink/5 text-ink/40"
        : "bg-ink/5 text-ink/55";
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", style)}>
      {STATUS_TEXT[status]}
    </span>
  );
}

function UrgentCard({ item, onOpen }) {
  if (!item) return null;
  const meta = KIND_META[item.kind] || KIND_META.todo;
  const status = itemStatus(item);
  const clickable = Boolean(item.eventId);

  return (
    <button
      type="button"
      onClick={clickable ? () => onOpen(item.eventId) : undefined}
      className="card-shadow mt-4 w-full rounded-2xl bg-white p-4 text-left ring-1 ring-ink/5 transition active:scale-[0.995]"
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        {todayCopy.urgent}
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold leading-snug">{item.title}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-ink/55">
            <span className="tabular-nums font-medium text-ink/70">
              {formatTime(item.at)}
            </span>
            {item.location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} /> {item.location}
              </span>
            ) : null}
            {item.kind === "deadline" ? <span>{formatDeadline(item.at)}</span> : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <StatusPill status={status} />
          {clickable ? <ChevronRight size={16} className="text-ink/30" /> : null}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-ink/45">
        <meta.Icon size={12} />
        {meta.label}
        {item.subtitle ? <span className="text-ink/30">·</span> : null}
        {item.subtitle ? <span className="truncate">{item.subtitle}</span> : null}
      </div>
    </button>
  );
}

function TimelineRow({ item, onOpen }) {
  const meta = KIND_META[item.kind] || KIND_META.todo;
  const status = itemStatus(item);
  const clickable = Boolean(item.eventId);
  const dim = status === "past" || status === "done";

  return (
    <li className="flex gap-3">
      <div
        className={cn(
          "w-11 shrink-0 pt-1 text-right text-[12px] tabular-nums",
          dim ? "text-ink/30" : "font-semibold text-ink/70"
        )}
      >
        {formatTime(item.at)}
      </div>
      <div className="relative flex-1 border-l border-ink/10 pb-3.5 pl-4">
        <span
          className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-2 ring-paper"
          style={{ backgroundColor: dim ? "#d6d3d1" : meta.color }}
        />
        <button
          type="button"
          onClick={clickable ? () => onOpen(item.eventId) : undefined}
          className={cn(
            "w-full rounded-xl px-3 py-2.5 text-left transition",
            clickable ? "bg-white ring-1 ring-ink/5 active:scale-[0.995]" : "bg-white/55",
            dim && "opacity-60"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "text-[14px] leading-snug",
                item.done ? "line-through" : "font-medium"
              )}
            >
              {item.title}
            </p>
            {status === "ongoing" ? <StatusPill status={status} /> : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink/45">
            <span className="inline-flex items-center gap-1">
              <meta.Icon size={11} /> {meta.label}
            </span>
            {item.location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} /> {item.location}
              </span>
            ) : null}
            {item.kind === "deadline" ? <span>{formatDeadline(item.at)}</span> : null}
            {item.kind === "todo" && item.done ? <span>已完成</span> : null}
          </div>
        </button>
      </div>
    </li>
  );
}

export default function TodayTab({
  today,
  urgent,
  deadlines,
  onOpenEvent,
  onAddEvent,
  onGoDiscover,
}) {
  const now = demoNow();
  const openCount = today.items.filter(
    (item) => !item.done && itemStatus(item, now) !== "past"
  ).length;
  const pending = deadlines.filter((event) => !event.saved);

  return (
    <div className="px-4 pb-6">
      <section className="relative mt-3 overflow-hidden rounded-[26px] bg-brand px-5 pb-5 pt-5 text-white">
        <div
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full opacity-25"
          style={{ background: "radial-gradient(circle,#5eead4,transparent 70%)" }}
        />
        <div className="flex items-center justify-between text-[12px] text-white/70">
          <span>{formatDate(now)}</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5">演示时钟 {formatTime(now)}</span>
        </div>
        <h1 className="mt-2 text-[22px] font-semibold leading-tight">{todayCopy.greeting}</h1>
        <div className="mt-4 flex gap-2 text-[11px]">
          <span className="rounded-lg bg-white/12 px-2.5 py-1.5">
            {openCount} 件安排
          </span>
          <span className="rounded-lg bg-white/12 px-2.5 py-1.5">
            {pending.length} 个截止待决定
          </span>
          <span
            className={cn(
              "rounded-lg px-2.5 py-1.5",
              today.conflicts.length ? "bg-amber-300 text-amber-950" : "bg-white/12"
            )}
          >
            {today.conflicts.length} 个冲突
          </span>
        </div>
      </section>

      <UrgentCard item={urgent} onOpen={onOpenEvent} />

      {today.conflicts.length > 0 ? (
        <section className="mt-3 rounded-2xl border border-amber-300/70 bg-amber-50 px-4 py-3">
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-amber-900">
            <AlertTriangle size={14} /> {todayCopy.conflict}
          </div>
          <ul className="mt-1.5 space-y-1 text-[12px] leading-relaxed text-amber-900/80">
            {today.conflicts.map((conflict) => (
              <li key={`${conflict.a.id}-${conflict.b.id}`}>
                {formatTime(conflict.a.start)}–{formatTime(conflict.a.end)} 「{conflict.a.title}」
                与 {formatTime(conflict.b.start)}–{formatTime(conflict.b.end)} 「
                {conflict.b.title}」重叠 {conflict.minutes} 分钟。
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-[11px] text-amber-900/60">{todayCopy.conflictAdvice}</p>
        </section>
      ) : null}

      <section className="mt-5">
        <SectionHead title={todayCopy.timeline} />
        {today.items.length === 0 ? (
          <Empty
            title={todayCopy.emptyTimeline}
            body={todayCopy.emptyTimelineBody}
            action={
              <button
                type="button"
                onClick={onGoDiscover}
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-[13px] font-medium text-white"
              >
                去发现 <ArrowRight size={13} />
              </button>
            }
          />
        ) : (
          <ul>
            {today.items.map((item) => (
              <TimelineRow key={item.id} item={item} onOpen={onOpenEvent} />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-3">
        <SectionHead title={todayCopy.deadlines} />
        <div className="space-y-2">
          {pending.length === 0 ? (
            <p className="rounded-xl bg-white/60 px-3 py-3 text-[12px] text-ink/45">
              今天没有还没决定的报名截止。
            </p>
          ) : (
            pending.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-xl bg-white px-3 py-2.5 ring-1 ring-ink/5"
              >
                <span className="text-lg">{event.emoji}</span>
                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => onOpenEvent(event.id)}
                    className="block w-full truncate text-left text-[13px] font-medium"
                  >
                    {event.title}
                  </button>
                  <p className="text-[11px] text-ink/50">{formatDeadline(event.deadline)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddEvent(event.id)}
                  className="shrink-0 rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-medium text-white active:scale-95"
                >
                  加入今日
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <button
        type="button"
        onClick={onGoDiscover}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink/15 py-3 text-[13px] font-medium text-ink/55 transition active:scale-[0.995]"
      >
        {todayCopy.addMore} <ArrowRight size={14} />
      </button>
    </div>
  );
}
