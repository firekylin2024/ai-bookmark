// 简化的API调用 - 修复头部字符编码问题

export async function callOpenRouterAPI(prompt: string) {
  console.log("=== 开始简化的API调用 ===")

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("API密钥未配置")
  }

  console.log("API密钥存在，长度:", apiKey.length)

  // 定义备用模型列表
  const models = [
    "meta-llama/llama-3.2-3b-instruct:free",
    "microsoft/phi-3-mini-128k-instruct:free",
    "google/gemma-2-9b-it:free",
    "qwen/qwen-2-7b-instruct:free",
  ]

  let lastError: any = null

  // 尝试每个模型
  for (const model of models) {
    try {
      console.log("尝试模型:", model)

      // 使用ASCII安全的头部
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // 使用ASCII安全的值
        "HTTP-Referer": "https://naviai.vercel.app",
        "X-Title": "NaviAI",
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content:
                "You are a website analysis expert. Please respond in Chinese and ensure your response is valid JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      })

      console.log("API响应状态:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`模型 ${model} 失败:`, response.status, errorText)
        lastError = new Error(`API调用失败: ${response.status} - ${errorText}`)
        continue
      }

      const data = await response.json()
      console.log("API调用成功，模型:", model)

      const content = data.choices?.[0]?.message?.content
      if (!content) {
        throw new Error("API返回空内容")
      }

      return content
    } catch (error) {
      console.error(`模型 ${model} 调用失败:`, error)
      lastError = error
      continue
    }
  }

  // 所有模型都失败了
  throw lastError || new Error("所有模型都不可用")
}
