"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { colorThemes, type ColorTheme } from "./theme-selector"

interface ThemeContextType {
  currentTheme: ColorTheme
  setTheme: (theme: ColorTheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(colorThemes[0])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 从localStorage加载保存的主题
    const savedTheme = localStorage.getItem("naviAI-theme")
    if (savedTheme) {
      const theme = colorThemes.find((t) => t.id === savedTheme)
      if (theme) {
        setCurrentTheme(theme)
      }
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // 更新CSS变量
    const root = document.documentElement
    root.style.setProperty("--theme-primary", currentTheme.colors.primary)
    root.style.setProperty("--theme-secondary", currentTheme.colors.secondary)
    root.style.setProperty("--theme-accent", currentTheme.colors.accent)

    // 保存到localStorage
    localStorage.setItem("naviAI-theme", currentTheme.id)
  }, [currentTheme, mounted])

  const setTheme = (theme: ColorTheme) => {
    setCurrentTheme(theme)
  }

  return <ThemeContext.Provider value={{ currentTheme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
