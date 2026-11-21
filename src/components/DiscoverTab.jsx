import { Check, ClipboardPaste, EyeOff, SlidersHorizontal, Plus } from "lucide-react";
import { discoverCopy, interests, interestLabel } from "../content.js";
import { formatDeadline } from "../lib/time.js";
import { Chip, coverStyle, Empty, SectionHead } from "./ui.jsx";

function ReasonChips({ reasons }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {reasons.map((reason) => (
        <span
          key={reason}
          className="rounded-md bg-brand-soft/70 px-1.5 py-0.5 text-[11px] text-brand"
        >
          {reason}
        </span>
      ))}
    </div>
  );
}

function EventCard({ event, saved, onOpen, onAdd, onHide }) {
  return (
    <article className="card-shadow overflow-hidden rounded-2xl bg-white ring-1 ring-ink/5">
      <button type="button" onClick={() => onOpen(event.id)} className="block w-full text-left">
        <div
          className="relative flex h-[86px] items-end justify-between px-4 pb-2.5"
          style={coverStyle(event.theme)}
        >
          <span className="text-3xl drop-shadow-sm">{event.emoji}</span>
          <span className="rounded-full bg-black/25 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur">
            {event.source} · 示例
          </span>
        </div>
        <div className="px-4 pt-3">
          <h3 className="text-[15px] font-semibold leading-snug">{event.title}</h3>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-ink/55">
            {event.summary}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-ink/50">
            <span>{event.sourceName}</span>
            <span className="text-ink/25">·</span>
            <span className="font-medium text-accent">{formatDeadline(event.deadline)}</span>
          </div>
          <div className="mt-2">
            <ReasonChips reasons={event.reasons} />
          </div>
        </div>
      </button>
      <div className="mt-3 flex items-center gap-2 border-t border-ink/5 px-4 py-2.5">
        {saved ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-brand-soft px-2.5 py-1.5 text-[12px] font-medium text-brand">
            <Check size={13} /> {discoverCopy.added}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onAdd(event.id)}
            className="inline-flex items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-[12px] font-semibold text-white active:scale-95"
          >
            <Plus size={13} /> {discoverCopy.add}
          </button>
        )}
        <button
          type="button"
          onClick={() => onHide(event.id)}
          className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[12px] text-ink/45 active:scale-95"
        >
          <EyeOff size={13} /> {discoverCopy.hide}
        </button>
      </div>
    </article>
  );
}

export default function DiscoverTab({
  events,
  profile,
  onToggleInterest,
  onOpen,
  onAdd,
  onHide,
  onOpenProfile,
  onOpenParse,
  savedIds,
}) {
  return (
    <div className="px-4 pb-6">
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight">{discoverCopy.title}</h1>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">
            {discoverCopy.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenProfile}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-[12px] font-medium text-ink/65 ring-1 ring-ink/10 active:scale-95"
        >
          <SlidersHorizontal size={13} /> {discoverCopy.adjust}
        </button>
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {interests.map((interest) => (
          <Chip
            key={interest.id}
            active={profile.interests.includes(interest.id)}
            onClick={() => onToggleInterest(interest.id)}
          >
            <span className="mr-1">{interest.emoji}</span>
            {interest.label}
          </Chip>
        ))}
      </div>

      <p className="mt-2 text-[11px] text-ink/40">
        已选 {profile.interests.length} 个兴趣
        {profile.interests.length
          ? `：${profile.interests.map((id) => interestLabel[id]).join("、")}`
          : "。可以先直接浏览。"}
      </p>

      <div className="mt-4 space-y-3">
        {events.length === 0 ? (
          <Empty
            title={discoverCopy.empty}
            body={discoverCopy.emptyBody}
            action={
              <button
                type="button"
                onClick={onOpenProfile}
                className="mt-3 inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-2 text-[13px] font-medium text-white"
              >
                {discoverCopy.adjust}
              </button>
            }
          />
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              saved={savedIds.includes(event.id)}
              onOpen={onOpen}
              onAdd={onAdd}
              onHide={onHide}
            />
          ))
        )}
      </div>

      <section className="mt-5">
        <SectionHead title={discoverCopy.parse} />
        <button
          type="button"
          onClick={onOpenParse}
          className="flex w-full items-start gap-3 rounded-2xl border border-dashed border-ink/15 bg-white/70 px-4 py-3 text-left transition active:scale-[0.995]"
        >
          <span className="mt-0.5 rounded-lg bg-brand-soft p-1.5 text-brand">
            <ClipboardPaste size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13px] font-medium">粘贴公众号 / 邮件通知</span>
            <span className="mt-0.5 block text-[11.5px] leading-relaxed text-ink/50">
              {discoverCopy.parseHint}
            </span>
          </span>
        </button>
      </section>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-ink/35">
        活动均标注为示例，不表示已接入真实邮件、公众号或教务系统。
      </p>
    </div>
  );
}
