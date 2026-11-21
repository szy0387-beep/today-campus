import { useEffect, useRef, useState } from "react";
import {
  Bot,
  BadgeCheck,
  Check,
  ExternalLink,
  EyeOff,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
} from "lucide-react";
import {
  communityCopy,
  discoverCopy,
  interestLabel,
  interests,
  materialsCopy,
  profileCopy,
} from "../content.js";
import { explainRecommendation, parseEventNotice, summarizeMaterial } from "../lib/ai.js";
import { demoNow, formatDeadline, formatEventWhen, formatTime } from "../lib/time.js";
import { matchProfiles } from "../data/mock.js";
import Sheet from "./Sheet.jsx";
import { Chip, cn, coverStyle, GhostButton, PrimaryButton } from "./ui.jsx";

const TAG_THEME = {
  academic: "emerald",
  tech: "teal",
  startup: "violet",
  arts: "rose",
  sports: "orange",
  volunteer: "amber",
  career: "sky",
};

function themeForTags(tags = []) {
  return TAG_THEME[tags[0]] || "stone";
}

/* ------------------------------- 活动详情 ------------------------------- */

export function EventSheet({ event, open, onClose, saved, onAdd, onHide, onToast, profile }) {
  const [explain, setExplain] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setExplain(null);
    setLoading(false);
  }, [event?.id, open]);

  if (!event) return null;

  const isExample = String(event.signupUrl || "").includes("example.com");

  const runExplain = async () => {
    setLoading(true);
    const result = await explainRecommendation(event, profile);
    setExplain(result);
    setLoading(false);
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={discoverCopy.detail}
      subtitle={`${event.source} · ${event.sourceName}`}
      footer={
        saved ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-brand-soft py-3 text-[13px] font-semibold text-brand">
              <Check size={15} /> {discoverCopy.added}
            </span>
            <GhostButton onClick={() => onToast("已加入今日，可在「今日」调整")}>
              去今日看
            </GhostButton>
          </div>
        ) : (
          <PrimaryButton onClick={() => onAdd(event.id)}>
            <Plus size={15} /> {discoverCopy.add}
          </PrimaryButton>
        )
      }
    >
      <div
        className="-mx-4 -mt-4 flex h-28 items-end justify-between px-4 pb-3"
        style={coverStyle(event.theme)}
      >
        <span className="text-4xl drop-shadow">{event.emoji}</span>
        <span className="rounded-full bg-black/25 px-2 py-0.5 text-[11px] text-white/90 backdrop-blur">
          示例活动
        </span>
      </div>

      <h3 className="mt-3 text-[18px] font-semibold leading-snug">{event.title}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink/60">{event.summary}</p>

      <dl className="mt-3 space-y-1.5 rounded-xl bg-white p-3 text-[12.5px] ring-1 ring-ink/5">
        <div className="flex gap-2">
          <dt className="w-12 shrink-0 text-ink/40">时间</dt>
          <dd className="font-medium">{formatEventWhen(event.start, event.end)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-12 shrink-0 text-ink/40">地点</dt>
          <dd className="inline-flex items-center gap-1 font-medium">
            <MapPin size={12} className="text-ink/40" /> {event.location}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-12 shrink-0 text-ink/40">截止</dt>
          <dd className="font-medium text-accent">{formatDeadline(event.deadline)}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {event.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-ink/5 px-1.5 py-0.5 text-[11px] text-ink/55">
            {interestLabel[tag] || tag}
          </span>
        ))}
      </div>

      <p className="mt-3 text-[13px] leading-relaxed text-ink/70">{event.description}</p>

      <div className="mt-3 rounded-xl bg-white/70 p-3 ring-1 ring-ink/5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/35">
          通知原文（示例）
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-ink/55">{event.sourceSnippet}</p>
      </div>

      <div className="mt-3 rounded-xl bg-brand-soft/50 p-3">
        <div className="flex items-center justify-between">
          <p className="inline-flex items-center gap-1 text-[12px] font-semibold text-brand">
            <Sparkles size={13} /> {discoverCopy.why}
          </p>
          <button
            type="button"
            onClick={runExplain}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-medium text-brand disabled:opacity-60"
          >
            {loading ? <Loader2 size={11} className="animate-spin" /> : <Bot size={11} />}
            {loading ? "生成中" : "让 AI 说一句"}
          </button>
        </div>
        <ul className="mt-1.5 space-y-1">
          {(event.reasons || ["来自校园活动库"]).map((reason) => (
            <li key={reason} className="text-[12px] leading-relaxed text-brand/90">
              · {reason}
            </li>
          ))}
        </ul>
        {explain ? (
          <p className="mt-2 border-t border-brand/15 pt-2 text-[12px] leading-relaxed text-ink/70">
            {explain.text}
            <span className="ml-1 text-[10.5px] text-ink/35">（{explain.source}）</span>
          </p>
        ) : null}
      </div>

      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={() => {
            if (isExample) onToast("示例报名入口：正式版接学校官方系统");
            else window.open(event.signupUrl, "_blank", "noopener,noreferrer");
          }}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink py-3 text-[13px] font-semibold text-white active:scale-[0.99]"
        >
          <ExternalLink size={14} /> {discoverCopy.official}
        </button>
        <button
          type="button"
          onClick={() => onHide(event.id)}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] text-ink/45 active:scale-[0.99]"
        >
          <EyeOff size={14} /> {discoverCopy.hide}
        </button>
      </div>
    </Sheet>
  );
}

/* ------------------------------- 资料详情 ------------------------------- */

export function MaterialSheet({ material, open, onClose, initialAi }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setSummary(null);
    setShowAnswer(false);
    if (open && material && initialAi) runAi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, material?.id]);

  if (!material) return null;

  async function runAi() {
    setLoading(true);
    const result = await summarizeMaterial(material);
    setSummary(result);
    setLoading(false);
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={material.title}
      subtitle={`${material.subject} · ${material.type} · ${material.author}`}
    >
      <div className="flex items-center gap-1.5">
        {material.verified ? (
          <span className="inline-flex items-center gap-0.5 rounded bg-brand-soft px-1.5 py-0.5 text-[10.5px] font-medium text-brand">
            <BadgeCheck size={11} /> {materialsCopy.verified}
          </span>
        ) : (
          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10.5px] text-accent">
            {materialsCopy.pending}
          </span>
        )}
        <span className="text-[11px] text-ink/40">更新于 {material.updated}</span>
      </div>

      <div className="mt-3 space-y-2 rounded-xl bg-white p-3.5 ring-1 ring-ink/5">
        {String(material.content)
          .split("\n")
          .filter(Boolean)
          .map((line) => (
            <p key={line} className="text-[13px] leading-relaxed text-ink/75">
              {line}
            </p>
          ))}
      </div>

      <button
        type="button"
        onClick={runAi}
        disabled={loading}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink py-3 text-[13px] font-semibold text-white active:scale-[0.99] disabled:opacity-60"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Bot size={14} />}
        {loading ? "整理中…" : materialsCopy.aiButton}
      </button>

      {summary ? (
        <section className="mt-3 rounded-xl bg-brand-soft/50 p-3.5">
          <p className="text-[11.5px] font-semibold text-brand">
            {materialsCopy.aiSummary}
            <span className="ml-1 font-normal text-brand/60">（{summary.source}）</span>
          </p>
          <ul className="mt-1.5 space-y-1">
            {summary.points.map((point) => (
              <li key={point} className="text-[12.5px] leading-relaxed text-ink/75">
                · {point}
              </li>
            ))}
          </ul>

          <div className="mt-3 rounded-lg bg-white p-3">
            <p className="text-[11.5px] font-semibold text-ink/50">自测一题</p>
            <p className="mt-1 text-[13px] font-medium leading-snug">{summary.question.stem}</p>
            <ul className="mt-2 space-y-1">
              {summary.question.options.map((option) => (
                <li
                  key={option}
                  className={cn(
                    "rounded-lg px-2 py-1.5 text-[12.5px] ring-1",
                    showAnswer && option === summary.question.answer
                      ? "bg-brand-soft text-brand ring-brand/30"
                      : "bg-paper/60 text-ink/70 ring-ink/5"
                  )}
                >
                  {option}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setShowAnswer((value) => !value)}
              className="mt-2 text-[12px] font-medium text-brand"
            >
              {showAnswer ? materialsCopy.hideAnswer : materialsCopy.answer}
            </button>
            {showAnswer ? (
              <p className="mt-1.5 text-[12px] leading-relaxed text-ink/60">
                {summary.question.explanation}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <p className="mt-3 text-[11px] leading-relaxed text-ink/35">{materialsCopy.disclaimer}</p>
    </Sheet>
  );
}

/* ------------------------------- 兴趣设置 ------------------------------- */

export function ProfileSheet({ open, onClose, profile, onToggleInterest, onReset, savedCount }) {
  return (
    <Sheet open={open} onClose={onClose} title={profileCopy.title}>
      <p className="text-[12.5px] leading-relaxed text-ink/55">{profileCopy.body}</p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {interests.map((interest) => {
          const active = profile.interests.includes(interest.id);
          return (
            <button
              key={interest.id}
              type="button"
              onClick={() => onToggleInterest(interest.id)}
              aria-pressed={active}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] transition active:scale-[0.98]",
                active
                  ? "bg-brand text-white ring-1 ring-brand"
                  : "bg-white text-ink/70 ring-1 ring-ink/10"
              )}
            >
              <span>{interest.emoji}</span>
              <span className="flex-1 font-medium">{interest.label}</span>
              {active ? <Check size={14} /> : null}
            </button>
          );
        })}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white py-2.5 ring-1 ring-ink/5">
          <p className="text-[17px] font-semibold text-brand">{profile.interests.length}</p>
          <p className="text-[10.5px] text-ink/45">兴趣</p>
        </div>
        <div className="rounded-xl bg-white py-2.5 ring-1 ring-ink/5">
          <p className="text-[17px] font-semibold text-brand">{savedCount}</p>
          <p className="text-[10.5px] text-ink/45">{profileCopy.saved}</p>
        </div>
        <div className="rounded-xl bg-white py-2.5 ring-1 ring-ink/5">
          <p className="text-[17px] font-semibold text-brand">{profile.hiddenIds.length}</p>
          <p className="text-[10.5px] text-ink/45">{profileCopy.hidden}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-white/70 p-3 ring-1 ring-ink/5">
        <p className="text-[12.5px] font-semibold">{profileCopy.howTitle}</p>
        <p className="mt-1 text-[12px] leading-relaxed text-ink/55">{profileCopy.howBody}</p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12.5px] text-ink/50 ring-1 ring-ink/10 active:scale-[0.99]"
      >
        <RotateCcw size={13} /> {profileCopy.reset}
      </button>
      <p className="mt-2 text-[11px] leading-relaxed text-ink/35">{profileCopy.dataNote}</p>
    </Sheet>
  );
}

/* ------------------------------- 帖子详情 ------------------------------- */

export function PostSheet({ post, open, onClose, onToast }) {
  if (!post) return null;
  return (
    <Sheet open={open} onClose={onClose} title="帖子详情" subtitle={`${post.author} · ${post.time}`}>
      <p className="text-[14px] leading-relaxed text-ink/80">{post.content}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span key={tag} className="rounded bg-ink/5 px-1.5 py-0.5 text-[11px] text-ink/55">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-[12px] font-semibold text-ink/45">
          {post.replies} 条回复（{communityCopy.replyNote}）
        </p>
        <div className="rounded-xl bg-white p-3 text-[12.5px] leading-relaxed text-ink/60 ring-1 ring-ink/5">
          同学 A：我也在找这个，方便的话一起。
        </div>
        <div className="rounded-xl bg-white p-3 text-[12.5px] leading-relaxed text-ink/60 ring-1 ring-ink/5">
          同学 B：已私信，谢谢分享。
        </div>
      </div>

      <PrimaryButton className="mt-4" onClick={() => onToast("演示模式：不会真的发出私信")}>
        <Send size={14} /> {communityCopy.sayHi}
      </PrimaryButton>
      <p className="mt-2 text-center text-[11px] text-ink/35">{communityCopy.postNote}</p>
    </Sheet>
  );
}

/* ------------------------------- 发起招募 ------------------------------- */

export function ComposeSheet({ open, onClose, category, onPublish }) {
  const [text, setText] = useState("");
  const [value, setValue] = useState(category);

  useEffect(() => {
    if (open) setValue(category);
  }, [open, category]);

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={communityCopy.compose}
      footer={
        <PrimaryButton
          disabled={!text.trim()}
          onClick={() => {
            onPublish({ text: text.trim(), category: value });
            setText("");
          }}
        >
          <Send size={14} /> 发布
        </PrimaryButton>
      }
    >
      <div className="flex gap-2">
        {communityCopy.segments.map((item) => (
          <Chip key={item.id} active={value === item.id} onClick={() => setValue(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={5}
        placeholder="例如：数学建模国赛找队友，缺一个会写论文的人。"
        className="mt-3 w-full resize-none rounded-xl bg-white p-3 text-[13px] leading-relaxed ring-1 ring-ink/10 outline-none focus:ring-brand/40"
      />
      <p className="mt-2 text-[11px] text-ink/35">{communityCopy.postNote}</p>
    </Sheet>
  );
}

/* ------------------------------- 粘贴通知 ------------------------------- */

function draftToEvent(draft, rawText) {
  const now = demoNow();
  const dayOffset = draft.day === "明天" ? 1 : 0;
  const [sh, sm] = (draft.startTime || "14:00").split(":").map(Number);
  const start = new Date(now);
  start.setDate(start.getDate() + dayOffset);
  start.setHours(sh || 0, sm || 0, 0, 0);

  let end = null;
  if (draft.endTime) {
    const [eh, em] = draft.endTime.split(":").map(Number);
    end = new Date(start);
    end.setHours(eh || 0, em || 0, 0, 0);
    if (end <= start) end.setDate(end.getDate() + 1);
  }

  let deadline = null;
  if (draft.deadlineTime) {
    const [dh, dm] = draft.deadlineTime.split(":").map(Number);
    deadline = new Date(now);
    deadline.setHours(dh || 0, dm || 0, 0, 0);
  }

  return {
    id: `evt-parsed-${Date.now()}`,
    title: draft.title || "未命名活动",
    summary: `${draft.day || "今天"} ${draft.startTime || ""} · ${draft.location || "地点待确认"}`.trim(),
    tags: draft.tags?.length ? draft.tags : ["academic"],
    source: "粘贴通知",
    sourceName: "手动粘贴（示例）",
    start,
    end,
    deadline: deadline || start,
    location: draft.location || "地点待确认",
    signupUrl: "https://example.com/signup/parsed",
    theme: themeForTags(draft.tags),
    emoji: "📌",
    freshmanFriendly: false,
    description: draft.note || "由粘贴的通知解析得到，需人工核对。",
    sourceSnippet: rawText,
  };
}

export function ParseSheet({ open, onClose, onConfirm }) {
  const [text, setText] = useState(discoverCopy.parseExample);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setResult(null);
      setLoading(false);
    }
  }, [open]);

  const run = async () => {
    setLoading(true);
    const parsed = await parseEventNotice(text);
    setResult(parsed);
    setLoading(false);
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={discoverCopy.parse}
      footer={
        result ? (
          <PrimaryButton
            onClick={() => {
              onConfirm(draftToEvent(result.draft, text));
              setResult(null);
            }}
          >
            <Check size={15} /> {discoverCopy.parseConfirm}
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={run} disabled={loading || !text.trim()}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            {loading ? "解析中…" : discoverCopy.parseButton}
          </PrimaryButton>
        )
      }
    >
      <p className="text-[12px] leading-relaxed text-ink/55">{discoverCopy.parseHint}</p>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-none rounded-xl bg-white p-3 text-[12.5px] leading-relaxed ring-1 ring-ink/10 outline-none focus:ring-brand/40"
      />

      {result ? (
        <div className="mt-3 rounded-xl bg-white p-3 ring-1 ring-ink/5">
          <p className="text-[11.5px] font-semibold text-brand">{discoverCopy.parseResult}</p>
          <dl className="mt-2 space-y-1 text-[12.5px]">
            <div className="flex gap-2">
              <dt className="w-14 shrink-0 text-ink/40">标题</dt>
              <dd className="font-medium">{result.draft.title}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-14 shrink-0 text-ink/40">时间</dt>
              <dd className="font-medium">
                {result.draft.day} {result.draft.startTime}
                {result.draft.endTime ? `–${result.draft.endTime}` : ""}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-14 shrink-0 text-ink/40">地点</dt>
              <dd className="font-medium">{result.draft.location || "待确认"}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-14 shrink-0 text-ink/40">截止</dt>
              <dd className="font-medium text-accent">
                {result.draft.deadlineTime || "原文未写"}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="w-14 shrink-0 text-ink/40">标签</dt>
              <dd className="flex flex-wrap gap-1">
                {(result.draft.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-ink/5 px-1.5 py-0.5 text-[11px] text-ink/55"
                  >
                    {interestLabel[tag] || tag}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
          <p className="mt-2 border-t border-ink/5 pt-2 text-[11px] leading-relaxed text-ink/40">
            {result.draft.note || discoverCopy.parseNote}
            <span className="ml-1">（{result.source}）</span>
          </p>
        </div>
      ) : null}
    </Sheet>
  );
}

/* ------------------------------- 恋爱匹配 ------------------------------- */

export function MatchSheet({ open, onClose, onToast }) {
  const [stages, setStages] = useState({});
  const timers = useRef([]);

  useEffect(() => {
    if (!open) {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current = [];
      setStages({});
    }
  }, [open]);

  useEffect(() => () => timers.current.forEach((timer) => clearTimeout(timer)), []);

  const like = (id) => {
    setStages((prev) => ({ ...prev, [id]: "pending" }));
    const timer = setTimeout(() => {
      setStages((prev) => ({ ...prev, [id]: "matched" }));
    }, 900);
    timers.current.push(timer);
  };

  return (
    <Sheet open={open} onClose={onClose} title={communityCopy.datingTitle}>
      <p className="text-[12.5px] leading-relaxed text-ink/55">{communityCopy.datingBody}</p>

      <div className="mt-3 space-y-2.5">
        {matchProfiles.map((profile) => {
          const stage = stages[profile.id];
          return (
            <article
              key={profile.id}
              className="rounded-2xl bg-white p-3.5 ring-1 ring-ink/5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[15px] font-semibold text-white"
                  style={coverStyle(profile.theme)}
                >
                  {profile.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold">{profile.name}</p>
                  <p className="text-[11.5px] text-ink/45">{profile.meta}</p>
                </div>
                {stage === "matched" ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-[11px] font-medium text-rose-600">
                    <Heart size={12} /> 互相感兴趣
                  </span>
                ) : stage === "pending" ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-ink/5 px-2 py-1 text-[11px] text-ink/45">
                    <Loader2 size={12} className="animate-spin" /> 等待对方
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => like(profile.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-rose-500 px-2.5 py-1.5 text-[11.5px] font-semibold text-white active:scale-95"
                  >
                    <Heart size={12} /> 感兴趣
                  </button>
                )}
              </div>

              <p className="mt-2 text-[12px] leading-relaxed text-ink/55">{profile.bio}</p>
              <div className="mt-1.5 flex gap-1">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-ink/5 px-1.5 py-0.5 text-[10.5px] text-ink/55"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {stage === "matched" ? (
                <div className="mt-2.5 rounded-xl bg-rose-50 p-2.5">
                  <p className="text-[12px] font-semibold text-rose-700">
                    {communityCopy.matchTitle}
                  </p>
                  <p className="mt-0.5 text-[11.5px] leading-relaxed text-rose-700/70">
                    {communityCopy.matchBody}
                  </p>
                  <button
                    type="button"
                    onClick={() => onToast("演示模式：不会真的发出消息")}
                    className="mt-2 inline-flex items-center gap-1 rounded-lg bg-rose-500 px-2.5 py-1.5 text-[11.5px] font-semibold text-white active:scale-95"
                  >
                    <MessageCircle size={12} /> {communityCopy.sayHi}
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <p className="mt-3 rounded-xl bg-white/60 px-3 py-2.5 text-[11px] leading-relaxed text-ink/40">
        {communityCopy.datingSafety}
      </p>
    </Sheet>
  );
}

/* ------------------------------- 通用：格式化辅助 ------------------------------- */

export function deadlineText(event) {
  return event?.deadline ? `${formatTime(event.deadline)} ${formatDeadline(event.deadline)}` : "";
}
