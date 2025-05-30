"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Zap, Target, Palette } from "lucide-react"
import Link from "next/link"
import ThemeSelector from "@/components/theme-selector"
import { useTheme } from "@/components/theme-provider"
import StarryBackground from "@/components/starry-background"

function HeaderContent() {
  const { currentTheme, setTheme } = useTheme()

  return (
    <header className="border-b bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50 border-gray-700">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 theme-gradient rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold theme-text">NaviAI</span>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
            功能特色
          </Link>
          <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
            工作原理
          </Link>
          <ThemeSelector currentTheme={currentTheme} onThemeChange={setTheme} />
          <Button asChild className="theme-gradient">
            <Link href="/create">开始使用</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* 星空背景 */}
      <StarryBackground />

      <HeaderContent />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-sm font-medium mb-6 border border-white/20">
            <Sparkles className="w-4 h-4 mr-2" />
            AI驱动的智能导航
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 theme-text leading-tight">
            重新定义你的
            <br />
            网站导航体验
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            使用AI智能分析和个性化推荐，将你的书签转化为美观、高效的个人导航页面。让每次浏览都更加便捷。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="theme-gradient button-glow" asChild>
              <Link href="/create">
                立即开始 <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/50 text-white bg-transparent hover:bg-white/10 hover:border-white/70"
            >
              <Link href="/demo">查看演示</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">强大的功能特色</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            从智能分类到可视化分析，我们提供全方位的导航管理解决方案
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/10 backdrop-blur-sm card-glow-hover border border-white/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">智能导入</h3>
              <p className="text-gray-300 text-sm">支持手动输入、文件上传、批量粘贴等多种方式快速导入网站</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/10 backdrop-blur-sm card-glow-hover border border-white/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">AI智能分类</h3>
              <p className="text-gray-300 text-sm">自动识别网站类型，智能分组，生成最适合的导航布局</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/10 backdrop-blur-sm card-glow-hover border border-white/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">使用频率分析</h3>
              <p className="text-gray-300 text-sm">通过颜色渐变直观展示网站使用频率，突出常用网站</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white/10 backdrop-blur-sm card-glow-hover border border-white/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">个性化定制</h3>
              <p className="text-gray-300 text-sm">与AI对话调整布局，拖拽排序，打造专属个人导航页面</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-black/20 backdrop-blur-sm py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">简单三步，开始使用</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">无需复杂设置，几分钟内就能拥有专属的智能导航页面</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 theme-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">导入网站</h3>
              <p className="text-gray-300">通过多种方式快速导入你的常用网站和书签</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 theme-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI智能生成</h3>
              <p className="text-gray-300">AI自动分析分类，生成美观的个人导航页面</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 theme-gradient rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">个性化优化</h3>
              <p className="text-gray-300">与AI对话调整，拖拽排序，打造专属导航体验</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">准备好体验智能导航了吗？</h2>
          <p className="text-gray-300 text-lg mb-8">加入数千名用户，开始使用AI驱动的个性化导航系统</p>
          <Button size="lg" className="theme-gradient" asChild>
            <Link href="/create">
              免费开始使用 <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm text-white py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 theme-gradient rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">NaviAI</span>
            </div>
            <div className="text-gray-400 text-sm">© 2024 NaviAI. 让导航更智能，让浏览更高效。</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
