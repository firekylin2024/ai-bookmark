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
          data-domain="smartbookmark.me"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />

        <Script
          id="microsoft-clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){ c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i; y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y); })(window, document, "clarity", "script", "ru78p8nray");
            `,
          }}
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
