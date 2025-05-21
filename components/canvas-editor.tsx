"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"

export function CanvasEditor({ canvasId }: { canvasId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)
  const [scale, setScale] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [tool, setTool] = useState<"pen" | "eraser" | "text" | "pan">("pen")
  const isMobile = useMobile()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Draw some example content
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(100, 100, 200, 150)

    ctx.font = "16px sans-serif"
    ctx.fillStyle = "#000"
    ctx.fillText("Project Brainstorming", 120, 130)

    ctx.beginPath()
    ctx.moveTo(120, 140)
    ctx.lineTo(280, 140)
    ctx.strokeStyle = "#ddd"
    ctx.stroke()

    ctx.font = "14px sans-serif"
    ctx.fillText("• Voice Interface", 120, 170)
    ctx.fillText("• AI Integration", 120, 190)
    ctx.fillText("• Canvas Features", 120, 210)

    // Draw connection lines
    ctx.beginPath()
    ctx.moveTo(300, 150)
    ctx.lineTo(400, 100)
    ctx.strokeStyle = "#6366f1"
    ctx.stroke()

    ctx.fillStyle = "#e0e7ff"
    ctx.fillRect(400, 70, 150, 60)
    ctx.fillStyle = "#000"
    ctx.fillText("Speech Recognition", 410, 100)

    ctx.beginPath()
    ctx.moveTo(300, 170)
    ctx.lineTo(400, 200)
    ctx.strokeStyle = "#6366f1"
    ctx.stroke()

    ctx.fillStyle = "#e0e7ff"
    ctx.fillRect(400, 170, 150, 60)
    ctx.fillStyle = "#000"
    ctx.fillText("Smart Suggestions", 410, 200)
  }, [canvasId])

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === "pan") return

    const canvas = canvasRef.current
    if (!canvas) return

    setIsDrawing(true)

    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    const x = (clientX - rect.left) / scale - offsetX
    const y = (clientY - rect.top) / scale - offsetY

    setLastX(x)
    setLastY(y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === "pan") return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let clientX, clientY

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const rect = canvas.getBoundingClientRect()
    const x = (clientX - rect.left) / scale - offsetX
    const y = (clientY - rect.top) / scale - offsetY

    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.strokeStyle = tool === "eraser" ? "#fff" : "#000"
    ctx.lineWidth = tool === "eraser" ? 20 : 2
    ctx.stroke()

    setLastX(x)
    setLastY(y)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleReset = () => {
    setScale(1)
    setOffsetX(0)
    setOffsetY(0)
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute touch-none"
        style={{
          transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
          transformOrigin: "0 0",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform items-center gap-2 rounded-lg border bg-background p-2 shadow-md">
        <Button
          variant={tool === "pen" ? "default" : "ghost"}
          size="icon"
          onClick={() => setTool("pen")}
          className="h-8 w-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </Button>
        <Button
          variant={tool === "eraser" ? "default" : "ghost"}
          size="icon"
          onClick={() => setTool("eraser")}
          className="h-8 w-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
            <path d="M22 21H7" />
            <path d="m5 11 9 9" />
          </svg>
        </Button>
        <Button
          variant={tool === "text" ? "default" : "ghost"}
          size="icon"
          onClick={() => setTool("text")}
          className="h-8 w-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
          </svg>
        </Button>
        <Button
          variant={tool === "pan" ? "default" : "ghost"}
          size="icon"
          onClick={() => setTool("pan")}
          className="h-8 w-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
            <path d="m12 12 4 10 1.7-4.3L22 16Z" />
          </svg>
        </Button>
        <div className="mx-1 h-6 w-px bg-border"></div>
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
            <line x1="8" x2="14" y1="11" y2="11" />
          </svg>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2 text-xs">
          {Math.round(scale * 100)}%
        </Button>
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
            <line x1="11" x2="11" y1="8" y2="14" />
            <line x1="8" x2="14" y1="11" y2="11" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
