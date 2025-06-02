"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
  UploadCloud,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import StarryBackground from "@/components/starry-background"
import { type WebsiteInput, performLocalAnalysis } from "@/lib/local-analysis"
import { parseSmartBatchInput, validateParsedWebsites, generateParseStats, type ParsedWebsite } from "@/lib/url-parser"
import { parseHtmlBookmarks, isValidBookmarkFile } from "@/lib/html-parser"
import { toast } from "sonner"

export default function CreatePage() {
  const [batchUrls, setBatchUrls] = useState("")
  const [websiteInputs, setWebsiteInputs] = useState<WebsiteInput[]>([{ url: "", name: "", category: "", notes: "" }])
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [parsePreview, setParsePreview] = useState<ParsedWebsite[]>([])
  const [parseStats, setParseStats] = useState<any>(null)
  const [parseSuccess, setParseSuccess] = useState(false)
  const [parseError, setParseError] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [previewError, setPreviewError] = useState("")
  const [strictParseResult, setStrictParseResult] = useState<any[]>([])
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    setParseSuccess(false)
    setParseError("")
    if (file) {
      setIsProcessing(true)
      setAnalysisProgress("⏳ 正在解析文件…")
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        let parsed = false
        // 检查是否为HTML书签文件
        if (file.type === "text/html" || file.name.endsWith(".html")) {
          if (isValidBookmarkFile(content)) {
            const websites = parseHtmlBookmarks(content)
            if (websites.length > 0) {
              setParsePreview(websites)
              setParseStats({
                total: websites.length,
                valid: websites.length,
                invalid: 0,
                categories: [...new Set(websites.map(w => w.category).filter(Boolean))].length
              })
              toast.success("文件解析成功，已识别书签网站")
              setParseSuccess(true)
              parsed = true
            }
          }
        }
        // 如果不是HTML书签文件或解析失败，按普通文本处理
        if (!parsed) {
          try {
            handleBatchInputChange(content)
            toast.success("文件解析成功")
            setParseSuccess(true)
          } catch (err) {
            toast.error("文件解析失败，请检查格式")
            setParseError("文件解析失败，请检查格式")
          }
        }
        setIsProcessing(false)
        setAnalysisProgress("")
      }
      reader.onerror = () => {
        toast.error("文件读取失败")
        setIsProcessing(false)
        setAnalysisProgress("")
        setParseError("文件读取失败")
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

  // 修改严格格式检测函数，支持注释前置和多行注释
  function validateStrictFormat(text: string): { valid: boolean; error: string; preview: any[] } {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const result = [];
    let currentUrl = '';
    let currentNotes = '';
    let pendingNotes = ''; // 存储网址前的注释
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^(https?:\/\/|www\.)/i.test(line)) {
        // 检查是否有网址和其他内容在同一行
        const urlMatch = line.match(/^(https?:\/\/[^\s]+|www\.[^\s]+)/i);
        if (urlMatch && line.length > urlMatch[0].length) {
          return { 
            valid: false, 
            error: `第${i+1}行格式错误：网址"${urlMatch[0]}"后不能有其他内容，请另起一行写注释`, 
            preview: [] 
          };
        }
        
        // 保存上一个网址（如果有）
        if (currentUrl) {
          result.push({ url: currentUrl, notes: currentNotes.trim() });
        }
        
        // 设置新网址，将前置注释作为该网址的注释
        currentUrl = line;
        currentNotes = pendingNotes; // 使用前置注释
        pendingNotes = ''; // 清空前置注释
      } else {
        // 这是注释行
        if (currentUrl) {
          // 如果已有网址，这是该网址的后置注释
          currentNotes += (currentNotes ? '\n' : '') + line;
        } else {
          // 如果还没有网址，这是前置注释
          pendingNotes += (pendingNotes ? '\n' : '') + line;
        }
      }
    }
    
    // 保存最后一个网址
    if (currentUrl) {
      result.push({ url: currentUrl, notes: currentNotes.trim() });
    }
    
    // 如果还有未处理的前置注释但没有网址，这是错误
    if (pendingNotes && !currentUrl) {
      return { 
        valid: false, 
        error: `文本末尾有注释"${pendingNotes}"但没有对应的网址`, 
        preview: [] 
      };
    }
    
    return { valid: true, error: '', preview: result };
  }

  useEffect(() => {
    function preventDefault(e: DragEvent) {
      e.preventDefault()
    }
    document.body.addEventListener("dragover", preventDefault)
    document.body.addEventListener("drop", preventDefault)
    return () => {
      document.body.removeEventListener("dragover", preventDefault)
      document.body.removeEventListener("drop", preventDefault)
    }
  }, [])

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
              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-white/20">
                  <TabsTrigger
                    value="file"
                    className="flex items-center gap-2 text-gray-300 data-[state=active]:text-white data-[state=active]:bg-white/20"
                  >
                    <Upload className="w-4 h-4" />
                    文件上传
                  </TabsTrigger>
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
                </TabsList>

                <TabsContent value="file" className="space-y-4">
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => e.preventDefault()}
                  >
                    <Label htmlFor="file-upload" className="text-gray-300">
                      上传文件
                    </Label>
                    <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-muted rounded-lg cursor-pointer hover:border-primary transition-colors text-muted-foreground text-sm text-center px-4 select-none relative">
                      <UploadCloud className="w-8 h-8 mb-2 opacity-80" />
                      <span>
                        点击上传或拖拽文件到此处<br />
                        <span className="text-xs text-muted-foreground">
                          支持 <b>.txt</b>、<b>.csv</b> 等文本文件，<b>.html</b> 浏览器书签文件（如 Chrome/Edge 导出的 HTML）
                        </span>
                      </span>
                      <input
                        type="file"
                        accept=".txt,.csv,.html"
                        className="hidden"
                        onChange={handleFileUpload}
                        ref={fileInputRef}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4 border-white/30 text-white hover:bg-white/10"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        选择文件
                      </Button>
                      {isProcessing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-lg z-10">
                          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mb-2" />
                          <span className="text-white font-medium">{analysisProgress || "正在解析文件..."}</span>
                        </div>
                      )}
                      {!isProcessing && parseSuccess && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-green-600/90 text-white px-4 py-1 rounded shadow-lg flex items-center gap-2 z-10">
                          <CheckCircle className="w-4 h-4" />
                          解析成功！请点击下方"本地智能分析"生成导航
                        </div>
                      )}
                      {!isProcessing && parseError && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-4 py-1 rounded shadow-lg flex items-center gap-2 z-10">
                          <AlertCircle className="w-4 h-4" />
                          {parseError}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="batch" className="space-y-4">
                  <div>
                    <Label htmlFor="batch-urls" className="text-gray-300 mb-2 block">
                      智能批量输入 - 支持多种粘贴格式
                    </Label>

                    {/* 格式说明 */}
                    <div className="mb-3 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
                      <p className="text-sm text-blue-200 mb-2">📋 支持的格式（网址必须单独成行）：</p>
                      <div className="text-xs text-blue-300 space-y-1 font-mono">
                        <div className="text-green-300">// 格式1：注释后置</div>
                        <div>https://www.example.com</div>
                        <div>这是该网站的注释说明</div>
                        <div>可以多行注释</div>
                        <div className="text-green-300 mt-2">// 格式2：注释前置</div>
                        <div>分析或者说明文字</div>
                        <div>https://cover.weixin.qq.com/#/covers</div>
                        <div className="text-green-300 mt-2">// 格式3：混合使用</div>
                        <div>前置说明</div>
                        <div>https://openrouter.ai/</div>
                        <div>后置注释</div>
                      </div>
                    </div>

                    <Textarea
                      id="batch-urls"
                      placeholder="请按格式输入：&#10;https://www.example.com&#10;这是网站注释&#10;&#10;https://www.example2.com&#10;另一个网站的注释"
                      value={batchUrls}
                      onChange={(e) => setBatchUrls(e.target.value)}
                      rows={10}
                      className="mt-2 bg-gray-800/50 border-white/30 text-white placeholder:text-gray-400 font-mono text-sm"
                    />

                    {/* 预览按钮 */}
                    {!showPreview && batchUrls.trim() && (
                      <Button 
                        onClick={() => {
                          const validation = validateStrictFormat(batchUrls);
                          if (!validation.valid) {
                            setPreviewError(validation.error);
                            setShowPreview(false);
                          } else {
                            setPreviewError('');
                            setStrictParseResult(validation.preview);
                            setShowPreview(true);
                            // 转换为现有格式并设置预览
                            const converted = validation.preview.map(item => ({
                              url: item.url,
                              name: '',
                              category: '',
                              notes: item.notes
                            }));
                            setParsePreview(converted);
                          }
                        }}
                        className="mt-2 bg-blue-600 text-white"
                      >
                        📋 预览解析结果
                      </Button>
                    )}

                    {/* 错误提示 */}
                    {previewError && (
                      <div className="mt-3 p-3 bg-red-900/30 rounded-lg border border-red-500/30">
                        <p className="text-red-300 text-sm">❌ {previewError}</p>
                        <p className="text-red-200 text-xs mt-1">请修改格式后重新预览</p>
                      </div>
                    )}

                    {/* 预览结果 */}
                    {showPreview && strictParseResult.length > 0 && (
                      <div className="mt-3 p-3 bg-green-900/30 rounded-lg border border-green-500/30">
                        <h4 className="text-green-300 font-medium mb-2">✅ 解析预览（{strictParseResult.length}个网站）</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {strictParseResult.slice(0, 5).map((site, index) => (
                            <div key={index} className="text-xs bg-gray-900/50 p-2 rounded">
                              <div className="text-blue-300 font-medium">{site.url}</div>
                              {site.notes && <div className="text-yellow-300 mt-1">注释: {site.notes}</div>}
                            </div>
                          ))}
                          {strictParseResult.length > 5 && (
                            <div className="text-xs text-gray-400">还有 {strictParseResult.length - 5} 个网站...</div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button 
                            onClick={() => {
                              setShowPreview(false);
                              setStrictParseResult([]);
                              setParsePreview([]);
                            }}
                            variant="outline" 
                            size="sm"
                          >
                            重新编辑
                          </Button>
                          <Button 
                            onClick={() => {
                              // 确认导入，使用智能解析
                              handleBatchInputChange(batchUrls);
                            }}
                            size="sm"
                            className="bg-green-600 text-white"
                          >
                            确认格式，智能解析
                          </Button>
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
