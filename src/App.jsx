import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import BottomNav from "./components/BottomNav.jsx";
import CommunityTab from "./components/CommunityTab.jsx";
import DiscoverTab from "./components/DiscoverTab.jsx";
import FreshmanTab from "./components/FreshmanTab.jsx";
import MaterialsTab from "./components/MaterialsTab.jsx";
import TodayTab from "./components/TodayTab.jsx";
import {
  ComposeSheet,
  EventSheet,
  MatchSheet,
  MaterialSheet,
  ParseSheet,
  PostSheet,
  ProfileSheet,
} from "./components/sheets.jsx";
import { product, tabs } from "./content.js";
import { courses, events as seedEvents, materials, posts as seedPosts, todos } from "./data/mock.js";
import { rankEvents } from "./lib/recommend.js";
import { buildDeadlines, buildToday, pickUrgent } from "./lib/today.js";

export default function App() {
  const [tab, setTab] = useState("today");
  const [savedIds, setSavedIds] = useState(["evt-math-modeling"]);
  const [hiddenIds, setHiddenIds] = useState([]);
  const [tagScores, setTagScores] = useState({});
  const [interestIds, setInterestIds] = useState(["tech", "academic"]);
  const [eventList, setEventList] = useState(seedEvents);
  const [postList, setPostList] = useState(seedPosts);
  const [sheet, setSheet] = useState(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function showToast(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }

  const profile = useMemo(
    () => ({ interests: interestIds, tagScores, savedIds, hiddenIds }),
    [interestIds, tagScores, savedIds, hiddenIds]
  );

  const ranked = useMemo(() => rankEvents(eventList, profile), [eventList, profile]);

  const savedEvents = useMemo(
    () => eventList.filter((event) => savedIds.includes(event.id)),
    [eventList, savedIds]
  );

  const today = useMemo(
    () => buildToday({ courses, savedEvents, todos }),
    [savedEvents]
  );

  const deadlines = useMemo(
    () => buildDeadlines(eventList, savedIds),
    [eventList, savedIds]
  );

  const urgent = useMemo(() => pickUrgent(today.items), [today.items]);

  const eventById = useMemo(() => {
    const map = new Map(eventList.map((event) => [event.id, event]));
    ranked.forEach((event) => map.set(event.id, event));
    return map;
  }, [eventList, ranked]);

  function addSaved(id) {
    if (savedIds.includes(id)) return;
    setSavedIds((prev) => [...prev, id]);
    const event = eventList.find((item) => item.id === id);
    if (event) {
      setTagScores((prev) => {
        const next = { ...prev };
        for (const tag of event.tags || []) next[tag] = (next[tag] || 0) + 1;
        return next;
      });
    }
    showToast("已加入今日，可在「今日」查看冲突");
  }

  function hideEvent(id) {
    const event = eventList.find((item) => item.id === id);
    setHiddenIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setSavedIds((prev) => prev.filter((item) => item !== id));
    if (event) {
      setTagScores((prev) => {
        const next = { ...prev };
        for (const tag of event.tags || []) next[tag] = (next[tag] || 0) - 1;
        return next;
      });
    }
    setSheet(null);
    showToast("已隐藏，之后少推荐这一类");
  }

  function toggleInterest(id) {
    setInterestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function resetProfile() {
    setTagScores({});
    setHiddenIds([]);
    showToast("已重置推荐，已加入今日的活动保留");
  }

  function publishPost({ text, category }) {
    const post = {
      id: `post-local-${Date.now()}`,
      category,
      author: "我",
      avatar: "我",
      tags: ["新发布"],
      time: "刚刚",
      content: text,
      replies: 0,
    };
    setPostList((prev) => [post, ...prev]);
    setSheet(null);
    showToast("已发布（演示，不会上传）");
  }

  function addParsedEvent(event) {
    setEventList((prev) => [event, ...prev]);
    setSheet(null);
    setTab("discover");
    showToast(`已加入活动库：${event.title}`);
  }

  const openEvent = (id) => setSheet({ type: "event", id });
  const sheetEvent = sheet?.type === "event" ? eventById.get(sheet.id) : null;
  const sheetMaterial =
    sheet?.type === "material" ? materials.find((item) => item.id === sheet.id) : null;
  const sheetPost = sheet?.type === "post" ? postList.find((item) => item.id === sheet.id) : null;

  return (
    <div className="flex h-[100dvh] justify-center bg-stone-200 md:items-center">
      <div className="relative flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-paper md:h-[min(920px,calc(100dvh-2rem))] md:rounded-[28px] md:shadow-[0_24px_80px_-24px_rgba(28,25,23,0.45)]">
        <header className="flex items-center justify-between border-b border-ink/5 px-4 py-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold tracking-tight text-brand">
              {product.name}
            </span>
            <span className="text-[11px] text-ink/35">{product.fullName.split("·")[1]?.trim()}</span>
          </div>
          <button
            type="button"
            onClick={() => setSheet({ type: "profile" })}
            aria-label="兴趣与推荐设置"
            className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink/55 ring-1 ring-ink/10 active:scale-95"
          >
            <SlidersHorizontal size={12} />
            兴趣
          </button>
        </header>

        <main key={tab} className="flex-1 overflow-y-auto overscroll-contain">
          {tab === "today" ? (
            <TodayTab
              today={today}
              urgent={urgent}
              deadlines={deadlines}
              onOpenEvent={openEvent}
              onAddEvent={addSaved}
              onGoDiscover={() => setTab("discover")}
            />
          ) : null}

          {tab === "discover" ? (
            <DiscoverTab
              events={ranked}
              profile={profile}
              onToggleInterest={toggleInterest}
              onOpen={openEvent}
              onAdd={addSaved}
              onHide={hideEvent}
              onOpenProfile={() => setSheet({ type: "profile" })}
              onOpenParse={() => setSheet({ type: "parse" })}
              savedIds={savedIds}
            />
          ) : null}

          {tab === "materials" ? (
            <MaterialsTab
              materials={materials}
              onOpen={(material, options) =>
                setSheet({ type: "material", id: material.id, ai: Boolean(options?.ai) })
              }
            />
          ) : null}

          {tab === "community" ? (
            <CommunityTab
              posts={postList}
              onOpenPost={(post) => setSheet({ type: "post", id: post.id })}
              onCompose={(category) => setSheet({ type: "compose", category })}
              onOpenMatch={() => setSheet({ type: "match" })}
            />
          ) : null}

          {tab === "freshman" ? (
            <FreshmanTab
              events={eventList}
              onOpenEvent={openEvent}
              onGoMaterials={() => setTab("materials")}
              onToast={showToast}
            />
          ) : null}
        </main>

        <BottomNav tabs={tabs} active={tab} onChange={setTab} />

        <EventSheet
          open={sheet?.type === "event"}
          event={sheetEvent}
          onClose={() => setSheet(null)}
          saved={sheetEvent ? savedIds.includes(sheetEvent.id) : false}
          onAdd={addSaved}
          onHide={hideEvent}
          onToast={showToast}
          profile={profile}
        />

        <MaterialSheet
          open={sheet?.type === "material"}
          material={sheetMaterial}
          initialAi={Boolean(sheet?.ai)}
          onClose={() => setSheet(null)}
        />

        <ProfileSheet
          open={sheet?.type === "profile"}
          onClose={() => setSheet(null)}
          profile={profile}
          onToggleInterest={toggleInterest}
          onReset={resetProfile}
          savedCount={savedIds.length}
        />

        <PostSheet
          open={sheet?.type === "post"}
          post={sheetPost}
          onClose={() => setSheet(null)}
          onToast={showToast}
        />

        <ComposeSheet
          open={sheet?.type === "compose"}
          category={sheet?.category || "senior"}
          onClose={() => setSheet(null)}
          onPublish={publishPost}
        />

        <ParseSheet
          open={sheet?.type === "parse"}
          onClose={() => setSheet(null)}
          onConfirm={addParsedEvent}
        />

        <MatchSheet
          open={sheet?.type === "match"}
          onClose={() => setSheet(null)}
          onToast={showToast}
        />

        <div
          aria-live="polite"
          className="pointer-events-none absolute bottom-[86px] left-1/2 z-50 -translate-x-1/2"
        >
          {toast ? (
            <div className="toast-enter rounded-full bg-ink px-3.5 py-2 text-[12.5px] text-white shadow-lg">
              {toast}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
