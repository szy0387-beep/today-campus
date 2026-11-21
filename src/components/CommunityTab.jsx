import { useState } from "react";
import { Heart, MessageCircle, PenLine, ShieldCheck, Users } from "lucide-react";
import { communityCopy } from "../content.js";
import { cn } from "./ui.jsx";

export default function CommunityTab({ posts, onOpenPost, onCompose, onOpenMatch }) {
  const [segment, setSegment] = useState("senior");
  const visible = posts.filter((post) => post.category === segment);

  return (
    <div className="px-4 pb-6">
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold tracking-tight">{communityCopy.title}</h1>
          <p className="mt-1 text-[12.5px] leading-relaxed text-ink/55">
            {communityCopy.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCompose(segment)}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brand px-2.5 py-1.5 text-[12px] font-semibold text-white active:scale-95"
        >
          <PenLine size={13} /> {communityCopy.compose}
        </button>
      </div>

      <div className="mt-3 flex rounded-xl bg-ink/5 p-1">
        {communityCopy.segments.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSegment(item.id)}
            className={cn(
              "flex-1 rounded-lg py-1.5 text-[12.5px] font-medium transition",
              segment === item.id ? "bg-white text-ink shadow-sm" : "text-ink/50"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2.5">
        {visible.map((post) => (
          <article
            key={post.id}
            className="card-shadow rounded-2xl bg-white p-3.5 ring-1 ring-ink/5"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-soft text-[13px] font-semibold text-brand">
                {post.avatar}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold">{post.author}</p>
                <p className="text-[11px] text-ink/40">{post.time}</p>
              </div>
              <div className="flex gap-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-ink/5 px-1.5 py-0.5 text-[10.5px] text-ink/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink/80">{post.content}</p>

            <div className="mt-2.5 flex items-center gap-3 border-t border-ink/5 pt-2.5 text-[11.5px] text-ink/45">
              <button
                type="button"
                onClick={() => onOpenPost(post)}
                className="inline-flex items-center gap-1 active:scale-95"
              >
                <MessageCircle size={13} /> {post.replies} {communityCopy.replies}
              </button>
              <button
                type="button"
                onClick={() => onOpenPost(post)}
                className="ml-auto rounded-lg bg-ink px-2.5 py-1.5 text-[11.5px] font-medium text-white active:scale-95"
              >
                {communityCopy.contact}
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 p-4 ring-1 ring-rose-200/60">
        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-rose-900">
          <Heart size={14} /> {communityCopy.datingTitle}
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-rose-900/70">
          {communityCopy.datingBody}
        </p>
        <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-white/70 px-2.5 py-2 text-[11px] leading-relaxed text-rose-900/60">
          <ShieldCheck size={13} className="mt-0.5 shrink-0" />
          {communityCopy.datingSafety}
        </div>
        <button
          type="button"
          onClick={onOpenMatch}
          className="mt-2.5 w-full rounded-xl bg-rose-500 py-2.5 text-[13px] font-semibold text-white active:scale-[0.99]"
        >
          {communityCopy.datingButton}
        </button>
      </section>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-ink/35">
        <Users size={12} /> 演示帖子与匹配资料均为虚构，不会上传。
      </p>
    </div>
  );
}
