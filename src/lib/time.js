// 演示时钟固定在今天 11:00，保证每次演示都看到同一个“今天”。
export function demoNow() {
  const d = new Date();
  d.setHours(11, 0, 0, 0);
  return d;
}

export function todayAt(hour, minute = 0) {
  const d = demoNow();
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function dayAt(offset, hour, minute = 0) {
  const d = todayAt(hour, minute);
  d.setDate(d.getDate() + offset);
  return d;
}

export function formatTime(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDate(date = demoNow()) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function isSameDay(a, b = demoNow()) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date) {
  return isSameDay(date, demoNow());
}

export function isPast(date, now = demoNow()) {
  return date.getTime() < now.getTime();
}

export function isWithinHours(date, hours, now = demoNow()) {
  const diff = date.getTime() - now.getTime();
  return diff >= 0 && diff <= hours * 60 * 60 * 1000;
}

export function minutesBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / 60000);
}

export function formatCountdown(date, now = demoNow()) {
  const mins = minutesBetween(now, date);
  if (mins <= 0) return "已截止";
  if (mins < 60) return `${mins} 分钟`;
  const hours = Math.floor(mins / 60);
  const rest = mins % 60;
  return rest ? `${hours} 小时 ${rest} 分` : `${hours} 小时`;
}

export function formatDeadline(date, now = demoNow()) {
  if (isPast(date, now)) return "已截止";
  if (isToday(date)) {
    const mins = minutesBetween(now, date);
    if (mins <= 90) return `${Math.max(1, mins)} 分钟后截止`;
    return `今天 ${formatTime(date)} 截止`;
  }
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(date, tomorrow)) return `明天 ${formatTime(date)} 截止`;
  return `${new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
  }).format(date)} 截止`;
}

export function formatEventWhen(start, end) {
  const dayLabel = (date) => {
    if (isToday(date)) return "今天";
    const tomorrow = new Date(demoNow());
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (isSameDay(date, tomorrow)) return "明天";
    return new Intl.DateTimeFormat("zh-CN", {
      month: "numeric",
      day: "numeric",
    }).format(date);
  };
  if (end) return `${dayLabel(start)} ${formatTime(start)}–${formatTime(end)}`;
  return `${dayLabel(start)} ${formatTime(start)}`;
}

export function sortByTime(a, b) {
  const aTime = a.at || a.start;
  const bTime = b.at || b.start;
  return aTime.getTime() - bTime.getTime();
}
