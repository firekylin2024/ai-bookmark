import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ParticleEffect from "@/components/particle-effect"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NaviAI - 智能个人导航系统",
  description: "使用AI智能分析和个性化推荐，将你的书签转化为美观、高效的个人导航页面",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <Script
          defer
          data-domain="luck6.kylintest.space"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ParticleEffect />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
