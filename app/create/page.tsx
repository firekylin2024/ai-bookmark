"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  LinkIcon,
  FileText,
  Sparkles,
  ArrowRight,
  Brain,
  Zap,
  AlertCircle,
  Plus,
  X,
  CheckCircle,
  Info,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import StarryBackground from "@/components/starry-background"
import { type WebsiteInput, performLocalAnalysis } from "@/lib/local-analysis"
import { parseSmartBatchInput, validateParsedWebsites, generateParseStats, type ParsedWebsite } from "@/lib/url-parser"

export default function CreatePage() {
  const [batchUrls, setBatchUrls] = useState("")
  const [websiteInputs, setWebsiteInputs] = useState<WebsiteInput[]>([{ url: "", name: "", category: "", notes: "" }])
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [parsePreview, setParsePreview] = useState<ParsedWebsite[]>([])
  const [parseStats, setParseStats] = useState<any>(null)
  const router = useRouter()

  // 添加新的网站输入行
  const addWebsiteInput = () => {
    setWebsiteInputs([...websiteInputs, { url: "", name: "", category: "", notes: "" }])
  }

  // 删除网站输入行
  const removeWebsiteInput = (index: number) => {
    if (websiteInputs.length > 1) {
      setWebsiteInputs(websiteInputs.filter((_, i) => i !== index))
    }
  }

  // 更新网站输入
  const updateWebsiteInput = (index: number, field: keyof WebsiteInput, value: string) => {
    const updated = [...websiteInputs]
    updated[index] = { ...updated[index], [field]: value }
    setWebsiteInputs(updated)
  }

  // 智能解析批量输入
  const handleBatchInputChange = (text: string) => {
    setBatchUrls(text)

    if (text.trim()) {
      try {
        const parsed = parseSmartBatchInput(text)
        const validated = validateParsedWebsites(parsed)
        const stats = generateParseStats(text, validated)

        setParsePreview(validated)
        setParseStats(stats)
      } catch (error) {
        console.error("解析批量输入失败:", error)
        setParsePreview([])
        setParseStats(null)
      }
    } else {
      setParsePreview([])
      setParseStats(null)
    }
  }

  const handleGenerate = async () => {
    setIsProcessing(true)
    setAnalysisProgress("🔍 准备分析网站...")
    setErrorMessage("")

    try {
      // 收集所有网站数据
      let allWebsites: WebsiteInput[] = []

      // 从批量输入获取（使用智能解析结果）
      if (parsePreview.length > 0) {
        allWebsites = [...allWebsites, ...parsePreview]
      }

      // 从单独输入获取
      const individualWebsites = websiteInputs.filter((w) => w.url.trim())
      allWebsites = [...allWebsites, ...individualWebsites]

      if (allWebsites.length === 0) {
        setErrorMessage("请至少输入一个网站URL")
        setIsProcessing(false)
        setAnalysisProgress("")
        return
      }

      console.log("准备分析的网站:", allWebsites)

      setAnalysisProgress("🧠 本地智能分析中...")

      // 调用本地智能分析
      const analysisResult = await performLocalAnalysis(allWebsites)

      setAnalysisProgress("✨ 生成个性化导航页面...")

      // 保存结果
      localStorage.setItem("naviai-analysis", JSON.stringify(analysisResult))
      localStorage.setItem("naviai-websites", JSON.stringify(analysisResult.websites))

      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      console.error("生成过程中发生错误:", error)
      setErrorMessage(`生成失败: ${error instanceof Error ? error.message : String(error)}`)
      setAnalysisProgress("❌ 生成失败")
      setIsProcessing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        handleBatchInputChange(content)
      }
      reader.readAsText(file)
    }
  }

  const loadExampleData = () => {
    const exampleText = `https://www.google.com | Google搜索 [搜索引擎] # 日常搜索必备工具
https://www.github.com | GitHub [开发工具] # 代码托管和项目管理
https://www.youtube.com | YouTube [娱乐媒体] # 视频学习和娱乐平台
https://www.netflix.com | Netflix [娱乐媒体] # 流媒体视频服务，会员到期2024年12月
https://www.notion.so | Notion [生产力工具] # 笔记和项目管理，团队协作
https://www.figma.com | Figma [设计工具] # UI设计工具，团队版到期2024年11月
https://www.slack.com | Slack [沟通协作] # 团队沟通平台
https://www.spotify.com | Spotify [娱乐媒体] # 音乐流媒体平台`

    handleBatchInputChange(exampleText)
  }

  const loadMixedFormatExample = () => {
    const mixedText = `Google搜索 https://www.google.com
GitHub - https://github.com 代码托管平台
https://www.youtube.com YouTube视频平台
Netflix流媒体 https://www.netflix.com
https://www.notion.so
Figma设计工具 - https://www.figma.com
https://www.slack.com | Slack [沟通协作]
Spotify音乐 https://www.spotify.com # 音乐流媒体服务`

    handleBatchInputChange(mixedText)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <StarryBackground />

      <header className="border-b bg-gray-900/80 backdrop-blur-sm border-gray-700 relative z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              NaviAI
            </span>
          </Link>
          <Button variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              创建你的智能导航
            </h1>
            <p className="text-gray-300">智能解析多种格式，本地分析生成个性化导航</p>

            <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
              <Brain className="w-6 h-6 text-purple-400" />
              <span className="text-sm text-purple-300">智能URL识别 + 本地分析系统</span>
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
          </div>

          {/* 错误提示 */}
          {errorMessage && (
            <Card className="mb-6 border-red-500/50 bg-red-900/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-red-300 mb-1">生成失败</h3>
                    <p className="text-sm text-red-200">{errorMessage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-xl border-0 bg-white/10 backdrop-blur-sm border border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="w-5 h-5 text-purple-400" />
                导入网站信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="batch" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-white/20">
                  <TabsTrigger
                    value="batch"
                    className="flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-white/20"
                  >
                    <FileText className="w-4 h-4" />
                    智能批量导入
                  </TabsTrigger>
                  <TabsTrigger
                    value="individual"
                    className="flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-white/20"
                  >
                    <LinkIcon className="w-4 h-4" />
                    逐个详细添加
                  </TabsTrigger>
                  <TabsTrigger
                    value="file"
                    className="flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-white/20"
                  >
                    <Upload className="w-4 h-4" />
                    文件上传
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="batch" className="space-y-4">
                  <div>
                    <Label htmlFor="batch-urls" className="text-gray-300 mb-2 block">
                      智能批量输入 - 支持多种粘贴格式
                    </Label>

                    {/* 格式说明 */}
                    <div className="mb-3 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                      <p className="text-sm text-blue-200 mb-2">🎯 智能识别以下格式：</p>
                      <div className="text-xs text-blue-300 space-y-1 font-mono">
                        <div>
                          • <code>https://www.google.com</code> (纯URL)
                        </div>
                        <div>
                          • <code>Google搜索 https://www.google.com</code> (名称+URL)
                        </div>
                        <div>
                          • <code>https://www.google.com Google搜索</code> (URL+名称)
                        </div>
                        <div>
                          • <code>Google搜索 - https://www.google.com</code> (书签格式)
                        </div>
                        <div>
                          • <code>https://www.google.com | Google搜索 [搜索引擎] # 日常工具</code> (完整格式)
                        </div>
                      </div>
                    </div>

                    <Textarea
                      id="batch-urls"
                      placeholder="直接粘贴网址和名称，支持多种格式：&#10;Google搜索 https://www.google.com&#10;https://www.github.com GitHub代码托管&#10;YouTube视频 - https://www.youtube.com&#10;https://www.netflix.com Netflix流媒体"
                      value={batchUrls}
                      onChange={(e) => handleBatchInputChange(e.target.value)}
                      rows={10}
                      className="mt-2 bg-gray-800/50 border-white/30 text-white placeholder:text-gray-400 font-mono text-sm"
                    />

                    {/* 解析统计 */}
                    {parseStats && (
                      <div className="mt-3 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-300">解析结果</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-green-200">
                          <span>总行数: {parseStats.totalLines}</span>
                          <span>成功: {parseStats.successfullyParsed}</span>
                          <span>失败: {parseStats.failedLines}</span>
                          <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                            成功率: {parseStats.successRate}%
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* 解析预览 */}
                    {parsePreview.length > 0 && (
                      <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-white/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="w-4 h-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-300">
                            解析预览 ({parsePreview.length}个网站)
                          </span>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {parsePreview.slice(0, 5).map((site, index) => (
                            <div key={index} className="text-xs text-gray-300 p-2 bg-gray-900/50 rounded">
                              <div className="font-medium text-white">{site.name || "未命名"}</div>
                              <div className="text-blue-300">{site.url}</div>
                              {site.category && <div className="text-purple-300">分类: {site.category}</div>}
                              {site.notes && <div className="text-yellow-300">注释: {site.notes}</div>}
                            </div>
                          ))}
                          {parsePreview.length > 5 && (
                            <div className="text-xs text-gray-400 text-center">
                              还有 {parsePreview.length - 5} 个网站...
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={loadExampleData}
                      variant="outline"
                      className="border-purple-300/50 text-purple-200 hover:bg-purple-800/30"
                    >
                      💡 标准格式示例
                    </Button>
                    <Button
                      onClick={loadMixedFormatExample}
                      variant="outline"
                      className="border-green-300/50 text-green-200 hover:bg-green-800/30"
                    >
                      🎯 混合格式示例
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="individual" className="space-y-4">
                  <div className="space-y-4">
                    {websiteInputs.map((website, index) => (
                      <Card key={index} className="bg-gray-800/30 border-white/20">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-300">网站 #{index + 1}</h4>
                            {websiteInputs.length > 1 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeWebsiteInput(index)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-gray-300 text-xs">网站地址 *</Label>
                              <Input
                                placeholder="https://example.com"
                                value={website.url}
                                onChange={(e) => updateWebsiteInput(index, "url", e.target.value)}
                                className="bg-gray-800/50 border-white/30 text-white placeholder:text-gray-400"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300 text-xs">网站名称</Label>
                              <Input
                                placeholder="自定义名称"
                                value={website.name}
                                onChange={(e) => updateWebsiteInput(index, "name", e.target.value)}
                                className="bg-gray-800/50 border-white/30 text-white placeholder:text-gray-400"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300 text-xs">分类</Label>
                              <Input
                                placeholder="如：开发工具、娱乐媒体"
                                value={website.category}
                                onChange={(e) => updateWebsiteInput(index, "category", e.target.value)}
                                className="bg-gray-800/50 border-white/30 text-white placeholder:text-gray-400"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-300 text-xs">个人注释</Label>
                              <Input
                                placeholder="用途说明、到期时间等"
                                value={website.notes}
                                onChange={(e) => updateWebsiteInput(index, "notes", e.target.value)}
                                className="bg-gray-800/50 border-white/30 text-white placeholder:text-gray-400"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      onClick={addWebsiteInput}
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加更多网站
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="file" className="space-y-4">
                  <div>
                    <Label htmlFor="file-upload" className="text-gray-300">
                      上传文件
                    </Label>
                    <div className="mt-2 border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-purple-400 transition-colors bg-gray-800/30">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-300 mb-2">点击上传或拖拽文件到此处</p>
                      <p className="text-xs text-gray-400">支持 .txt, .csv 等文本文件，自动智能解析</p>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        className="mt-2 border-white/30 text-white hover:bg-white/10"
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        选择文件
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t border-white/20">
                <Button
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 button-glow"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {analysisProgress}
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 w-4 h-4" />
                      本地智能分析 <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 功能说明 */}
          <Card className="mt-6 border-purple-200/20 bg-purple-900/30 border border-white/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                智能解析功能
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-200">
                    <Zap className="w-4 h-4" />
                    <span>智能URL提取和清理</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-200">
                    <Zap className="w-4 h-4" />
                    <span>支持多种粘贴格式</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-purple-200">
                    <Zap className="w-4 h-4" />
                    <span>实时解析预览</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-200">
                    <Zap className="w-4 h-4" />
                    <span>自动去除多余文字</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
