import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "API诊断测试 - NaviAI",
  description: "诊断API配置问题",
}

export default function SimpleTestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
