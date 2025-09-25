"use client"

import { useState, useEffect } from "react"

interface StatusIndicatorProps {
  service: "bot" | "web"
  className?: string
}

export function StatusIndicator({ service, className = "" }: StatusIndicatorProps) {
  const [status, setStatus] = useState<"online" | "offline" | "loading">("loading")
  const [ping, setPing] = useState<number>(0)

  useEffect(() => {
    // Simulate health check
    const checkHealth = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

        // Simulate random status (mostly online)
        const isOnline = Math.random() > 0.1 // 90% chance of being online
        setStatus(isOnline ? "online" : "offline")

        // Simulate ping time
        if (isOnline) {
          setPing(Math.floor(Math.random() * 100) + 20) // 20-120ms
        }
      } catch {
        setStatus("offline")
      }
    }

    checkHealth()

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusConfig = () => {
    switch (status) {
      case "online":
        return {
          dotColor: "bg-green-500",
          glowColor: "shadow-green-500/50",
          textColor: "text-green-400",
          pulse: "animate-pulse"
        }
      case "offline":
        return {
          dotColor: "bg-red-500",
          glowColor: "shadow-red-500/50",
          textColor: "text-red-400",
          pulse: ""
        }
      case "loading":
        return {
          dotColor: "bg-yellow-500",
          glowColor: "shadow-yellow-500/50",
          textColor: "text-yellow-400",
          pulse: "animate-pulse"
        }
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "online":
        return `${service === "bot" ? "Bot" : "Web"} Online`
      case "offline":
        return `${service === "bot" ? "Bot" : "Web"} Offline`
      case "loading":
        return "Checking..."
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full bg-muted/30 backdrop-blur-sm border border-border/50 transition-all duration-200 hover:bg-muted/50 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor} ${config.pulse}`} />
          <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${config.dotColor} opacity-30 ${config.pulse}`} />
        </div>
        <span className={`text-xs font-medium ${config.textColor}`}>{getStatusText()}</span>
      </div>
      {status === "online" && (
        <span className="text-xs text-muted-foreground/80 font-mono">
          {ping}ms
        </span>
      )}
    </div>
  )
}
