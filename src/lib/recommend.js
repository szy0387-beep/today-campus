import { interestLabel } from "../content.js";
import { isPast, isWithinHours } from "./time.js";

// 排序目标不是停留时长，而是「加入今日 / 报名」这类行动。
// 理由必须由代码算出，AI 只负责把它们说成一句人话。

const MAX_REASONS = 2;

export function scoreEvent(event, profile) {
  if ((profile.hiddenIds || []).includes(event.id)) return -100;

  let score = 0;
  for (const tag of event.tags || []) {
    if ((profile.interests || []).includes(tag)) score += 3;
    score += (profile.tagScores?.[tag] || 0) * 0.5;
  }

  if (event.deadline) {
    if (isPast(event.deadline)) score -= 2;
    else if (isWithinHours(event.deadline, 24)) score += 4;
    else if (isWithinHours(event.deadline, 72)) score += 1;
  }

  if ((profile.savedIds || []).includes(event.id)) score += 2;

  return score;
}

export function reasonsFor(event, profile, allEvents = []) {
  const reasons = [];
  const interests = profile.interests || [];
  const matchedInterest = (event.tags || []).find((tag) => interests.includes(tag));
  if (matchedInterest) {
    reasons.push(`你选了「${interestLabel[matchedInterest] || matchedInterest}」`);
  }

  if (event.deadline && !isPast(event.deadline)) {
    if (isWithinHours(event.deadline, 24)) reasons.push("报名今天截止");
    else if (isWithinHours(event.deadline, 72)) reasons.push("报名 3 天内截止");
  }

  const tagScores = profile.tagScores || {};
  const learnedTag = Object.entries(tagScores)
    .filter(
      ([tag, value]) =>
        value > 0 && tag !== matchedInterest && (event.tags || []).includes(tag)
    )
    .sort((a, b) => b[1] - a[1])[0]?.[0];
  if (learnedTag) {
    reasons.push(`你收藏过「${interestLabel[learnedTag] || learnedTag}」类活动`);
  }

  const savedSameKind = allEvents.some(
    (other) =>
      other.id !== event.id &&
      (profile.savedIds || []).includes(other.id) &&
      (other.tags || []).some((tag) => (event.tags || []).includes(tag))
  );
  if (savedSameKind) reasons.push("和你在今日的活动相近");

  if (event.source === "邮件") reasons.push("来自官方邮件");
  else if (event.source === "官网") reasons.push("来自学校官网");

  if (reasons.length === 0) reasons.push("来自校园活动库");

  return reasons.slice(0, MAX_REASONS);
}

export function rankEvents(eventList, profile) {
  return eventList
    .filter((event) => !(profile.hiddenIds || []).includes(event.id))
    .map((event) => ({
      ...event,
      score: scoreEvent(event, profile),
      reasons: reasonsFor(event, profile, eventList),
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.start.getTime() - b.start.getTime();
    });
}
