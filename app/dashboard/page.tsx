"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sparkles, MessageCircle, Settings, Eye, EyeOff, Brain, Plus, AlertCircle, Link2 } from "lucide-react"
import Link from "next/link"
import ThemeSelector from "@/components/theme-selector"
import { useTheme } from "@/components/theme-provider"
import { WebsiteCard } from "@/components/website-card"
import { WebsiteEditDialog, type WebsiteData } from "@/components/website-edit-dialog"
import { QuickAddWidget } from "@/components/quick-add-widget"

export default function DashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [searchTerm, setSearchTerm] = useState("")
  const [showNotes, setShowNotes] = useState(true)
  const [groupRelated, setGroupRelated] = useState(true)
  const [websites, setWebsites] = useState<WebsiteData[]>([])
  const [categories, setCategories] = useState<string[]>(["全部"])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { currentTheme, setTheme } = useTheme()

  // 从localStorage加载AI分析结果
  useEffect(() => {
    const savedWebsites = localStorage.getItem("naviai-websites")
    const savedAnalysis = localStorage.getItem("naviai-analysis")

    if (savedWebsites) {
      try {
        const websiteData = JSON.parse(savedWebsites)
        const analysisData = savedAnalysis ? JSON.parse(savedAnalysis) : null

        // 转换AI分析结果为组件需要的格式
        const formattedWebsites = websiteData.map((site: any, index: number) => ({
          id: index + 1,
          name: site.name || extractDomainName(site.url),
          url: site.url,
          category: site.category || "未分类",
          clicks: site.clicks || Math.floor(Math.random() * 100) + 20,
          color: site.color || `bg-blue-500`,
          notes: site.notes || "",
          description: site.description || "",
          frequency: site.frequency || "中",
        }))

        setWebsites(formattedWebsites)

        if (analysisData?.categories) {
          setCategories(["全部", ...analysisData.categories])
        } else {
          const uniqueCategories = [...new Set(formattedWebsites.map((w: WebsiteData) => w.category))]
          setCategories(["全部", ...uniqueCategories])
        }
      } catch (error) {
        console.error("加载数据失败:", error)
        loadDefaultData()
      }
    } else {
      loadDefaultData()
    }
  }, [])

  const loadDefaultData = () => {
    const defaultWebsites = [
      {
        id: 1,
        name: "Google",
        url: "https://www.google.com",
        category: "搜索引擎",
        clicks: 156,
        color: "bg-blue-500",
        notes: "主要搜索引擎，日常查询必备",
      },
      {
        id: 2,
        name: "GitHub",
        url: "https://www.github.com",
        category: "开发工具",
        clicks: 89,
        color: "bg-gray-800",
        notes: "代码托管平台，项目管理和协作",
      },
      {
        id: 3,
        name: "GitHub - GPT4o图像案例",
        url: "https://github.com/jamez-bondos/awesome-gpt4o-images?tab=readme-ov-file#cases-97",
        category: "开发工具",
        clicks: 23,
        color: "bg-gray-800",
        notes: "99个GPT-4o出图案例集合，设计参考",
      },
      {
        id: 4,
        name: "YouTube",
        url: "https://www.youtube.com",
        category: "娱乐媒体",
        clicks: 134,
        color: "bg-red-500",
        notes: "视频分享平台，娱乐学习兼备，内容丰富多样",
      },
      {
        id: 5,
        name: "Netflix",
        url: "https://www.netflix.com",
        category: "娱乐媒体",
        clicks: 67,
        color: "bg-red-600",
        notes: "",
      },
      {
        id: 6,
        name: "Spotify",
        url: "https://www.spotify.com",
        category: "娱乐媒体",
        clicks: 45,
        color: "bg-green-500",
        notes: "",
      },
      {
        id: 7,
        name: "Notion",
        url: "https://www.notion.so",
        category: "生产力工具",
        clicks: 78,
        color: "bg-gray-700",
        notes: "多功能笔记工具，项目管理，团队协作利器",
      },
      {
        id: 8,
        name: "Figma",
        url: "https://www.figma.com",
        category: "设计工具",
        clicks: 56,
        color: "bg-purple-500",
        notes: "在线设计工具，UI/UX设计首选，支持团队协作",
      },
      {
        id: 9,
        name: "Slack",
        url: "https://www.slack.com",
        category: "沟通协作",
        clicks: 34,
        color: "bg-purple-600",
        notes: "团队沟通平台，工作协调，提高团队效率",
      },
    ]
    setWebsites(defaultWebsites)
    setCategories(["全部", "搜索引擎", "开发工具", "娱乐媒体", "生产力工具", "设计工具", "沟通协作"])
  }

  const extractDomainName = (url: string): string => {
    try {
      const domain = new URL(url).hostname
      return domain.replace("www.", "").split(".")[0]
    } catch {
      return url
    }
  }

  // 获取域名
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "")
    } catch {
      return url
    }
  }

  // 分组相关网站
  const groupWebsitesByDomain = (websites: WebsiteData[]) => {
    if (!groupRelated) {
      return websites.map((website) => ({ main: website, related: [] }))
    }

    const domainGroups = new Map<string, WebsiteData[]>()

    // 按域名分组
    websites.forEach((website) => {
      const domain = getDomain(website.url)
      if (!domainGroups.has(domain)) {
        domainGroups.set(domain, [])
      }
      domainGroups.get(domain)!.push(website)
    })

    const result: { main: WebsiteData; related: WebsiteData[] }[] = []
    const processed = new Set<number>()

    websites.forEach((website) => {
      if (processed.has(website.id)) return

      const domain = getDomain(website.url)
      const samedomainSites = domainGroups.get(domain) || []

      if (samedomainSites.length > 1) {
        // 选择点击量最高的作为主网站
        const sortedSites = [...samedomainSites].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        const main = sortedSites[0]
        const related = sortedSites.slice(1)

        result.push({ main, related })
        samedomainSites.forEach((site) => processed.add(site.id))
      } else {
        result.push({ main: website, related: [] })
        processed.add(website.id)
      }
    })

    return result
  }

  const filteredWebsites = websites.filter((website) => {
    const matchesCategory = selectedCategory === "全部" || website.category === selectedCategory
    const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const groupedWebsites = groupWebsitesByDomain(filteredWebsites)

  // 处理网站编辑
  const handleEditWebsite = (editedWebsite: WebsiteData) => {
    const updatedWebsites = websites.map((website) =>
      website.id === editedWebsite.id ? { ...editedWebsite } : website,
    )

    setWebsites(updatedWebsites)

    try {
      localStorage.setItem("naviai-websites", JSON.stringify(updatedWebsites))
    } catch (error) {
      console.error("保存到localStorage失败:", error)
    }

    const uniqueCategories = [...new Set(updatedWebsites.map((w) => w.category))]
    setCategories(["全部", ...uniqueCategories])
  }

  // 处理网站删除
  const handleDeleteWebsite = (id: number) => {
    const updatedWebsites = websites.filter((website) => website.id !== id)
    setWebsites(updatedWebsites)
    localStorage.setItem("naviai-websites", JSON.stringify(updatedWebsites))

    const uniqueCategories = [...new Set(updatedWebsites.map((w) => w.category))]
    setCategories(["全部", ...uniqueCategories])
  }

  // 处理添加新网站
  const handleAddWebsite = (newWebsite: WebsiteData) => {
    const newId = Math.max(...websites.map((w) => w.id), 0) + 1
    const websiteWithId = { ...newWebsite, id: newId }

    const updatedWebsites = [...websites, websiteWithId]
    setWebsites(updatedWebsites)
    localStorage.setItem("naviai-websites", JSON.stringify(updatedWebsites))

    const uniqueCategories = [...new Set(updatedWebsites.map((w) => w.category))]
    setCategories(["全部", ...uniqueCategories])
  }

  // 切换注释显示状态
  const toggleNotesVisibility = () => {
    setShowNotes(!showNotes)
  }

  const hasNotesCount = filteredWebsites.filter((w) => w.notes && w.notes.trim()).length

  // 新网站的默认数据
  const newWebsiteTemplate: WebsiteData = {
    id: 0,
    name: "",
    url: "",
    category: "其他",
    notes: "",
    color: "bg-blue-500",
    frequency: "中",
    clicks: 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="border-b bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 theme-gradient rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold theme-text">NaviAI</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeSelector currentTheme={currentTheme} onThemeChange={setTheme} />
            <Button variant="outline" size="sm" asChild className="border-white/30 text-white hover:bg-white/10">
              <Link href="/chat">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI优化
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 页面标题和控制区域 */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold theme-text">我的智能导航</h1>
              <p className="text-gray-300 mt-1 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                由AI智能分析生成，支持自定义编辑
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="搜索网站..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* 控制面板 */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            {/* 分类筛选 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === category ? "theme-gradient" : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* 控制选项 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="group-related" checked={groupRelated} onCheckedChange={setGroupRelated} />
                <Label htmlFor="group-related" className="text-sm text-gray-300 cursor-pointer">
                  <Link2 className="w-4 h-4 inline mr-1" />
                  分组显示相关页面
                </Label>
              </div>

              <div className="text-sm text-gray-400">
                {hasNotesCount}/{filteredWebsites.length} 个网站有注释
              </div>

              <TooltipProvider>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleNotesVisibility}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  {showNotes ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  {showNotes ? "隐藏注释" : "显示注释"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddDialogOpen(true)}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加网站
                </Button>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* 网站网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* 快速添加组件 */}
          <QuickAddWidget onAddWebsite={handleAddWebsite} />

          {groupedWebsites.map((group) => (
            <WebsiteCard
              key={`${group.main.id}-${group.main.notes}-${showNotes}`}
              website={group.main}
              showNotes={showNotes}
              onEdit={handleEditWebsite}
              onDelete={handleDeleteWebsite}
              relatedWebsites={group.related}
              isGrouped={groupRelated}
            />
          ))}
        </div>

        {/* 空状态 */}
        {groupedWebsites.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AlertCircle className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-300 mb-2">没有找到匹配的网站</h3>
            <p className="text-gray-400">尝试调整搜索条件或分类筛选</p>
            <Button className="mt-4 theme-gradient" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              添加新网站
            </Button>
          </div>
        )}

        {/* AI建议卡片 */}
        <Card className="mt-8 border-purple-200/20 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-white/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 theme-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">💡 AI 智能建议</h3>
                <p className="text-gray-300 text-sm mb-3">
                  根据AI分析，你的网站已经按照使用频率和功能进行了智能分类。
                  {hasNotesCount > 0 && ` AI已为${hasNotesCount}个网站生成了智能注释，帮助你快速识别网站用途。`}
                  {groupRelated && " 相同域名的页面会自动分组显示，方便管理相关页面。"}
                  现在你可以自由编辑每个网站的名称、分类和注释，打造专属导航体验。
                </p>
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href="/chat">
                    与AI对话优化 <MessageCircle className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 添加网站对话框 */}
      <WebsiteEditDialog
        website={newWebsiteTemplate}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddWebsite}
      />
    </div>
  )
}
