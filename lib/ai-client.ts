// 这个文件现在主要用于类型定义，实际的OpenAI客户端在API路由中动态创建
export const AI_CONFIG = {
  baseURL: "https://openrouter.ai/api/v1",
  model: "deepseek/deepseek-prover-v2:free",
  defaultHeaders: {
    "HTTP-Referer": "https://naviai.vercel.app",
    "X-Title": "NaviAI - 智能导航系统",
  },
}

// 导出一个检查函数
export function checkApiKey(): boolean {
  return !!process.env.OPENROUTER_API_KEY
}
