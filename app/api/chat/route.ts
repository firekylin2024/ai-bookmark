import { type NextRequest, NextResponse } from "next/server"
import { callOpenRouterAPI } from "@/lib/simple-api"

export async function POST(request: NextRequest) {
  try {
    console.log("=== 开始处理聊天请求 ===")

    const requestBody = await request.json()
    const { message, context } = requestBody

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "请提供有效的消息内容" }, { status: 400 })
    }

    console.log("用户消息:", message)

    // 检查API密钥
    if (!process.env.OPENROUTER_API_KEY) {
      const fallbackResponse = generateFallbackChatResponse(message)
      return NextResponse.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        fallback: true,
      })
    }

    const systemPrompt = `你是NaviAI的智能助手，专门帮助用户优化个人导航页面。你的能力包括：

1. 网站分类和重新组织
2. 根据使用频率调整布局
3. 提供个性化的导航建议
4. 分析用户习惯并给出优化方案

当前用户的导航信息：
${context ? JSON.stringify(context, null, 2) : "暂无导航数据"}

请用友好、专业的语气回复用户，提供具体可行的建议。`

    try {
      const prompt = `${systemPrompt}\n\n用户问题: ${message}`
      const aiResponse = await callOpenRouterAPI(prompt)

      return NextResponse.json({
        response: aiResponse,
        timestamp: new Date().toISOString(),
      })
    } catch (aiError) {
      console.error("AI聊天调用失败:", aiError)

      const fallbackResponse = generateFallbackChatResponse(message)
      return NextResponse.json({
        response: fallbackResponse,
        timestamp: new Date().toISOString(),
        fallback: true,
      })
    }
  } catch (error) {
    console.error("聊天API处理错误:", error)

    return NextResponse.json(
      {
        response: "抱歉，AI助手暂时不可用。请稍后再试。",
        error: true,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

function generateFallbackChatResponse(message: string): string {
  if (!message || typeof message !== "string") {
    return "我理解你的需求。作为你的AI助手，我可以帮你优化导航页面。请告诉我具体需要什么帮助。"
  }

  const input = message.toLowerCase()

  if (input.includes("分类") || input.includes("重新分类")) {
    return "好的！我建议将你的网站重新分类为：\n\n🔧 **开发工具**: GitHub, Figma\n🎯 **生产力**: Notion, Slack\n🎬 **娱乐**: YouTube, Netflix, Spotify\n🔍 **搜索**: Google\n\n这样的分类更符合你的使用习惯，你觉得怎么样？"
  }

  if (input.includes("常用") || input.includes("前面")) {
    return "根据使用频率分析，我建议将以下网站置顶：\n\n1. **Google** (搜索引擎)\n2. **YouTube** (娱乐媒体)\n3. **GitHub** (开发工具)\n\n这些是常用的网站类型，放在前面可以提高效率。"
  }

  return "我理解你的需求。作为你的AI助手，我可以帮你：\n\n✨ 重新分类和排序网站\n🎨 调整视觉样式和布局\n📊 分析使用习惯并提供建议\n🔧 添加新的功能分区\n\n请具体告诉我你想要什么样的调整，我会立即为你优化！"
}
