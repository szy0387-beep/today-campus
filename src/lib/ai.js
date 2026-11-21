import { demoNow } from "./time.js";

// 默认走 mock：断网也能完整演示。
// 真实 AI 通过 /api/chat 服务端代理调用，失败一律回退 mock，不把错误抛到界面上。

const USE_REAL_AI = import.meta.env.VITE_USE_REAL_AI === "true";
const API_BASE = import.meta.env.VITE_API_BASE || "";

const MOCK_SOURCE = "演示模式 · 模板生成";
const REAL_SOURCE = "AI 实时生成";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseModelJson(text) {
  const cleaned = String(text || "")
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("模型没有返回 JSON");
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function request(mode, input) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, input }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`接口返回 ${res.status}：${detail.slice(0, 120)}`);
  }
  const data = await res.json();
  return parseModelJson(data.content || "");
}

function splitSentences(text, limit = 3) {
  return String(text || "")
    .split(/[。\n]/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, limit);
}

function mockSummary(material) {
  const points = material.fallbackSummary?.length
    ? material.fallbackSummary
    : splitSentences(material.content);

  return {
    source: MOCK_SOURCE,
    points,
    question: material.fallbackQuestion || {
      stem: `关于「${material.title}」，下面哪一种复习顺序更合理？`,
      options: ["先把笔记抄一遍", "先做题再看答案", "先过一遍提纲，再按题型练", "直接背结论"],
      answer: "先过一遍提纲，再按题型练",
      explanation: "先建立结构，再用题目暴露薄弱点，比从头抄写更省时间。",
    },
  };
}

export async function summarizeMaterial(material) {
  if (!USE_REAL_AI) {
    await delay(650);
    return mockSummary(material);
  }
  try {
    const parsed = await request("material", {
      title: material.title,
      subject: material.subject,
      type: material.type,
      content: material.content,
    });
    const fallback = mockSummary(material);
    return {
      source: REAL_SOURCE,
      points: Array.isArray(parsed.points) && parsed.points.length ? parsed.points : fallback.points,
      question: parsed.question?.stem ? parsed.question : fallback.question,
    };
  } catch {
    await delay(200);
    return mockSummary(material);
  }
}

function mockExplanation(event, profile) {
  const reasons = (event.reasons || []).join("；");
  const lead = reasons ? `它排在这里，是因为${reasons}。` : "它来自校园活动库。";
  const when = event.location ? `地点在${event.location}。` : "";
  const advice = profile?.savedIds?.includes(event.id)
    ? "你已经加入今日，记得按截止时间报名。"
    : "如果今晚有空，可以先加入今日，再决定去不去。";
  return {
    source: MOCK_SOURCE,
    text: `${lead}${when}${advice}`,
  };
}

export async function explainRecommendation(event, profile) {
  if (!USE_REAL_AI) {
    await delay(500);
    return mockExplanation(event, profile);
  }
  try {
    const parsed = await request("reason", {
      title: event.title,
      tags: event.tags,
      source: event.source,
      reasons: event.reasons,
    });
    if (!parsed.text) throw new Error("缺少 text");
    return { source: REAL_SOURCE, text: parsed.text };
  } catch {
    await delay(150);
    return mockExplanation(event, profile);
  }
}

function pickTime(text) {
  const match = String(text || "").match(/(\d{1,2}):(\d{2})/);
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
}

function pickDeadlineTime(text) {
  const match = String(text || "").match(/(\d{1,2}):(\d{2})\s*(?:前|之前|截止)/);
  return match ? `${match[1].padStart(2, "0")}:${match[2]}` : "";
}

function pickTitle(text) {
  const cleaned = String(text || "")
    .replace(/^【[^】]*】/, "")
    .replace(/[。！!]$/, "");
  const segments = cleaned
    .split(/[，,。；;、]/)
    .map((piece) => piece.trim())
    .filter(Boolean)
    .filter((piece) => !/\d{1,2}:\d{2}/.test(piece))
    .filter((piece) => !/^[A-Za-z]{1,4}\s?\d{1,4}$/.test(piece))
    .filter((piece) => !/^(请|于|在|自|带|记得|注意)/.test(piece))
    .filter((piece) => piece.length >= 3 && piece.length <= 20);
  return segments.sort((a, b) => b.length - a.length)[0] || "未命名活动";
}

function mockParse(text) {
  const body = String(text || "");
  const title = pickTitle(body);

  const now = demoNow();
  const startTime = pickTime(body) || "14:00";
  const deadlineTime =
    pickDeadlineTime(body) ||
    startTime.replace(/(\d{1,2})/, (hour) =>
      String(Math.max(0, Number(hour) - 2)).padStart(2, "0")
    );

  const locationMatch = body.match(/(?:，|,)\s*([A-Z]{1,3}\s?\d{2,3}|[^，,。]{2,10}(?:楼|场|广场|门口|中心))/);
  const location = locationMatch ? locationMatch[1].trim() : "待确认";

  const tags = [];
  if (/工作坊|黑客松|AI|技术|编程/.test(body)) tags.push("tech");
  if (/讲座|说明会|建模|复习|课程/.test(body)) tags.push("academic");
  if (/志愿|公益/.test(body)) tags.push("volunteer");
  if (/比赛|球赛|运动/.test(body)) tags.push("sports");
  if (/创业|市集/.test(body)) tags.push("startup");
  if (/歌手|摄影|艺术|演出/.test(body)) tags.push("arts");
  if (tags.length === 0) tags.push("academic");

  const [sh, sm] = startTime.split(":").map(Number);
  const start = new Date(now);
  start.setHours(sh, sm, 0, 0);
  const end = new Date(start.getTime() + 90 * 60000);

  const [dh, dm] = deadlineTime.split(":").map(Number);
  const deadline = new Date(now);
  deadline.setHours(dh, dm, 0, 0);

  return {
    source: MOCK_SOURCE,
    draft: {
      title,
      day: /明天/.test(body) ? "明天" : "今天",
      startTime,
      endTime: `${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`,
      deadlineTime,
      location,
      tags,
      note: "AI 解析结果需人工核对；演示模式使用模板。",
    },
  };
}

export async function parseEventNotice(text) {
  if (!USE_REAL_AI) {
    await delay(700);
    return mockParse(text);
  }
  try {
    const parsed = await request("event", { text });
    if (!parsed.draft?.title) throw new Error("缺少 draft");
    return { source: REAL_SOURCE, draft: parsed.draft };
  } catch {
    await delay(150);
    return mockParse(text);
  }
}
