"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, Send, ArrowLeft, Lightbulb, Brain } from "lucide-react"
import Link from "next/link"
import StarryBackground from "@/components/starry-background"

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "ai",
    content:
      "你好！我是NaviAI的DeepSeek AI助手。我已经分析了你的导航页面，可以帮你进行智能优化。有什么需要我帮你调整的吗？",
    timestamp: new Date(),
  },
]

const suggestedQuestions = ["帮我重新分类这些网站", "把常用的网站放在前面", "添加一个新的工作区分类", "调整颜色主题"]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      // 获取当前导航数据作为上下文
      const savedWebsites = localStorage.getItem("naviai-websites")
      const context = savedWebsites ? JSON.parse(savedWebsites) : null

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          context: context,
        }),
      })

      if (response.ok) {
        const { response: aiResponse } = await response.json()

        const aiMessage: Message = {
          id: Date.now() + 1,
          type: "ai",
          content: aiResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        // 降级到本地回复
        const fallbackResponse = generateFallbackResponse(content)
        const aiMessage: Message = {
          id: Date.now() + 1,
          type: "ai",
          content: fallbackResponse,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      }
    } catch (error) {
      console.error("AI聊天错误:", error)
      // 降级到本地回复
      const fallbackResponse = generateFallbackResponse(content)
      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: fallbackResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const generateFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("分类") || input.includes("重新分类")) {
      return "好的！我建议将你的网站重新分类为：\n\n🔧 **开发工具**: GitHub, Figma\n🎯 **生产力**: Notion, Slack\n🎬 **娱乐**: YouTube, Netflix, Spotify\n🔍 **搜索**: Google\n\n这样的分类更符合你的使用习惯，你觉得怎么样？"
    }

    if (input.includes("常用") || input.includes("前面")) {
      return "根据使用频率分析，我建议将以下网站置顶：\n\n1. **Google** (156次点击)\n2. **YouTube** (134次点击)\n3. **GitHub** (89次点击)\n\n这些是你最常用的网站，放在前面可以提高效率。要我现在就调整吗？"
    }

    return "我理解你的需求。作为你的AI助手，我可以帮你：\n\n✨ 重新分类和排序网站\n🎨 调整视觉样式和布局\n📊 分析使用习惯并提供建议\n🔧 添加新的功能分区\n\n请具体告诉我你想要什么样的调整，我会立即为你优化！"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <StarryBackground />

      <header className="border-b bg-gray-900/80 backdrop-blur-sm border-gray-700 relative z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="border-white/30 text-white hover:bg-white/10">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回导航
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                DeepSeek AI助手
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 聊天区域 */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col shadow-xl border-0 bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader className="border-b border-white/20">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="w-5 h-5 text-purple-400" />
                  与DeepSeek AI对话优化
                </CardTitle>
              </CardHeader>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "ai" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                            AI
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.type === "user"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "bg-gray-800/50 text-gray-100 border border-white/20"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        <div
                          className={`text-xs mt-1 ${message.type === "user" ? "text-purple-100" : "text-gray-400"}`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>

                      {message.type === "user" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-600 text-white text-xs">你</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-800/50 rounded-lg px-4 py-2 border border-white/20">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-400">DeepSeek AI思考中...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="border-t p-4 border-white/20">
                <div className="flex gap-2">
                  <Input
                    placeholder="告诉DeepSeek AI你想要什么样的优化..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                    className="flex-1 bg-gray-800/50 border-white/30 text-white placeholder:text-gray-400"
                  />
                  <Button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* AI功能介绍 */}
            <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI功能
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>智能网站分析</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>个性化布局建议</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span>使用习惯优化</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>智能注释生成</span>
                </div>
              </CardContent>
            </Card>

            {/* 快速问题 */}
            <Card className="shadow-lg border-0 bg-white/10 backdrop-blur-sm border border-white/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  快速优化
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto py-2 px-3 border-white/30 text-gray-300 hover:bg-white/10"
                    onClick={() => handleSendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* AI建议 */}
            <Card className="shadow-lg border-purple-200/20 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-white/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-purple-300 mb-1">DeepSeek AI</h3>
                    <p className="text-sm text-purple-200">基于先进的AI模型，为你提供最智能的导航优化建议</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
