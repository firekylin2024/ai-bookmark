import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("=== 简单API测试开始 ===")

    // 1. 检查环境变量
    const apiKey = process.env.OPENROUTER_API_KEY
    console.log("API密钥存在:", !!apiKey)
    console.log("API密钥长度:", apiKey?.length || 0)

    if (!apiKey) {
      return NextResponse.json({
        status: "error",
        message: "API密钥未配置",
        suggestion: "请检查环境变量 OPENROUTER_API_KEY",
      })
    }

    // 2. 测试最简单的API调用
    console.log("开始测试API调用...")

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://naviai.vercel.app",
        "X-Title": "NaviAI - 智能导航系统",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          {
            role: "user",
            content: "Hello, just testing. Please respond with 'API works!'",
          },
        ],
        max_tokens: 50,
      }),
    })

    console.log("API响应状态:", response.status)
    console.log("API响应头:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API错误响应:", errorText)

      return NextResponse.json({
        status: "error",
        message: "API调用失败",
        details: {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        },
      })
    }

    const data = await response.json()
    console.log("API成功响应:", data)

    return NextResponse.json({
      status: "success",
      message: "API调用成功",
      response: data.choices?.[0]?.message?.content || "无响应内容",
      details: {
        model: data.model,
        usage: data.usage,
      },
    })
  } catch (error) {
    console.error("测试过程中出错:", error)

    return NextResponse.json({
      status: "error",
      message: "测试失败",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
  }
}
