"use client"

import { useEffect, useState } from "react"

export default function MouseGlow() {
  // 简化版本，只保留一个非常微妙的光效，或者完全移除
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseEnter = () => {
      setIsVisible(true)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [])

  // 暂时返回null，完全移除光晕效果
  return null

  // 如果需要保留一个非常微妙的光效，可以使用下面的代码：
  /*
  return (
    <div
      className={`fixed pointer-events-none z-[9995] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        left: mousePosition.x,
        top: mousePosition.y,
        width: "200px",
        height: "200px",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, rgba(147, 51, 234, 0.05) 0%, transparent 70%)",
        borderRadius: "50%",
        filter: "blur(2px)",
      }}
    />
  )
  */
}
