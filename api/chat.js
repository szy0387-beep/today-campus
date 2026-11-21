// Vercel Serverless Function：AIHUBMIX_API_KEY 只放服务端环境变量，仓库公开也不会泄露。
// 前端默认走 mock；只有 VITE_USE_REAL_AI=true 时才会请求这里。

const MODES = {
  material: {
    system: `你是校园学习资料的整理助手。只根据用户给出的资料正文做总结，不补充资料里没有的知识点。
必须只输出 JSON，格式：
{
  "points": ["要点1", "要点2", "要点3"],
  "question": {
    "stem": "一道只考这份资料的选择题题干",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "answer": "正确选项的完整文字",
    "explanation": "一句话解释"
  }
}
语言：简体中文。points 最多 4 条，每条不超过 40 字。answer 必须与 options 中的某一项完全一致。`,
    maxTokens: 700,
  },
  reason: {
    system: `你是校园活动推荐的解释助手。用户会给你活动的标题、标签、来源，以及系统已经算好的推荐理由。
你的任务是把这些理由写成一句人话，向学生解释「为什么这个活动排在前面」。
不得编造系统没有给出的理由，不得评价学生本人，不得使用「算法认为」这类措辞。
必须只输出 JSON，格式：{"text": "一到两句简体中文，不超过 60 字"}。`,
    maxTokens: 200,
  },
  event: {
    system: `你负责把校园通知原文提取成结构化活动信息。
只提取原文里出现的信息，原文没有的字段留空字符串，不要猜测。
必须只输出 JSON，格式：
{
  "draft": {
    "title": "活动名称",
    "day": "今天 或 明天 或 M月D日",
    "startTime": "HH:MM",
    "endTime": "HH:MM，原文没写就留空",
    "deadlineTime": "HH:MM，原文没写就留空",
    "location": "地点，原文没写就留空",
    "tags": ["academic", "tech", "startup", "arts", "sports", "volunteer", "career"],
    "note": "一句提醒学生核对的话"
  }
}
tags 只能从给定枚举里选，最多 3 个。语言：简体中文。`,
    maxTokens: 400,
  },
};

async function readBody(req) {
  if (req.body) return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body;
  try {
    body = await readBody(req);
  } catch {
    return res.status(400).json({ error: "请求体不是合法 JSON" });
  }

  const mode = String(body.mode || "");
  const config = MODES[mode];
  if (!config) {
    return res.status(400).json({ error: "mode 只支持 material / reason / event" });
  }

  const input = JSON.stringify(body.input ?? {}).slice(0, 4000);
  if (input === "{}") return res.status(400).json({ error: "缺少 input" });

  const key = process.env.AIHUBMIX_API_KEY;
  if (!key) return res.status(500).json({ error: "服务器未配置 AIHUBMIX_API_KEY" });

  const baseUrl = process.env.AIHUBMIX_BASE_URL || "https://aihubmix.com/v1";
  const model = process.env.AIHUBMIX_MODEL || "gpt-4o-mini";

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: config.maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: config.system },
          { role: "user", content: input },
        ],
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return res
        .status(502)
        .json({ error: `上游接口 ${upstream.status}`, detail: text.slice(0, 300) });
    }

    const data = await upstream.json();
    const content = data.choices?.[0]?.message?.content || "";
    if (!content) return res.status(502).json({ error: "上游没有返回内容" });
    return res.status(200).json({ content });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
