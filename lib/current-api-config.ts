// 当前使用的API配置
export const CURRENT_API_CONFIG = {
  // OpenRouter配置
  baseURL: "https://openrouter.ai/api/v1",
  model: "deepseek/deepseek-prover-v2:free", // 当前使用的模型
  headers: {
    "HTTP-Referer": "https://naviai.vercel.app",
    "X-Title": "NaviAI - 智能导航系统",
  },

  // API调用示例
  exampleCall: {
    method: "POST",
    endpoint: "/chat/completions",
    body: {
      model: "deepseek/deepseek-prover-v2:free",
      messages: [
        {
          role: "system",
          content: "你是一个专业的网站分析专家...",
        },
        {
          role: "user",
          content: "请分析这些网站...",
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    },
  },
}

// 环境变量要求
export const REQUIRED_ENV_VARS = {
  OPENROUTER_API_KEY: "你的OpenRouter API密钥",
}
