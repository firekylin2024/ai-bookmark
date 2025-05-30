import { NextResponse } from "next/server"
import { getAvailableApiKeys } from "@/lib/api-keys"

export async function GET() {
  try {
    console.log("=== 开始测试环境变量 ===")
    const apiKeys = getAvailableApiKeys()
    console.log(`检测到 ${apiKeys.length} 个API密钥`)

    // 创建一个安全的响应对象，不泄露完整API密钥
    const safeKeys = apiKeys.map((key) => {
      if (!key || typeof key !== "string") return "无效密钥"
      if (key.length <= 10) return "***" // 密钥太短，完全隐藏
      return key.substring(0, 4) + "..." + key.substring(key.length - 4)
    })

    return NextResponse.json({
      status: "success",
      message: apiKeys.length > 0 ? "API密钥已正确配置" : "未找到API密钥",
      apiKeys: {
        count: apiKeys.length,
        keys: safeKeys,
      },
    })
  } catch (error) {
    console.error("测试环境变量时出错:", error)
    return NextResponse.json(
      {
        error: "检查环境变量时出错",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
