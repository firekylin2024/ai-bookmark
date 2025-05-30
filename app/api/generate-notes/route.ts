import { type NextRequest, NextResponse } from "next/server"
import { callOpenRouterAPI } from "@/lib/simple-api"

export async function POST(request: NextRequest) {
  try {
    console.log("=== 开始处理生成注释请求 ===")

    const requestBody = await request.json()
    const { website } = requestBody

    if (!website || !website.url) {
      return NextResponse.json({ error: "请提供有效的网站信息" }, { status: 400 })
    }

    console.log("准备为网站生成注释:", website.name || website.url)

    // 检查API密钥
    if (!process.env.OPENROUTER_API_KEY) {
      const localNotes = generateLocalNotes(website)
      return NextResponse.json({ notes: localNotes })
    }

    const prompt = `请为以下网站生成一个简洁实用的注释说明：

网站：${website.name || website.url}
URL：${website.url}
分类：${website.category || "未知"}

请生成一个50字以内的注释，包含：
1. 主要功能或用途
2. 特色功能（如果有）
3. 使用建议或注意事项（如会员到期、重要功能等）

注释要实用、简洁，帮助用户快速理解网站价值。`

    try {
      const notes = await callOpenRouterAPI(prompt)
      return NextResponse.json({ notes: notes.trim() })
    } catch (aiError) {
      console.error("注释生成AI调用失败:", aiError)
      const localNotes = generateLocalNotes(website)
      return NextResponse.json({ notes: localNotes })
    }
  } catch (error) {
    console.error("注释生成处理错误:", error)
    return NextResponse.json({ error: "注释生成服务暂时不可用" }, { status: 500 })
  }
}

function generateLocalNotes(website: any): string {
  if (!website || !website.url) {
    return "实用的在线服务平台"
  }

  const domain = extractDomainName(website.url)
  const domainLower = domain.toLowerCase()

  const localNotes: Record<string, string> = {
    google: "全球最大搜索引擎，日常查询、学习研究必备工具",
    github: "代码托管平台，开源项目管理，开发者协作首选",
    youtube: "视频分享平台，娱乐学习兼备，内容丰富多样",
    netflix: "流媒体视频服务，高质量影视内容，需要会员订阅",
    spotify: "音乐流媒体平台，海量音乐资源，支持离线播放",
    notion: "多功能笔记工具，项目管理，团队协作利器",
    figma: "在线设计工具，UI/UX设计首选，支持团队协作",
    slack: "团队沟通平台，工作协调，提高团队效率",
  }

  return localNotes[domainLower] || `${website.name || domain}，${website.category || "实用"}工具，提供专业的在线服务`
}

function extractDomainName(url: string): string {
  if (!url || typeof url !== "string") {
    return "未知网站"
  }

  try {
    const domain = new URL(url).hostname
    return domain.replace("www.", "").split(".")[0] || "未知网站"
  } catch {
    try {
      return (
        url
          .replace(/https?:\/\//, "")
          .split("/")[0]
          .split(".")[0] || "未知网站"
      )
    } catch {
      return "未知网站"
    }
  }
}
