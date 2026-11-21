// 所有产品文案集中在这里；活动/资料/帖子的结构化演示数据在 src/data/mock.js。

export const product = {
  name: "今日",
  fullName: "今日 · 校园融合助手",
  track: "逆向产品创新",
  tagline: "校园信息很多，今天只做这几件。",
  intro: "活动、课表、报名截止、待办，压成一条今天的时间轴。",
  principle: "推荐理由可见；AI 只总结，不替你决定。",
  team: ["产品 / 调研：待填", "前端：待填", "后端 / AI：待填", "设计 / 路演：待填"],
};

export const interests = [
  { id: "academic", label: "学术", emoji: "🎓" },
  { id: "tech", label: "科技", emoji: "💻" },
  { id: "startup", label: "创业", emoji: "🚀" },
  { id: "arts", label: "艺术", emoji: "🎨" },
  { id: "sports", label: "体育", emoji: "🏀" },
  { id: "volunteer", label: "志愿", emoji: "🤝" },
  { id: "career", label: "求职", emoji: "💼" },
];

export const interestLabel = Object.fromEntries(
  interests.map((item) => [item.id, item.label])
);

export const tabs = [
  { id: "today", label: "今日" },
  { id: "discover", label: "发现" },
  { id: "materials", label: "资料" },
  { id: "community", label: "社区" },
  { id: "freshman", label: "新生" },
];

export const todayCopy = {
  greeting: "今天，先做这几件。",
  urgent: "现在最重要",
  nearest: "今天最近",
  timeline: "今天的时间轴",
  deadlines: "今天截止，还没决定",
  addMore: "去发现添加活动",
  conflict: "时间冲突",
  conflictAdvice: "两件事重叠，建议先去一个，另一个找同学补课或看回放。",
  emptyTimeline: "今天还没有安排。",
  emptyTimelineBody: "去发现看看，把感兴趣的活动加入今日。",
};

export const discoverCopy = {
  title: "发现",
  subtitle: "按你的兴趣和反馈排序，不按停留时长。",
  adjust: "调整兴趣",
  add: "加入今日",
  added: "已加入今日",
  hide: "不感兴趣",
  why: "为什么推荐",
  official: "打开官方报名入口",
  detail: "活动详情",
  empty: "这一类暂时没有更多活动。",
  emptyBody: "换个兴趣，或者重置推荐。",
  parse: "粘贴通知",
  parseHint: "粘贴公众号、邮件或群里的通知，AI 提取时间、地点、截止和标签，人工确认后加入。",
  parseButton: "解析通知",
  parseExample:
    "【活动通知】今天 14:00，BSG02，AI 产品设计工作坊，请于 12:00 前报名，自带电脑。",
  parseResult: "解析结果",
  parseConfirm: "确认加入活动库",
  parseNote: "AI 解析结果需人工核对；演示模式使用模板。",
};

export const materialsCopy = {
  title: "资料库",
  subtitle: "MTH / EAP 优先，AI 整理，人工核对后再发布。",
  subjects: ["全部", "MTH", "EAP", "CAT"],
  verified: "已核对",
  pending: "待核对",
  aiSummary: "AI 总结",
  aiButton: "AI 总结 + 出题",
  answer: "查看答案",
  hideAnswer: "收起答案",
  disclaimer: "示例资料，非官方；正式版需获得课程或作者授权。",
  empty: "这个科目还没有资料。",
};

export const communityCopy = {
  title: "社区",
  subtitle: "问学长、找队友、加入兴趣群。",
  segments: [
    { id: "senior", label: "学长问答" },
    { id: "team", label: "找队友" },
    { id: "club", label: "兴趣群" },
  ],
  replies: "回复",
  contact: "联系",
  compose: "发起招募",
  datingTitle: "恋爱匹配 · 内测",
  datingBody: "双方都感兴趣后解锁聊天；随时可以关闭。",
  datingButton: "开启匹配",
  datingSafety:
    "演示资料均为虚构；请勿填写真实联系方式。正式版需实名认证、举报和屏蔽。",
  matchTitle: "你们都对彼此感兴趣",
  matchBody: "这是双向选择，只有双方都点「感兴趣」才会出现这一页。",
  sayHi: "打个招呼（示例）",
  postNote: "演示发布，不会上传。",
  replyNote: "示例回复",
};

export const freshmanCopy = {
  title: "新生专区",
  subtitle: "刚来西浦？先看这 5 件事。",
  checklistTitle: "新生 7 日清单",
  checklist: [
    { text: "激活校园邮箱", done: true },
    { text: "登录 e-Bridge 看课表", done: true },
    { text: "领校园卡", done: true },
    { text: "找到专业导师", done: false },
    { text: "加入一个社团", done: false },
    { text: "预约图书馆研讨间", done: false },
    { text: "去一次新生答疑", done: false },
  ],
  faqTitle: "入学常见问题",
  faqs: [
    {
      q: "什么时候选课？",
      a: "新生选课一般在开学前两周，具体时间看教务邮件。先看培养方案，再排课表。",
    },
    {
      q: "校园邮箱怎么激活？",
      a: "在 e-Bridge 的 IT 服务里激活。激活后，官方通知会发到这个邮箱，记得每天看一眼。",
    },
    {
      q: "校园卡丢了怎么办？",
      a: "先在校园卡系统挂失，再去学生事务中心补办。补办前可以用手机二维码临时消费。",
    },
    {
      q: "图书馆怎么预约研讨间？",
      a: "在图书馆网站或小程序预约，通常需要 3 人以上。考试周要提前一天。",
    },
    {
      q: "新生周有哪些必参加的活动？",
      a: "开学典礼、专业介绍会、选课答疑、社团招新。具体看「发现」里的新生活动。",
    },
    {
      q: "怎么找到专业导师？",
      a: "在 e-Bridge 的学业指导页面查看分配结果，或问专业教务老师。",
    },
  ],
  stepsTitle: "选课指引",
  steps: [
    { title: "先看培养方案", body: "确认这学期必修、选修和学分上限，不要只看别人选什么。" },
    { title: "排好时间冲突", body: "先把必修课排进去，再放选修；留出吃饭和通勤时间。" },
    { title: "开学第一周试听", body: "不合适的课在退改选截止前调整，别拖到期中。" },
  ],
  systemsTitle: "常用系统",
  systems: [
    { name: "e-Bridge", desc: "课表 / 成绩 / 选课", icon: "GraduationCap" },
    { name: "Learning Mall", desc: "课程资料 / 作业", icon: "BookOpen" },
    { name: "校园邮箱", desc: "官方通知", icon: "Mail" },
    { name: "图书馆", desc: "借阅 / 研讨间", icon: "Library" },
    { name: "教务系统", desc: "考试 / 教室", icon: "ClipboardList" },
    { name: "校园卡", desc: "充值 / 挂失", icon: "CreditCard" },
  ],
  eventsTitle: "新生活动",
  resourcesTitle: "MTH / EAP 复习资料",
  resourcesBody: "期中前先看复习提纲，再做一套练习题。",
  resourcesButton: "打开资料库",
  groupButton: "加入新生群（示例）",
  systemNote: "示例入口；正式版接学校系统。",
  faqNote: "以学校最新通知为准。",
};

export const profileCopy = {
  title: "你的兴趣",
  body: "选几个你关心的方向，推荐会随你的收藏和「不感兴趣」调整。",
  reset: "重置推荐",
  dataNote: "演示数据，不会上传。正式版会说明数据来源和保存位置。",
  howTitle: "推荐怎么工作？",
  howBody:
    "兴趣匹配 + 收藏 +「不感兴趣」。不按停留时长排序，也不把「刷得久」当成喜欢。",
  saved: "已加入今日",
  hidden: "已隐藏",
  learned: "已学习反馈",
};
