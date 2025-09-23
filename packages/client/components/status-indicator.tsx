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

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "loading":
        return "bg-yellow-500 animate-pulse"
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

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="text-xs text-muted-foreground">{getStatusText()}</span>
      </div>
      {status === "online" && <span className="text-xs text-muted-foreground">{ping}ms</span>}
    </div>
  )
}
