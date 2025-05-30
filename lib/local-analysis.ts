// 本地智能分析工具库

// 网站输入接口
export interface WebsiteInput {
  url: string
  name?: string
  category?: string
  notes?: string
}

// 分析后的网站接口
export interface AnalyzedWebsite extends WebsiteInput {
  id: number
  color: string
  description?: string
  frequency?: string
}

// 分析结果接口
export interface AnalysisResult {
  websites: AnalyzedWebsite[]
  categories: string[]
  suggestions: string
}

// 提取域名
export function extractDomainName(url: string): string {
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
    const hostname = urlObj.hostname
    const domain = hostname.replace("www.", "")
    const domainParts = domain.split(".")
    return domainParts[0] || "未知网站"
  } catch {
    // 如果URL格式不正确，尝试简单解析
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

// 网站知识库
const websiteKnowledge: Record<string, { name: string; category: string; description: string; color: string }> = {
  // 搜索引擎
  google: {
    name: "Google搜索",
    category: "搜索引擎",
    description: "全球最大的搜索引擎，日常查询必备工具",
    color: "bg-blue-500",
  },
  bing: {
    name: "必应搜索",
    category: "搜索引擎",
    description: "微软旗下搜索引擎，支持AI聊天功能",
    color: "bg-blue-500",
  },
  baidu: {
    name: "百度搜索",
    category: "搜索引擎",
    description: "中国最大的搜索引擎",
    color: "bg-blue-500",
  },
  duckduckgo: {
    name: "DuckDuckGo",
    category: "搜索引擎",
    description: "注重隐私的搜索引擎",
    color: "bg-blue-500",
  },

  // 开发工具
  github: {
    name: "GitHub",
    category: "开发工具",
    description: "代码托管平台，开源项目管理，开发者协作首选",
    color: "bg-gray-800",
  },
  gitlab: {
    name: "GitLab",
    category: "开发工具",
    description: "代码托管和CI/CD平台",
    color: "bg-gray-800",
  },
  stackoverflow: {
    name: "Stack Overflow",
    category: "开发工具",
    description: "程序员问答社区，技术问题解决方案库",
    color: "bg-gray-800",
  },
  vercel: {
    name: "Vercel",
    category: "开发工具",
    description: "前端部署和托管平台",
    color: "bg-gray-800",
  },
  netlify: {
    name: "Netlify",
    category: "开发工具",
    description: "静态网站托管和部署平台",
    color: "bg-gray-800",
  },

  // 娱乐媒体
  youtube: {
    name: "YouTube",
    category: "娱乐媒体",
    description: "视频分享平台，娱乐学习兼备，内容丰富多样",
    color: "bg-red-500",
  },
  netflix: {
    name: "Netflix",
    category: "娱乐媒体",
    description: "流媒体视频服务，高质量影视内容，需要会员订阅",
    color: "bg-red-600",
  },
  spotify: {
    name: "Spotify",
    category: "娱乐媒体",
    description: "音乐流媒体平台，海量音乐资源，支持离线播放",
    color: "bg-green-500",
  },
  bilibili: {
    name: "哔哩哔哩",
    category: "娱乐媒体",
    description: "中文视频平台，学习娱乐社区，弹幕互动",
    color: "bg-blue-400",
  },
  twitch: {
    name: "Twitch",
    category: "娱乐媒体",
    description: "游戏直播平台",
    color: "bg-purple-500",
  },

  // 生产力工具
  notion: {
    name: "Notion",
    category: "生产力工具",
    description: "多功能笔记工具，项目管理，团队协作利器",
    color: "bg-gray-700",
  },
  trello: {
    name: "Trello",
    category: "生产力工具",
    description: "看板式项目管理，任务跟踪，简单易用",
    color: "bg-blue-500",
  },
  asana: {
    name: "Asana",
    category: "生产力工具",
    description: "项目管理和团队协作工具",
    color: "bg-orange-500",
  },
  monday: {
    name: "Monday",
    category: "生产力工具",
    description: "项目管理和工作流程工具",
    color: "bg-blue-500",
  },
  evernote: {
    name: "印象笔记",
    category: "生产力工具",
    description: "笔记和信息管理工具",
    color: "bg-green-600",
  },

  // 设计工具
  figma: {
    name: "Figma",
    category: "设计工具",
    description: "在线设计工具，UI/UX设计首选，支持团队协作",
    color: "bg-purple-500",
  },
  sketch: {
    name: "Sketch",
    category: "设计工具",
    description: "矢量UI设计工具",
    color: "bg-blue-500",
  },
  adobe: {
    name: "Adobe",
    category: "设计工具",
    description: "创意设计软件套件",
    color: "bg-red-700",
  },
  canva: {
    name: "Canva",
    category: "设计工具",
    description: "在线平面设计工具，简单易用",
    color: "bg-blue-500",
  },

  // 沟通协作
  slack: {
    name: "Slack",
    category: "沟通协作",
    description: "团队沟通平台，工作协调，提高团队效率",
    color: "bg-purple-600",
  },
  discord: {
    name: "Discord",
    category: "沟通协作",
    description: "语音聊天平台，游戏社区，实时沟通",
    color: "bg-indigo-500",
  },
  teams: {
    name: "Microsoft Teams",
    category: "沟通协作",
    description: "微软团队协作平台",
    color: "bg-blue-600",
  },
  zoom: {
    name: "Zoom",
    category: "沟通协作",
    description: "视频会议工具，远程沟通首选",
    color: "bg-blue-500",
  },

  // 社交媒体
  twitter: {
    name: "Twitter",
    category: "社交媒体",
    description: "社交媒体平台，实时信息，全球动态",
    color: "bg-blue-400",
  },
  facebook: {
    name: "Facebook",
    category: "社交媒体",
    description: "全球最大社交网络，连接亲友",
    color: "bg-blue-600",
  },
  instagram: {
    name: "Instagram",
    category: "社交媒体",
    description: "图片分享社交平台，视觉体验",
    color: "bg-pink-500",
  },
  linkedin: {
    name: "LinkedIn",
    category: "社交媒体",
    description: "职业社交网络，求职招聘平台",
    color: "bg-blue-700",
  },
  pinterest: {
    name: "Pinterest",
    category: "社交媒体",
    description: "图片收藏和分享平台",
    color: "bg-red-600",
  },
  reddit: {
    name: "Reddit",
    category: "社交媒体",
    description: "社区论坛，话题讨论，信息聚合",
    color: "bg-orange-600",
  },

  // 学习教育
  coursera: {
    name: "Coursera",
    category: "学习教育",
    description: "在线课程平台，提供大学和机构课程",
    color: "bg-blue-600",
  },
  udemy: {
    name: "Udemy",
    category: "学习教育",
    description: "在线学习平台，技能培训课程",
    color: "bg-purple-700",
  },
  edx: {
    name: "edX",
    category: "学习教育",
    description: "免费在线课程平台",
    color: "bg-red-700",
  },
  khan: {
    name: "可汗学院",
    category: "学习教育",
    description: "免费教育资源平台",
    color: "bg-green-600",
  },
  duolingo: {
    name: "多邻国",
    category: "学习教育",
    description: "语言学习应用",
    color: "bg-green-500",
  },

  // 新闻资讯
  cnn: {
    name: "CNN",
    category: "新闻资讯",
    description: "美国新闻网络",
    color: "bg-red-600",
  },
  bbc: {
    name: "BBC",
    category: "新闻资讯",
    description: "英国广播公司",
    color: "bg-red-700",
  },
  nytimes: {
    name: "纽约时报",
    category: "新闻资讯",
    description: "美国主流报纸",
    color: "bg-gray-700",
  },
  guardian: {
    name: "卫报",
    category: "新闻资讯",
    description: "英国主流报纸",
    color: "bg-blue-600",
  },
  reuters: {
    name: "路透社",
    category: "新闻资讯",
    description: "国际新闻通讯社",
    color: "bg-blue-700",
  },
}

// 获取网站信息
export function getWebsiteInfo(url: string) {
  const domain = extractDomainName(url).toLowerCase()
  return websiteKnowledge[domain] || null
}

// 获取随机颜色
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

// 根据分类获取颜色
export function getColorByCategory(category: string): string {
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

  return categoryColors[category] || getRandomColor()
}

// 本地智能分析函数
export async function performLocalAnalysis(websites: WebsiteInput[]): Promise<AnalysisResult> {
  console.log("开始本地智能分析...")

  // 分析每个网站
  const analyzedWebsites: AnalyzedWebsite[] = websites.map((site, index) => {
    // 提取域名
    const domain = extractDomainName(site.url).toLowerCase()

    // 查找知识库中的信息
    const knownInfo = websiteKnowledge[domain]

    // 合并用户输入和知识库信息
    const name = site.name || knownInfo?.name || domain.charAt(0).toUpperCase() + domain.slice(1)
    const category = site.category || knownInfo?.category || "其他"
    const description = knownInfo?.description || `${name}网站，提供在线服务`
    const notes = site.notes || ""

    // 确定颜色
    let color = knownInfo?.color
    if (!color) {
      color = getColorByCategory(category)
    }

    // 生成使用频率（模拟）
    const frequency = ["高", "中", "低"][Math.floor(Math.random() * 3)]

    // 生成点击次数（模拟）
    const clicks = Math.floor(Math.random() * 100) + 20

    return {
      id: index + 1,
      url: site.url,
      name,
      category,
      description,
      notes,
      color,
      frequency,
      clicks,
    }
  })

  // 提取所有分类
  const allCategories = analyzedWebsites.map((site) => site.category)
  const uniqueCategories = [...new Set(allCategories)].filter(Boolean)

  // 生成建议
  const suggestions = generateSuggestions(analyzedWebsites)

  return {
    websites: analyzedWebsites,
    categories: uniqueCategories,
    suggestions,
  }
}

// 生成建议
function generateSuggestions(websites: AnalyzedWebsite[]): string {
  const categoryCount = new Map<string, number>()

  // 统计各分类数量
  websites.forEach((site) => {
    const category = site.category
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1)
  })

  // 找出最多的分类
  let maxCategory = ""
  let maxCount = 0
  categoryCount.forEach((count, category) => {
    if (count > maxCount) {
      maxCount = count
      maxCategory = category
    }
  })

  // 生成建议
  if (websites.length <= 3) {
    return "您的网站数量较少，建议继续添加更多常用网站，丰富您的导航页面。"
  } else if (maxCategory && maxCount >= websites.length / 2) {
    return `您的网站中有${maxCount}个属于"${maxCategory}"分类，建议考虑进一步细分或添加其他类型的网站，使导航更加多样化。`
  } else if (websites.length >= 10) {
    return `您已添加${websites.length}个网站，分布在${categoryCount.size}个不同分类中，建议使用颜色标记最常用的网站，提高访问效率。`
  } else {
    return "本地分析完成，已保留您的个人标注和分类偏好，并智能补充了缺失信息。"
  }
}
