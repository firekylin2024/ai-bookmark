"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
  twinklePhase: number
}

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 初始化星星
    const initStars = () => {
      starsRef.current = []
      const starCount = 150

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        })
      }
    }

    // 绘制星星
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach((star) => {
        // 闪烁效果
        star.twinklePhase += star.twinkleSpeed
        const twinkle = Math.sin(star.twinklePhase) * 0.3 + 0.7

        ctx.save()
        ctx.globalAlpha = star.opacity * twinkle
        ctx.fillStyle = "#ffffff"
        ctx.shadowBlur = star.size * 2
        ctx.shadowColor = "#ffffff"

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // 添加十字星芒效果给较大的星星
        if (star.size > 1.5) {
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 0.5
          ctx.globalAlpha = star.opacity * twinkle * 0.6

          ctx.beginPath()
          ctx.moveTo(star.x - star.size * 3, star.y)
          ctx.lineTo(star.x + star.size * 3, star.y)
          ctx.moveTo(star.x, star.y - star.size * 3)
          ctx.lineTo(star.x, star.y + star.size * 3)
          ctx.stroke()
        }

        ctx.restore()
      })
    }

    const animate = () => {
      drawStars()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9990]"
      style={{ opacity: 0.6 }}
    />
  )
}
