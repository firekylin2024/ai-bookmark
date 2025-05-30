"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, Bug, CheckCircle, XCircle, AlertCircle, Key, RefreshCw } from "lucide-react"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: string
}

export default function DebugPanel() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [apiKeys, setApiKeys] = useState<{ count: number; keys: string[] }>({ count: 0, keys: [] })

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    const results: TestResult[] = []

    try {
      // 测试1: 检查环境变量
      try {
        console.log("开始测试环境变量...")
        const envTest = await fetch("/api/test-env")
        const data = await envTest.json()
        setApiKeys(data.apiKeys || { count: 0, keys: [] })

        if (data.apiKeys?.count > 0) {
          results.push({
            name: "API密钥检查",
            status: "success",
            message: `检测到 ${data.apiKeys.count} 个API密钥`,
            details: `主密钥: ${data.apiKeys.keys[0] || "无"}\n备用密钥: ${data.apiKeys.count > 1 ? "已配置" : "未配置"}`,
          })
        } else {
          results.push({
            name: "API密钥检查",
            status: "error",
            message: "未检测到有效的API密钥",
          })
        }
      } catch (error) {
        results.push({
          name: "API密钥检查",
          status: "error",
          message: "API密钥检查失败",
          details: error instanceof Error ? error.message : String(error),
        })
      }

      // 测试2: AI分析API
      try {
        console.log("开始测试AI分析API...")
        const analysisTest = await fetch("/api/analyze-websites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: ["https://www.google.com"] }),
        })

        const data = await analysisTest.json()

        if (analysisTest.ok) {
          results.push({
            name: "AI网站分析",
            status: "success",
            message: "AI分析API正常工作",
            details: `分析结果: ${JSON.stringify(data, null, 2).substring(0, 500)}...`,
          })
        } else {
          results.push({
            name: "AI网站分析",
            status: "error",
            message: "AI分析API失败",
            details: JSON.stringify(data, null, 2),
          })
        }
      } catch (error) {
        results.push({
          name: "AI网站分析",
          status: "error",
          message: "AI分析API请求失败",
          details: error instanceof Error ? error.message : String(error),
        })
      }

      // 测试3: AI聊天API
      try {
        console.log("开始测试AI聊天API...")
        const chatTest = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "测试消息",
            context: { websites: [] },
          }),
        })

        const data = await chatTest.json()

        if (chatTest.ok) {
          const isFallback = data.fallback === true
          results.push({
            name: "AI聊天功能",
            status: isFallback ? "warning" : "success",
            message: isFallback ? "AI聊天API使用了本地回退响应" : "AI聊天API正常工作",
            details: `AI回复: ${data.response}`,
          })
        } else {
          results.push({
            name: "AI聊天功能",
            status: "error",
            message: "AI聊天API失败",
            details: JSON.stringify(data, null, 2),
          })
        }
      } catch (error) {
        results.push({
          name: "AI聊天功能",
          status: "error",
          message: "AI聊天API请求失败",
          details: error instanceof Error ? error.message : String(error),
        })
      }

      // 测试4: 注释生成API
      try {
        console.log("开始测试注释生成API...")
        const notesTest = await fetch("/api/generate-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            website: {
              name: "Google",
              url: "https://www.google.com",
              category: "搜索引擎",
            },
          }),
        })

        const data = await notesTest.json()

        if (notesTest.ok) {
          results.push({
            name: "AI注释生成",
            status: "success",
            message: "注释生成API正常工作",
            details: `生成的注释: ${data.notes}`,
          })
        } else {
          results.push({
            name: "AI注释生成",
            status: "error",
            message: "注释生成API失败",
            details: JSON.stringify(data, null, 2),
          })
        }
      } catch (error) {
        results.push({
          name: "AI注释生成",
          status: "error",
          message: "注释生成API请求失败",
          details: error instanceof Error ? error.message : String(error),
        })
      }

      // 测试5: 本地存储
      try {
        console.log("开始测试本地存储...")
        localStorage.setItem("test-key", "test-value")
        const value = localStorage.getItem("test-key")
        localStorage.removeItem("test-key")

        if (value === "test-value") {
          results.push({
            name: "本地存储",
            status: "success",
            message: "localStorage正常工作",
          })
        } else {
          results.push({
            name: "本地存储",
            status: "error",
            message: "localStorage读写失败",
          })
        }
      } catch (error) {
        results.push({
          name: "本地存储",
          status: "error",
          message: "localStorage不可用",
          details: error instanceof Error ? error.message : String(error),
        })
      }

      // 测试6: 降级机制
      try {
        console.log("开始测试降级机制...")
        // 检查是否有API密钥
        if (apiKeys.count === 0) {
          // 没有API密钥，测试降级机制是否正常工作
          const fallbackTest = await fetch("/api/analyze-websites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls: ["https://www.example.com"] }),
          })

          const data = await fallbackTest.json()

          if (fallbackTest.ok && data.websites && data.websites.length > 0) {
            results.push({
              name: "降级机制",
              status: "success",
              message: "无API密钥时降级机制正常工作",
              details: `降级分析结果: ${JSON.stringify(data.websites[0], null, 2)}`,
            })
          } else {
            results.push({
              name: "降级机制",
              status: "error",
              message: "降级机制失败",
              details: JSON.stringify(data, null, 2),
            })
          }
        } else {
          results.push({
            name: "降级机制",
            status: "warning",
            message: "有API密钥，跳过降级机制测试",
            details: "要测试降级机制，请暂时移除API密钥",
          })
        }
      } catch (error) {
        results.push({
          name: "降级机制",
          status: "error",
          message: "降级机制测试失败",
          details: error instanceof Error ? error.message : String(error),
        })
      }
    } catch (error) {
      console.error("测试过程中发生错误:", error)
    } finally {
      setTestResults(results)
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-300 border-green-400/30"
      case "error":
        return "bg-red-500/20 text-red-300 border-red-400/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-900/90 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-purple-400" />
          NaviAI 功能测试面板
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Button onClick={runTests} disabled={isRunning} className="bg-gradient-to-r from-purple-600 to-blue-600">
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                运行测试中...
              </>
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                开始功能测试
              </>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">API密钥: </span>
            <Badge className={apiKeys.count > 0 ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}>
              {apiKeys.count > 0 ? `${apiKeys.count} 个可用` : "未配置"}
            </Badge>
          </div>
        </div>

        {testResults.length > 0 && (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="p-3 bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{result.name}</span>
                    <Badge className={getStatusColor(result.status)}>
                      {getStatusIcon(result.status)}
                      <span className="ml-1 capitalize">{result.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{result.message}</p>
                  {result.details && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-300">查看详情</summary>
                      <pre className="mt-2 p-2 bg-gray-900 rounded text-gray-300 overflow-x-auto">{result.details}</pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        <div className="text-sm text-gray-400 space-y-1">
          <p>
            <strong>测试说明：</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>API密钥检查：验证主API密钥和备用API密钥是否正确配置</li>
            <li>AI网站分析：测试批量网站分析功能（带有备用API机制）</li>
            <li>AI聊天功能：测试DeepSeek AI对话能力（带有备用API机制）</li>
            <li>AI注释生成：测试网站注释自动生成功能</li>
            <li>本地存储：检查浏览器存储功能</li>
            <li>降级机制：测试无API密钥时的本地分析能力</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
