"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "./theme-provider"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  opacity: number
  color: string
  trail: { x: number; y: number; opacity: number }[]
}

export default function ParticleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)
  const lastEmitTimeRef = useRef<number>(0)
  const { currentTheme } = useTheme()

  // 创建粒子
  const createParticle = (x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 1.5 + 0.5
    const size = Math.random() * 4 + 2
    const maxLife = Math.random() * 60 + 40

    // 使用主题颜色
    const colors = [
      `${currentTheme.colors.primary}`,
      `${currentTheme.colors.secondary}`,
      `${currentTheme.colors.accent}`,
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size,
      life: 0,
      maxLife,
      opacity: Math.random() * 0.8 + 0.2,
      color,
      trail: [],
    }
  }

  // 更新粒子
  const updateParticles = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!isEnabled) {
      animationFrameRef.current = requestAnimationFrame(updateParticles)
      return
    }

    // 更新和绘制粒子
    particlesRef.current.forEach((particle, index) => {
      // 更新位置
      particle.x += particle.vx
      particle.y += particle.vy
      particle.life++

      // 添加轨迹点
      particle.trail.push({
        x: particle.x,
        y: particle.y,
        opacity: particle.opacity * (1 - particle.life / particle.maxLife),
      })

      // 限制轨迹长度
      if (particle.trail.length > 8) {
        particle.trail.shift()
      }

      // 绘制轨迹
      particle.trail.forEach((point, i) => {
        const trailOpacity = point.opacity * (i / particle.trail.length) * 0.5
        if (trailOpacity > 0.01) {
          ctx.save()
          ctx.globalAlpha = trailOpacity
          ctx.fillStyle = `rgba(${particle.color}, 1)`
          ctx.beginPath()
          ctx.arc(point.x, point.y, particle.size * (i / particle.trail.length), 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      // 绘制主粒子
      const currentOpacity = particle.opacity * (1 - particle.life / particle.maxLife)
      if (currentOpacity > 0.01) {
        ctx.save()
        ctx.globalAlpha = currentOpacity
        ctx.fillStyle = `rgba(${particle.color}, 1)`

        // 添加发光效果
        ctx.shadowBlur = particle.size * 3
        ctx.shadowColor = `rgba(${particle.color}, 0.8)`

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // 移除生命周期结束的粒子
      if (particle.life >= particle.maxLife) {
        particlesRef.current.splice(index, 1)
      }
    })

    // 生成新粒子
    const now = Date.now()
    if (isVisible && now - lastEmitTimeRef.current > 30) {
      lastEmitTimeRef.current = now

      // 在鼠标周围生成粒子
      const particleCount = Math.floor(Math.random() * 2) + 1
      for (let i = 0; i < particleCount; i++) {
        const offsetX = (Math.random() - 0.5) * 30
        const offsetY = (Math.random() - 0.5) * 30
        particlesRef.current.push(createParticle(mousePosition.x + offsetX, mousePosition.y + offsetY))
      }
    }

    // 限制粒子数量
    if (particlesRef.current.length > 100) {
      particlesRef.current = particlesRef.current.slice(-100)
    }

    animationFrameRef.current = requestAnimationFrame(updateParticles)
  }

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

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

    const handleToggleParticles = (e: Event) => {
      const customEvent = e as CustomEvent
      setIsEnabled(customEvent.detail.enabled)

      if (!customEvent.detail.enabled) {
        particlesRef.current = []
      }
    }

    // 从localStorage加载设置
    const savedParticlesSetting = localStorage.getItem("naviAI-particles-enabled")
    if (savedParticlesSetting !== null) {
      setIsEnabled(savedParticlesSetting === "true")
    }

    handleResize()

    window.addEventListener("resize", handleResize)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("toggleParticles", handleToggleParticles as EventListener)

    animationFrameRef.current = requestAnimationFrame(updateParticles)

    return () => {
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("toggleParticles", handleToggleParticles as EventListener)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  useEffect(() => {
    particlesRef.current = []
  }, [currentTheme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9996]"
      style={{ opacity: isEnabled ? 1 : 0, transition: "opacity 0.5s ease" }}
    />
  )
}
