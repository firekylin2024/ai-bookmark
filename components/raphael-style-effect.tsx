"use client"

import { useEffect, useRef, useState } from "react"

export default function RaphaelStyleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isVisible) {
        // 创建类似Raphael AI的金黄色光效
        const gradient = ctx.createRadialGradient(
          mousePosition.x,
          mousePosition.y,
          0,
          mousePosition.x,
          mousePosition.y,
          200,
        )

        // 金黄色渐变，类似Raphael AI
        gradient.addColorStop(0, "rgba(255, 193, 7, 0.15)")
        gradient.addColorStop(0.3, "rgba(255, 193, 7, 0.08)")
        gradient.addColorStop(0.6, "rgba(255, 193, 7, 0.03)")
        gradient.addColorStop(1, "rgba(255, 193, 7, 0)")

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 添加内层更亮的光效
        const innerGradient = ctx.createRadialGradient(
          mousePosition.x,
          mousePosition.y,
          0,
          mousePosition.x,
          mousePosition.y,
          80,
        )

        innerGradient.addColorStop(0, "rgba(255, 193, 7, 0.25)")
        innerGradient.addColorStop(0.5, "rgba(255, 193, 7, 0.1)")
        innerGradient.addColorStop(1, "rgba(255, 193, 7, 0)")

        ctx.fillStyle = innerGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [mousePosition, isVisible])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9995]"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.3s ease",
        mixBlendMode: "screen", // 这个混合模式让光效更自然
      }}
    />
  )
}
