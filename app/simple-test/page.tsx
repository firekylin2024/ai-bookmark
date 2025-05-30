"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function SimpleTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runSimpleTest = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/simple-test")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        status: "error",
        message: "请求失败",
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-300 border-green-400/30"
      case "error":
        return "bg-red-500/20 text-red-300 border-red-400/30"
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-900/90 border-gray-700 text-white">
          <CardHeader>
            <CardTitle className="text-center">🔍 API问题诊断</CardTitle>
            <p className="text-center text-gray-400">让我们先确定问题是API配置还是代码架构</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={runSimpleTest}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  测试中...
                </>
              ) : (
                "开始简单API测试"
              )}
            </Button>

            {testResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">测试结果:</span>
                  <Badge className={getStatusColor(testResult.status)}>
                    {getStatusIcon(testResult.status)}
                    <span className="ml-2">{testResult.status}</span>
                  </Badge>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-sm mb-2">
                    <strong>消息:</strong> {testResult.message}
                  </p>

                  {testResult.response && (
                    <p className="text-sm mb-2">
                      <strong>API响应:</strong> {testResult.response}
                    </p>
                  )}

                  {testResult.details && (
                    <details className="text-xs mt-2">
                      <summary className="cursor-pointer text-gray-400">详细信息</summary>
                      <pre className="mt-2 p-2 bg-gray-900 rounded text-gray-300 overflow-x-auto">
                        {JSON.stringify(testResult.details, null, 2)}
                      </pre>
                    </details>
                  )}

                  {testResult.error && (
                    <div className="mt-2 p-2 bg-red-900/30 rounded border border-red-500/30">
                      <p className="text-sm text-red-300">
                        <strong>错误:</strong> {testResult.error}
                      </p>
                    </div>
                  )}
                </div>

                {/* 诊断建议 */}
                <div className="p-4 bg-blue-900/30 rounded-lg border border-blue-500/30">
                  <h3 className="font-semibold text-blue-300 mb-2">🔧 诊断建议</h3>
                  {testResult.status === "success" ? (
                    <div className="text-sm text-blue-200 space-y-1">
                      <p>✅ API配置正确，基础调用成功</p>
                      <p>🔍 问题可能在于:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>OpenAI客户端库的使用方式</li>
                        <li>复杂的错误处理逻辑</li>
                        <li>字符串处理中的undefined值</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="text-sm text-blue-200 space-y-1">
                      <p>❌ API配置有问题</p>
                      <p>🔍 需要检查:</p>
                      <ul className="list-disc list-inside ml-4 space-y-1">
                        <li>OPENROUTER_API_KEY 环境变量是否正确设置</li>
                        <li>API密钥是否有效</li>
                        <li>网络连接是否正常</li>
                        <li>模型名称是否正确</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
