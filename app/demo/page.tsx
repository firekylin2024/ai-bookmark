import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import StarryBackground from "@/components/starry-background"

// 演示数据
const demoWebsites = [
  { id: 1, name: "Google", url: "https://www.google.com", category: "搜索引擎", clicks: 156, color: "bg-blue-500" },
  { id: 2, name: "GitHub", url: "https://www.github.com", category: "开发工具", clicks: 89, color: "bg-gray-800" },
  { id: 3, name: "YouTube", url: "https://www.youtube.com", category: "娱乐媒体", clicks: 134, color: "bg-red-500" },
  { id: 4, name: "Netflix", url: "https://www.netflix.com", category: "娱乐媒体", clicks: 67, color: "bg-red-600" },
  { id: 5, name: "Spotify", url: "https://www.spotify.com", category: "娱乐媒体", clicks: 45, color: "bg-green-500" },
  { id: 6, name: "Notion", url: "https://www.notion.so", category: "生产力工具", clicks: 78, color: "bg-gray-700" },
]

export default function DemoPage() {
  const getOpacity = (clicks: number) => {
    const maxClicks = Math.max(...demoWebsites.map((w) => w.clicks))
    return 0.3 + (clicks / maxClicks) * 0.7
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* 星空背景 */}
      <StarryBackground />

      {/* Header */}
      <header className="border-b bg-gray-900/80 backdrop-blur-sm border-gray-700 relative z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="border-white/30 text-white hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                NaviAI 演示
              </span>
            </div>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Link href="/create">开始创建</Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 演示说明 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            智能导航演示
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            这是一个由AI生成的个性化导航页面示例。颜色深浅代表使用频率，分类由AI智能识别。
          </p>
        </div>

        {/* 功能说明卡片 */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-purple-200/20 bg-purple-900/30 border border-white/20">
            <CardContent className="pt-6 text-center">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">AI</span>
              </div>
              <h3 className="font-semibold text-purple-300 mb-2">智能分类</h3>
              <p className="text-sm text-purple-200">AI自动识别网站类型并进行分类</p>
            </CardContent>
          </Card>

          <Card className="border-blue-200/20 bg-blue-900/30 border border-white/20">
            <CardContent className="pt-6 text-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">📊</span>
              </div>
              <h3 className="font-semibold text-blue-300 mb-2">使用频率</h3>
              <p className="text-sm text-blue-200">颜色深浅直观显示网站使用频率</p>
            </CardContent>
          </Card>

          <Card className="border-green-200/20 bg-green-900/30 border border-white/20">
            <CardContent className="pt-6 text-center">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">🎨</span>
              </div>
              <h3 className="font-semibold text-green-300 mb-2">个性化</h3>
              <p className="text-sm text-green-200">可拖拽排序，与AI对话调整布局</p>
            </CardContent>
          </Card>
        </div>

        {/* 演示导航页面 */}
        <Card className="shadow-xl border-0 bg-white/10 backdrop-blur-sm border border-white/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">我的个人导航</h2>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-400/30"
              >
                AI生成
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {demoWebsites.map((website) => (
                <Card
                  key={website.id}
                  className="group hover:shadow-lg transition-all duration-200 border-0 cursor-pointer bg-white/10 backdrop-blur-sm border border-white/20"
                  style={{
                    backgroundColor: `${website.color}${Math.round(getOpacity(website.clicks) * 255)
                      .toString(16)
                      .padStart(2, "0")}`,
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1 group-hover:text-yellow-200 transition-colors">
                          {website.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                          {website.category}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-sm text-white/80 mb-2 truncate">{website.url}</div>

                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span>点击: {website.clicks}次</span>
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full bg-white"
                          style={{ opacity: getOpacity(website.clicks) }}
                        ></div>
                        <span>频率</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-300 mb-4">这只是一个演示。创建你自己的智能导航，体验更多个性化功能！</p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                asChild
              >
                <Link href="/create">
                  立即创建我的导航 <Sparkles className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
