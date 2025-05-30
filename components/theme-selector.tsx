"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Palette, Check, Sparkles, Eye } from "lucide-react"
import { useState, useEffect } from "react"

export interface ColorTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  gradient: string
  description: string
  eyeFriendly?: boolean
}

export const colorThemes: ColorTheme[] = [
  {
    id: "starry-night",
    name: "星空夜语",
    colors: {
      primary: "139, 92, 246", // violet-500
      secondary: "59, 130, 246", // blue-500
      accent: "168, 85, 247", // purple-500
    },
    gradient: "from-violet-500 to-blue-500",
    description: "深邃星空，护眼首选",
    eyeFriendly: true,
  },
  {
    id: "dreamy-purple",
    name: "梦幻紫境",
    colors: {
      primary: "147, 51, 234", // purple-600
      secondary: "124, 58, 237", // violet-600
      accent: "99, 102, 241", // indigo-500
    },
    gradient: "from-purple-600 to-violet-600",
    description: "柔和梦幻，舒缓视觉",
    eyeFriendly: true,
  },
  {
    id: "forest-green",
    name: "森林护眼",
    colors: {
      primary: "34, 197, 94", // green-500
      secondary: "16, 185, 129", // emerald-500
      accent: "20, 184, 166", // teal-500
    },
    gradient: "from-green-500 to-emerald-500",
    description: "自然绿色，保护视力",
    eyeFriendly: true,
  },
  {
    id: "midnight-blue",
    name: "午夜蓝调",
    colors: {
      primary: "59, 130, 246", // blue-500
      secondary: "6, 182, 212", // cyan-500
      accent: "8, 145, 178", // cyan-600
    },
    gradient: "from-blue-500 to-cyan-500",
    description: "深海蓝调，宁静护眼",
    eyeFriendly: true,
  },
  {
    id: "warm-amber",
    name: "暖夜琥珀",
    colors: {
      primary: "245, 158, 11", // amber-500
      secondary: "251, 191, 36", // amber-400
      accent: "217, 119, 6", // amber-600
    },
    gradient: "from-amber-500 to-yellow-500",
    description: "温暖琥珀，减少蓝光",
    eyeFriendly: true,
  },
  {
    id: "rose-gold",
    name: "玫瑰金辉",
    colors: {
      primary: "244, 63, 94", // rose-500
      secondary: "251, 113, 133", // rose-400
      accent: "225, 29, 72", // rose-600
    },
    gradient: "from-rose-500 to-pink-500",
    description: "优雅玫瑰，柔和视觉",
    eyeFriendly: true,
  },
]

interface ThemeSelectorProps {
  currentTheme: ColorTheme
  onThemeChange: (theme: ColorTheme) => void
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [particlesEnabled, setParticlesEnabled] = useState(true)

  useEffect(() => {
    const savedParticlesSetting = localStorage.getItem("naviAI-particles-enabled")
    if (savedParticlesSetting !== null) {
      setParticlesEnabled(savedParticlesSetting === "true")
    }
  }, [])

  const toggleParticles = () => {
    const newValue = !particlesEnabled
    setParticlesEnabled(newValue)
    localStorage.setItem("naviAI-particles-enabled", String(newValue))

    const event = new CustomEvent("toggleParticles", { detail: { enabled: newValue } })
    document.dispatchEvent(event)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Palette className="w-4 h-4" />
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: `linear-gradient(45deg, rgb(${currentTheme.colors.primary}), rgb(${currentTheme.colors.secondary}))`,
            }}
          />
          主题
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-gray-900/95 border-gray-700 text-white">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            护眼主题选择
          </h3>

          <div className="flex items-center space-x-2 mb-4">
            <Switch id="particles-mode" checked={particlesEnabled} onCheckedChange={toggleParticles} />
            <Label htmlFor="particles-mode" className="flex items-center gap-2 cursor-pointer text-gray-300">
              <Sparkles className="w-4 h-4" />
              粒子跟随效果
            </Label>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {colorThemes.map((theme) => (
              <Card
                key={theme.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md bg-gray-800/50 border-gray-700 ${
                  currentTheme.id === theme.id ? "ring-2 ring-offset-2 ring-offset-gray-900" : ""
                }`}
                style={{
                  ringColor: currentTheme.id === theme.id ? `rgb(${theme.colors.primary})` : undefined,
                }}
                onClick={() => onThemeChange(theme)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white">{theme.name}</span>
                      {theme.eyeFriendly && <Eye className="w-3 h-3 text-green-400" />}
                    </div>
                    {currentTheme.id === theme.id && (
                      <Check className="w-4 h-4" style={{ color: `rgb(${theme.colors.primary})` }} />
                    )}
                  </div>
                  <div
                    className="w-full h-6 rounded-md mb-2"
                    style={{
                      background: `linear-gradient(45deg, rgb(${theme.colors.primary}), rgb(${theme.colors.secondary}))`,
                    }}
                  />
                  <p className="text-xs text-gray-400">{theme.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
