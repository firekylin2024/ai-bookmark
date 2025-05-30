import { type NextRequest, NextResponse } from "next/server"
import { generateFallbackAnalysis } from "./utils"
import { callOpenRouterAPI } from "@/lib/simple-api"

export async function POST(request: NextRequest) {
  let requestBody: any = null

  try {
    console.log("=== 开始处理网站分析请求 ===")

    // 解析请求体
    try {
      requestBody = await request.json()
      console.log("请求体解析成功，URL数量:", requestBody?.urls?.length)
    } catch (parseError) {
      console.error("请求体解析失败:", parseError)
      return NextResponse.json({ error: "请求格式错误" }, { status: 400 })
    }

    const { urls } = requestBody

    if (!urls || !Array.isArray(urls)) {
      console.error("URL参数无效:", urls)
      return NextResponse.json({ error: "请提供有效的网站URL列表" }, { status: 400 })
    }

    if (urls.length === 0) {
      console.error("URL列表为空")
      return NextResponse.json({ error: "URL列表不能为空" }, { status: 400 })
    }

    // 预处理URLs
    const validUrls = urls
      .filter((url) => {
        if (!url || typeof url !== "string") return false
        const trimmed = url.trim()
        if (trimmed.length === 0) return false
        return trimmed.includes(".")
      })
      .map((url) => url.trim())

    if (validUrls.length === 0) {
      console.error("没有有效的URL")
      return NextResponse.json({ error: "没有找到有效的网站URL" }, { status: 400 })
    }

    console.log("准备分析的有效URLs:", validUrls.length, "个")

    // 检查是否有API密钥
    if (!process.env.OPENROUTER_API_KEY) {
      console.log("没有API密钥，使用降级分析")
      const fallbackResult = generateFallbackAnalysis(validUrls)
      return NextResponse.json(fallbackResult)
    }

    // 尝试AI分析
    try {
      console.log("开始AI分析...")

      const prompt = `Please analyze the following websites and provide a JSON response with website categorization and descriptions.

Website list:
${validUrls.join("\n")}

Return ONLY a valid JSON object in this exact format (no additional text or explanations):
{
  "websites": [
    {
      "url": "website URL",
      "name": "website name", 
      "category": "category in Chinese",
      "description": "description in Chinese",
      "frequency": "high/medium/low in Chinese",
      "notes": "notes in Chinese",
      "color": "CSS class like bg-blue-500"
    }
  ],
  "categories": ["category1", "category2"],
  "suggestions": "optimization suggestions in Chinese"
}`

      const aiResponse = await callOpenRouterAPI(prompt)
      console.log("AI响应长度:", aiResponse.length)
      console.log("AI响应前200字符:", aiResponse.substring(0, 200))

      // 改进的JSON解析逻辑
      let analysisResult
      try {
        analysisResult = parseAIResponse(aiResponse)

        if (!analysisResult.websites || !Array.isArray(analysisResult.websites)) {
          throw new Error("AI返回的数据格式不正确")
        }

        console.log("AI分析成功，网站数量:", analysisResult.websites.length)
        return NextResponse.json(analysisResult)
      } catch (parseError) {
        console.error("解析AI响应失败:", parseError)
        console.log("完整AI响应:", aiResponse)

        // 解析失败，使用降级分析
        const fallbackResult = generateFallbackAnalysis(validUrls)
        return NextResponse.json(fallbackResult)
      }
    } catch (aiError) {
      console.error("AI调用失败:", aiError)

      // AI失败，使用降级分析
      const fallbackResult = generateFallbackAnalysis(validUrls)
      return NextResponse.json(fallbackResult)
    }
  } catch (error) {
    console.error("处理请求时发生错误:", error)

    try {
      const urls = Array.isArray(requestBody?.urls) ? requestBody.urls : []
      const fallbackResult = generateFallbackAnalysis(urls)
      return NextResponse.json(fallbackResult)
    } catch (fallbackError) {
      console.error("降级分析也失败:", fallbackError)
      return NextResponse.json(
        {
          error: "服务暂时不可用，请稍后重试",
          websites: [],
          categories: [],
          suggestions: "服务暂时不可用",
        },
        { status: 500 },
      )
    }
  }
}

// 改进的AI响应解析函数
function parseAIResponse(response: string): any {
  console.log("开始解析AI响应...")

  if (!response || typeof response !== "string") {
    throw new Error("AI响应为空或格式无效")
  }

  // 尝试多种解析策略
  const strategies = [
    // 策略1: 直接解析
    () => JSON.parse(response.trim()),

    // 策略2: 移除markdown代码块
    () => {
      const cleaned = response
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim()
      return JSON.parse(cleaned)
    },

    // 策略3: 提取第一个完整的JSON对象
    () => {
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error("未找到JSON对象")
      return JSON.parse(jsonMatch[0])
    },

    // 策略4: 查找JSON开始和结束标记
    () => {
      const start = response.indexOf("{")
      const end = response.lastIndexOf("}") + 1
      if (start === -1 || end === 0) throw new Error("未找到JSON边界")
      const jsonStr = response.substring(start, end)
      return JSON.parse(jsonStr)
    },

    // 策略5: 逐行查找JSON
    () => {
      const lines = response.split("\n")
      let jsonLines = []
      let inJson = false

      for (const line of lines) {
        if (line.trim().startsWith("{")) {
          inJson = true
          jsonLines = [line]
        } else if (inJson) {
          jsonLines.push(line)
          if (line.trim().endsWith("}")) {
            break
          }
        }
      }

      if (jsonLines.length === 0) throw new Error("未找到JSON内容")
      return JSON.parse(jsonLines.join("\n"))
    },
  ]

  // 尝试每种策略
  for (let i = 0; i < strategies.length; i++) {
    try {
      console.log(`尝试解析策略 ${i + 1}...`)
      const result = strategies[i]()
      console.log(`策略 ${i + 1} 解析成功`)
      return result
    } catch (error) {
      console.log(`策略 ${i + 1} 失败:`, error instanceof Error ? error.message : String(error))
      continue
    }
  }

  throw new Error("所有JSON解析策略都失败了")
}
