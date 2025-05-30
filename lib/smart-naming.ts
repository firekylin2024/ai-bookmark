// 智能网站命名工具库

// 常见网站的标准名称映射
const WEBSITE_NAMES: Record<string, string> = {
  // 搜索引擎
  google: "Google",
  bing: "必应",
  baidu: "百度",
  duckduckgo: "DuckDuckGo",
  yahoo: "雅虎",

  // 开发工具
  github: "GitHub",
  gitlab: "GitLab",
  stackoverflow: "Stack Overflow",
  codepen: "CodePen",
  vercel: "Vercel",
  netlify: "Netlify",
  npm: "NPM",
  yarn: "Yarn",

  // 娱乐媒体
  youtube: "YouTube",
  netflix: "Netflix",
  spotify: "Spotify",
  bilibili: "哔哩哔哩",
  twitch: "Twitch",
  hulu: "Hulu",
  disney: "Disney+",
  amazon: "Amazon Prime",

  // 生产力工具
  notion: "Notion",
  trello: "Trello",
  asana: "Asana",
  monday: "Monday.com",
  evernote: "印象笔记",
  todoist: "Todoist",
  clickup: "ClickUp",

  // 设计工具
  figma: "Figma",
  sketch: "Sketch",
  adobe: "Adobe",
  canva: "Canva",
  dribbble: "Dribbble",
  behance: "Behance",

  // 沟通协作
  slack: "Slack",
  discord: "Discord",
  teams: "Microsoft Teams",
  zoom: "Zoom",
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  wechat: "微信",

  // 社交媒体
  twitter: "Twitter",
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  pinterest: "Pinterest",
  reddit: "Reddit",
  weibo: "微博",

  // 学习教育
  coursera: "Coursera",
  udemy: "Udemy",
  edx: "edX",
  khan: "可汗学院",
  duolingo: "多邻国",

  // 新闻资讯
  cnn: "CNN",
  bbc: "BBC",
  nytimes: "纽约时报",
  guardian: "卫报",
  reuters: "路透社",

  // 电商购物
  taobao: "淘宝",
  tmall: "天猫",
  jd: "京东",
  amazon: "亚马逊",
  ebay: "eBay",

  // 云服务
  aws: "AWS",
  azure: "Azure",
  gcp: "Google Cloud",
  aliyun: "阿里云",
  tencent: "腾讯云",

  // 金融服务
  paypal: "PayPal",
  stripe: "Stripe",
  alipay: "支付宝",
  wechatpay: "微信支付",

  // 其他常用
  wikipedia: "维基百科",
  stackoverflow: "Stack Overflow",
  medium: "Medium",
  zhihu: "知乎",
  douban: "豆瓣",
}

// 从域名提取关键词
export function extractDomainKeyword(url: string): string {
  if (!url || typeof url !== "string") {
    return "未知网站"
  }

  try {
    // 确保URL有协议前缀
    let processedUrl = url.trim()
    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl
    }

    const urlObj = new URL(processedUrl)
    let hostname = urlObj.hostname.toLowerCase()

    // 移除www前缀
    hostname = hostname.replace(/^www\./, "")

    // 提取主域名（去掉子域名）
    const parts = hostname.split(".")
    let mainDomain = ""

    if (parts.length >= 2) {
      // 对于常见的二级域名，取倒数第二个部分
      mainDomain = parts[parts.length - 2]
    } else {
      mainDomain = parts[0]
    }

    return mainDomain
  } catch {
    // 如果URL解析失败，尝试简单提取
    try {
      const cleaned = url
        .replace(/https?:\/\//, "")
        .replace(/www\./, "")
        .split("/")[0]
        .split(".")[0]
      return cleaned || "未知网站"
    } catch {
      return "未知网站"
    }
  }
}

// 智能生成网站名称
export function generateSmartName(url: string, userProvidedName?: string, description?: string): string {
  // 1. 如果用户提供了名称，优先使用（但要清理）
  if (userProvidedName && userProvidedName.trim()) {
    const cleanedName = cleanUserProvidedName(userProvidedName, url)
    if (cleanedName && cleanedName !== "未知网站") {
      return cleanedName
    }
  }

  // 2. 从描述中提取名称
  if (description && description.trim()) {
    const nameFromDescription = extractNameFromDescription(description, url)
    if (nameFromDescription && nameFromDescription !== "未知网站") {
      return nameFromDescription
    }
  }

  // 3. 从域名关键词查找标准名称
  const domainKeyword = extractDomainKeyword(url)
  const standardName = WEBSITE_NAMES[domainKeyword.toLowerCase()]
  if (standardName) {
    return standardName
  }

  // 4. 智能生成名称
  return generateNameFromDomain(domainKeyword)
}

// 清理用户提供的名称
function cleanUserProvidedName(name: string, url: string): string {
  if (!name || typeof name !== "string") {
    return ""
  }

  let cleaned = name.trim()

  // 移除URL片段
  cleaned = cleaned.replace(/https?:\/\/[^\s]*/gi, "").trim()

  // 移除常见的无用前缀
  cleaned = cleaned.replace(/^(网站|网址|链接|地址|URL)[:：\s]*/i, "")

  // 移除域名片段
  const domainKeyword = extractDomainKeyword(url)
  if (domainKeyword && domainKeyword !== "未知网站") {
    const domainRegex = new RegExp(`\\b${domainKeyword}\\b`, "gi")
    // 只有当名称不只是域名时才移除
    if (cleaned.toLowerCase() !== domainKeyword.toLowerCase()) {
      cleaned = cleaned.replace(domainRegex, "").trim()
    }
  }

  // 移除多余的标点符号
  cleaned = cleaned.replace(/^[-|–—:：\s]+/, "").replace(/[-|–—:：\s]+$/, "")

  // 移除括号内容（如果不是主要内容）
  if (cleaned.length > 10) {
    cleaned = cleaned.replace(/$$[^)]*$$/g, "").trim()
  }

  // 如果清理后太短或为空，返回空字符串
  if (!cleaned || cleaned.length < 2) {
    return ""
  }

  // 限制长度
  if (cleaned.length > 20) {
    cleaned = cleaned.substring(0, 20).trim()
  }

  return cleaned
}

// 从描述中提取网站名称
function extractNameFromDescription(description: string, url: string): string {
  if (!description || typeof description !== "string") {
    return ""
  }

  const desc = description.trim()

  // 常见的名称模式
  const patterns = [
    // "这是Google搜索引擎" -> "Google"
    /^这是([^，。！？\s]+)/,
    // "使用GitHub进行代码管理" -> "GitHub"
    /使用([^，。！？\s]+)进行/,
    // "访问YouTube观看视频" -> "YouTube"
    /访问([^，。！？\s]+)观看/,
    // "在Netflix上看电影" -> "Netflix"
    /在([^，。！？\s]+)上/,
    // "打开Figma设计工具" -> "Figma"
    /打开([^，。！？\s]+)设计/,
    // "登录Slack工作平台" -> "Slack"
    /登录([^，。！？\s]+)工作/,
  ]

  for (const pattern of patterns) {
    const match = desc.match(pattern)
    if (match && match[1]) {
      const extracted = match[1].trim()
      // 验证提取的名称是否合理
      if (extracted.length >= 2 && extracted.length <= 20 && !extracted.includes("http")) {
        return extracted
      }
    }
  }

  // 查找可能的品牌名称（大写字母开头的词）
  const words = desc.split(/[\s，。！？]+/)
  for (const word of words) {
    if (word.length >= 2 && word.length <= 15) {
      // 检查是否是已知的网站名称
      const lowerWord = word.toLowerCase()
      if (WEBSITE_NAMES[lowerWord]) {
        return WEBSITE_NAMES[lowerWord]
      }
      // 检查是否是首字母大写的合理名称
      if (/^[A-Z][a-zA-Z0-9]*$/.test(word)) {
        return word
      }
    }
  }

  return ""
}

// 从域名生成友好名称
function generateNameFromDomain(domainKeyword: string): string {
  if (!domainKeyword || domainKeyword === "未知网站") {
    return "未知网站"
  }

  // 首字母大写
  const capitalized = domainKeyword.charAt(0).toUpperCase() + domainKeyword.slice(1)

  // 处理一些特殊情况
  const specialCases: Record<string, string> = {
    jd: "京东",
    tb: "淘宝",
    tmall: "天猫",
    qq: "QQ",
    wx: "微信",
    wb: "微博",
    zhihu: "知乎",
    douban: "豆瓣",
    csdn: "CSDN",
    oschina: "开源中国",
    gitee: "码云",
    aliyun: "阿里云",
    qcloud: "腾讯云",
  }

  return specialCases[domainKeyword.toLowerCase()] || capitalized
}

// 生成智能描述
export function generateSmartDescription(url: string, name: string, userDescription?: string): string {
  // 如果用户提供了描述，优先使用
  if (userDescription && userDescription.trim()) {
    return userDescription.trim()
  }

  const domainKeyword = extractDomainKeyword(url).toLowerCase()

  // 基于域名的默认描述
  const descriptions: Record<string, string> = {
    google: "全球最大的搜索引擎，日常查询必备",
    github: "代码托管平台，开发者协作首选",
    youtube: "视频分享平台，娱乐学习兼备",
    netflix: "流媒体视频服务，高质量影视内容",
    spotify: "音乐流媒体平台，海量音乐资源",
    notion: "多功能笔记工具，团队协作利器",
    figma: "在线设计工具，UI/UX设计首选",
    slack: "团队沟通平台，提高工作效率",
    bilibili: "中文视频平台，学习娱乐社区",
    zhihu: "知识问答社区，高质量内容平台",
    douban: "文艺生活社区，电影书籍评分",
    taobao: "综合购物平台，商品种类丰富",
    jd: "品质购物平台，正品保障",
    alipay: "移动支付平台，生活服务便民",
    wechat: "社交通讯工具，连接你我他",
  }

  const defaultDescription = descriptions[domainKeyword]
  if (defaultDescription) {
    return defaultDescription
  }

  // 生成通用描述
  return `${name}官方网站，提供专业的在线服务`
}

// 智能提取和清理注释
export function generateSmartNotes(originalText: string, url: string, name: string): string {
  if (!originalText || typeof originalText !== "string") {
    return ""
  }

  let notes = originalText.trim()

  // 移除URL
  notes = notes.replace(/https?:\/\/[^\s]*/gi, "").trim()

  // 移除网站名称（如果重复）
  if (name && name !== "未知网站") {
    const nameRegex = new RegExp(`\\b${name}\\b`, "gi")
    notes = notes.replace(nameRegex, "").trim()
  }

  // 移除域名关键词
  const domainKeyword = extractDomainKeyword(url)
  if (domainKeyword && domainKeyword !== "未知网站") {
    const domainRegex = new RegExp(`\\b${domainKeyword}\\b`, "gi")
    notes = notes.replace(domainRegex, "").trim()
  }

  // 清理多余的标点和空格
  notes = notes.replace(/^[-|–—:：\s]+/, "").replace(/[-|–—:：\s]+$/, "")
  notes = notes.replace(/\s+/g, " ").trim()

  // 如果注释太短或只是重复信息，返回空
  if (!notes || notes.length < 3) {
    return ""
  }

  // 限制长度
  if (notes.length > 100) {
    notes = notes.substring(0, 100).trim() + "..."
  }

  return notes
}
