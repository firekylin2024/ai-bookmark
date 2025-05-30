// API密钥管理工具 - 添加详细的错误处理和日志

// 定义API提供商类型
export type ApiProvider = {
  name: string
  baseURL: string
  model: string
  headers: Record<string, string>
}

// 获取所有可用的API密钥
export function getAvailableApiKeys(): string[] {
  const keys: string[] = []

  // 只使用主API密钥（OPENROUTER_API_KEY）
  if (process.env.OPENROUTER_API_KEY) {
    keys.push(process.env.OPENROUTER_API_KEY)
  }

  console.log("可用API密钥数量:", keys.length)
  return keys
}

// 获取API提供商配置 - 使用更可靠的模型
export function getApiProvider(index = 0): ApiProvider {
  // 使用更可靠的免费模型
  const provider = {
    name: "OpenRouter",
    baseURL: "https://openrouter.ai/api/v1",
    model: "meta-llama/llama-3.2-3b-instruct:free", // 更换为更可靠的免费模型
    headers: {
      "HTTP-Referer": "https://naviai.vercel.app",
      "X-Title": "NaviAI - 智能导航系统",
    },
  }

  console.log("使用API提供商配置:", provider)
  return provider
}

// 创建OpenAI客户端工厂函数 - 添加详细的错误处理
export async function createOpenAIClient(apiKeyIndex = 0) {
  console.log("开始创建OpenAI客户端，索引:", apiKeyIndex)

  try {
    const keys = getAvailableApiKeys()
    if (keys.length <= apiKeyIndex) {
      throw new Error("No API key available at index " + apiKeyIndex)
    }

    const apiKey = keys[apiKeyIndex]
    if (!apiKey || typeof apiKey !== "string") {
      throw new Error("API密钥无效")
    }

    const provider = getApiProvider(apiKeyIndex)
    console.log("API密钥长度:", apiKey.length)
    console.log("使用模型:", provider.model)
    console.log("使用baseURL:", provider.baseURL)

    const OpenAI = (await import("openai")).default

    // 添加dangerouslyAllowBrowser选项以在预览环境中工作
    const client = new OpenAI({
      baseURL: provider.baseURL,
      apiKey: apiKey,
      defaultHeaders: provider.headers,
      dangerouslyAllowBrowser: true, // 添加此选项以在预览环境中工作
    })

    console.log("OpenAI客户端创建成功")
    return client
  } catch (error) {
    console.error("创建OpenAI客户端失败详细信息:")
    console.error("错误类型:", typeof error)
    console.error("错误消息:", error instanceof Error ? error.message : String(error))
    console.error("错误堆栈:", error instanceof Error ? error.stack : "无堆栈信息")
    throw error
  }
}

// 带有多个备用模型的调用函数 - 添加详细的错误处理
export async function callWithFallback<T>(
  apiCall: (client: any, model: string) => Promise<T>,
  maxRetries = 1,
): Promise<T> {
  console.log("=== 开始callWithFallback ===")

  try {
    const keys = getAvailableApiKeys()

    if (keys.length === 0) {
      throw new Error("没有可用的API密钥")
    }

    // 定义多个备用模型，按优先级排序
    const fallbackModels = [
      "meta-llama/llama-3.2-3b-instruct:free",
      "microsoft/phi-3-mini-128k-instruct:free",
      "google/gemma-2-9b-it:free",
      "qwen/qwen-2-7b-instruct:free",
      "huggingfaceh4/zephyr-7b-beta:free",
    ]

    let lastError: any = null

    // 尝试每个模型
    for (let i = 0; i < fallbackModels.length; i++) {
      const model = fallbackModels[i]

      try {
        console.log(`=== 尝试模型 ${i + 1}/${fallbackModels.length}: ${model} ===`)

        // 验证模型名称
        if (!model || typeof model !== "string" || model.trim() === "") {
          console.error("模型名称无效:", model)
          continue
        }

        const trimmedModel = model.trim()
        console.log("使用模型:", trimmedModel)

        let client
        try {
          client = await createOpenAIClient(0)
        } catch (clientError) {
          console.error("创建客户端失败:", clientError)
          throw clientError
        }

        if (!client) {
          throw new Error("客户端创建失败")
        }

        console.log("客户端创建成功，开始执行API调用...")

        let result
        try {
          result = await apiCall(client, trimmedModel)
        } catch (apiCallError) {
          console.error("API调用内部错误:")
          console.error("错误类型:", typeof apiCallError)
          console.error("错误消息:", apiCallError instanceof Error ? apiCallError.message : String(apiCallError))
          console.error("错误堆栈:", apiCallError instanceof Error ? apiCallError.stack : "无堆栈信息")
          throw apiCallError
        }

        console.log("API调用成功完成，使用模型:", trimmedModel)
        return result
      } catch (error) {
        console.error(`=== 模型 ${model} 调用失败 ===`)
        console.error("错误类型:", typeof error)
        console.error("错误消息:", error instanceof Error ? error.message : String(error))
        console.error("错误堆栈:", error instanceof Error ? error.stack : "无堆栈信息")

        lastError = error

        // 检查错误类型
        if (error instanceof Error) {
          const errorMessage = error.message || ""

          // 如果是模型不可用的错误，尝试下一个模型
          if (
            errorMessage.includes("not available") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("invalid model") ||
            errorMessage.includes("model") // 更宽泛的模型相关错误
          ) {
            console.log(`模型 ${model} 不可用，尝试下一个模型...`)
            continue
          }

          // 如果是toLowerCase相关错误，记录详细信息
          if (errorMessage.includes("toLowerCase")) {
            console.error("发现toLowerCase错误，详细信息:")
            console.error("完整错误:", error)
            console.error("当前模型:", model)
            console.error("模型类型:", typeof model)
          }
        }

        // 如果是其他类型的错误，也尝试下一个模型
        console.log(`模型 ${model} 出现错误，尝试下一个模型...`)
        continue
      }
    }

    // 所有模型都失败了
    console.error("=== 所有模型都调用失败 ===")
    console.error("最后一个错误类型:", typeof lastError)
    console.error("最后一个错误消息:", lastError instanceof Error ? lastError.message : String(lastError))
    console.error("最后一个错误堆栈:", lastError instanceof Error ? lastError.stack : "无堆栈信息")

    throw lastError || new Error("所有备用模型都不可用")
  } catch (outerError) {
    console.error("=== callWithFallback外层错误 ===")
    console.error("外层错误类型:", typeof outerError)
    console.error("外层错误消息:", outerError instanceof Error ? outerError.message : String(outerError))
    console.error("外层错误堆栈:", outerError instanceof Error ? outerError.stack : "无堆栈信息")
    throw outerError
  }
}
