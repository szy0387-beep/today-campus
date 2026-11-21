import { demoNow, isPast, isToday } from "./time.js";

// 课程、想去的活动、报名截止、个人待办合成一条「今天」，
// 并把时间重叠单独标出来，避免学生现场才发现撞车。

export function itemStatus(item, now = demoNow()) {
  if (item.done) return "done";
  if (item.start && item.end) {
    if (now >= item.end) return "past";
    if (now >= item.start) return "ongoing";
    return "upcoming";
  }
  if (item.at && isPast(item.at, now)) return "past";
  return "upcoming";
}

function findConflicts(items) {
  const blocks = items.filter((item) => item.start && item.end && !item.done);
  const conflicts = [];
  for (let i = 0; i < blocks.length; i += 1) {
    for (let j = i + 1; j < blocks.length; j += 1) {
      const a = blocks[i];
      const b = blocks[j];
      const overlap =
        Math.min(a.end.getTime(), b.end.getTime()) -
        Math.max(a.start.getTime(), b.start.getTime());
      if (overlap > 0) {
        conflicts.push({ a, b, minutes: Math.round(overlap / 60000) });
      }
    }
  }
  return conflicts;
}

export function buildToday({ courses = [], savedEvents = [], todos = [], now = demoNow() }) {
  const items = [];

  for (const course of courses) {
    if (!isToday(course.start)) continue;
    items.push({
      id: course.id,
      kind: "course",
      title: course.title,
      subtitle: course.code,
      at: course.start,
      start: course.start,
      end: course.end,
      location: course.location,
    });
  }

  for (const event of savedEvents) {
    if (isToday(event.start)) {
      items.push({
        id: event.id,
        kind: "event",
        title: event.title,
        subtitle: event.location,
        at: event.start,
        start: event.start,
        end: event.end,
        location: event.location,
        eventId: event.id,
      });
    }
    if (event.deadline && isToday(event.deadline) && !isPast(event.deadline, now)) {
      items.push({
        id: `${event.id}::deadline`,
        kind: "deadline",
        title: `${event.title} 报名截止`,
        subtitle: "还没报名就先去占位",
        at: event.deadline,
        deadline: event.deadline,
        eventId: event.id,
      });
    }
  }

  for (const todo of todos) {
    if (!isToday(todo.due)) continue;
    items.push({
      id: todo.id,
      kind: "todo",
      title: todo.title,
      subtitle: "个人待办",
      at: todo.due,
      due: todo.due,
      done: todo.done,
    });
  }

  items.sort((a, b) => a.at.getTime() - b.at.getTime());

  return { items, conflicts: findConflicts(items) };
}

export function buildDeadlines(eventList, savedIds = [], now = demoNow()) {
  return eventList
    .filter(
      (event) => event.deadline && isToday(event.deadline) && !isPast(event.deadline, now)
    )
    .map((event) => ({ ...event, saved: savedIds.includes(event.id) }))
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
}

export function pickUrgent(items, now = demoNow()) {
  const open = items.filter(
    (item) => !item.done && itemStatus(item, now) !== "past"
  );
  return open.find((item) => itemStatus(item, now) === "ongoing") || open[0] || null;
}
