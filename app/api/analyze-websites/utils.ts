// 提取域名 - 添加更严格的输入验证
export function extractDomainName(url: string): string {
  // 严格检查输入，确保url存在且为字符串
  if (!url || typeof url !== "string" || url.trim() === "") {
    console.warn("无效的URL输入:", url)
    return "未知网站"
  }

  try {
    // 确保URL有协议前缀
    let processedUrl = url.trim()
    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl
    }

    const urlObj = new URL(processedUrl)
    const hostname = urlObj.hostname

    if (!hostname || typeof hostname !== "string") {
      console.warn("无法获取hostname:", processedUrl)
      return "未知网站"
    }

    const domain = hostname.replace("www.", "")
    const domainParts = domain.split(".")
    const cleanDomain = domainParts.length > 0 ? domainParts[0] : "未知网站"

    return cleanDomain || "未知网站"
  } catch {
    // 如果URL格式不正确，尝试简单解析
    try {
      const cleaned = url
        .replace(/https?:\/\//, "")
        .replace(/www\./, "")
        .split("/")[0]
        .split(".")[0]
      return cleaned && typeof cleaned === "string" ? cleaned : "未知网站"
    } catch {
      console.warn("URL解析完全失败:", url)
      return "未知网站"
    }
  }
}

// 根据域名获取分类 - 添加严格的null检查
export function getCategoryByDomain(domain: string): string {
  // 严格检查输入，确保domain存在且为字符串
  if (!domain || typeof domain !== "string" || domain.trim() === "") {
    console.warn("无效的域名输入:", domain)
    return "其他"
  }

  const trimmedDomain = domain.trim()
  if (!trimmedDomain) {
    return "其他"
  }

  const domainLower = trimmedDomain.toLowerCase()

  const categoryMap: Record<string, string> = {
    // 搜索引擎
    google: "搜索引擎",
    bing: "搜索引擎",
    baidu: "搜索引擎",
    yahoo: "搜索引擎",
    duckduckgo: "搜索引擎",

    // 开发工具
    github: "开发工具",
    gitlab: "开发工具",
    stackoverflow: "开发工具",
    codepen: "开发工具",
    vercel: "开发工具",
    netlify: "开发工具",

    // 娱乐媒体
    youtube: "娱乐媒体",
    netflix: "娱乐媒体",
    spotify: "娱乐媒体",
    bilibili: "娱乐媒体",
    twitch: "娱乐媒体",
    hulu: "娱乐媒体",

    // 生产力工具
    notion: "生产力工具",
    trello: "生产力工具",
    asana: "生产力工具",
    monday: "生产力工具",
    evernote: "生产力工具",
    todoist: "生产力工具",

    // 设计工具
    figma: "设计工具",
    sketch: "设计工具",
    adobe: "设计工具",
    canva: "设计工具",
    dribbble: "设计工具",
    behance: "设计工具",

    // 沟通协作
    slack: "沟通协作",
    discord: "沟通协作",
    teams: "沟通协作",
    zoom: "沟通协作",
    telegram: "沟通协作",
    whatsapp: "沟通协作",

    // 社交媒体
    twitter: "社交媒体",
    facebook: "社交媒体",
    instagram: "社交媒体",
    linkedin: "社交媒体",
    pinterest: "社交媒体",
    reddit: "社交媒体",

    // 学习教育
    coursera: "学习教育",
    udemy: "学习教育",
    edx: "学习教育",
    khan: "学习教育",
    duolingo: "学习教育",

    // 新闻资讯
    cnn: "新闻资讯",
    bbc: "新闻资讯",
    nytimes: "新闻资讯",
    guardian: "新闻资讯",
    reuters: "新闻资讯",
  }

  return categoryMap[domainLower] || "其他"
}

// 根据域名获取描述 - 添加严格的null检查
export function getDescriptionByDomain(domain: string): string {
  // 严格检查输入，确保domain存在且为字符串
  if (!domain || typeof domain !== "string" || domain.trim() === "") {
    return "实用的在线服务平台"
  }

  const trimmedDomain = domain.trim()
  if (!trimmedDomain) {
    return "实用的在线服务平台"
  }

  const domainLower = trimmedDomain.toLowerCase()

  const descriptions: Record<string, string> = {
    google: "全球最大的搜索引擎，日常查询必备工具",
    github: "代码托管平台，开发者协作首选",
    youtube: "视频分享平台，娱乐学习两不误",
    netflix: "流媒体视频服务，高质量影视内容",
    spotify: "音乐流媒体平台，海量音乐资源",
    notion: "多功能笔记工具，团队协作利器",
    figma: "在线设计工具，UI/UX设计首选",
    slack: "团队沟通平台，提高工作效率",
    bilibili: "中文视频平台，学习娱乐社区",
    stackoverflow: "程序员问答社区，解决编程问题",
    trello: "看板式项目管理工具",
    discord: "游戏玩家沟通平台",
    twitter: "实时社交媒体平台，获取最新资讯",
    facebook: "全球最大社交网络，连接亲友",
    instagram: "图片分享社交平台，视觉体验",
    linkedin: "职业社交网络，求职招聘平台",
    reddit: "社区论坛，话题讨论和信息聚合",
    zoom: "视频会议工具，远程沟通首选",
    amazon: "全球最大电商平台，购物首选",
    wikipedia: "免费百科全书，知识查询平台",
  }

  return descriptions[domainLower] || `${trimmedDomain}网站，实用的在线服务平台`
}

// 生成随机颜色
export function getRandomColor(): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 根据分类获取颜色 - 添加严格的输入验证
export function getColorByCategory(category: string): string {
  // 添加安全检查，确保category存在且为字符串
  if (!category || typeof category !== "string" || category.trim() === "") {
    return getRandomColor()
  }

  const categoryKey = category.trim()
  if (!categoryKey) {
    return getRandomColor()
  }

  const categoryColors: Record<string, string> = {
    搜索引擎: "bg-blue-500",
    开发工具: "bg-gray-800",
    娱乐媒体: "bg-red-500",
    生产力工具: "bg-green-500",
    设计工具: "bg-purple-500",
    沟通协作: "bg-indigo-500",
    社交媒体: "bg-pink-500",
    学习教育: "bg-teal-500",
    新闻资讯: "bg-orange-500",
    其他: "bg-gray-500",
  }

  return categoryColors[categoryKey] || getRandomColor()
}

// 降级分析函数 - 添加更全面的错误处理
export function generateFallbackAnalysis(urls: string[]) {
  console.log("=== 执行降级分析 ===")

  if (!Array.isArray(urls)) {
    console.error("URLs不是数组:", urls)
    return {
      websites: [],
      categories: ["其他"],
      suggestions: "数据格式错误，请重新输入网站地址",
    }
  }

  // 过滤和清理URL，添加更严格的验证
  const validUrls = urls.filter((url) => {
    if (!url || typeof url !== "string") {
      console.warn("跳过无效URL:", url)
      return false
    }
    const trimmed = url.trim()
    return trimmed.length > 0
  })

  if (validUrls.length === 0) {
    console.warn("没有有效的URL")
    return {
      websites: [],
      categories: ["其他"],
      suggestions: "没有找到有效的网站地址，请检查输入格式",
    }
  }

  const websites = validUrls.map((url: string, index: number) => {
    try {
      // 确保url是有效字符串
      if (!url || typeof url !== "string") {
        throw new Error("Invalid URL")
      }

      const cleanUrl = url.trim()
      if (!cleanUrl) {
        throw new Error("Empty URL")
      }

      const domain = extractDomainName(cleanUrl)
      const category = getCategoryByDomain(domain)
      const description = getDescriptionByDomain(domain)
      const color = getColorByCategory(category)

      // 确保所有返回值都是有效的字符串
      const safeDomain = domain && typeof domain === "string" ? domain : "未知网站"
      const safeName = safeDomain !== "未知网站" ? safeDomain.charAt(0).toUpperCase() + safeDomain.slice(1) : "未知网站"

      return {
        url: cleanUrl,
        name: safeName,
        category: category || "其他",
        description: description || "实用的在线服务平台",
        frequency: "中",
        notes: "",
        color: color || "bg-gray-500",
      }
    } catch (error) {
      console.error("处理URL时出错:", url, error)
      return {
        url: typeof url === "string" ? url.trim() : "无效URL",
        name: "未知网站",
        category: "其他",
        description: "网站信息解析失败",
        frequency: "低",
        notes: "",
        color: "bg-gray-500",
      }
    }
  })

  const categories = [...new Set(websites.map((w) => w.category).filter(Boolean))]

  console.log("降级分析完成，生成网站数量:", websites.length)

  return {
    websites,
    categories: categories.length > 0 ? categories : ["其他"],
    suggestions: "本地智能分析完成。根据网站特征自动分类，可以通过AI助手进一步优化。",
  }
}
