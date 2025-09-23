"use client"

import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/status-indicator"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleDiscordLogin = () => {
    // Simulate login - in real app this would redirect to Discord OAuth
    setIsLoggedIn(true)
  }

  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-E2iIA8pzOyl01u81dqxuvpdaIFBzsi.png"
              alt="TicketMesh Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-foreground">TicketMesh</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/documentation" className="text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            {isLoggedIn && (
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            )}
            <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
              Support
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              <StatusIndicator service="bot" />
              <StatusIndicator service="web" />
            </div>

            <Button
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
              onClick={handleDiscordLogin}
            >
              {isLoggedIn ? "Logged in to Discord" : "Login to Discord"}
            </Button>
          </div>
        </div>

        <div className="lg:hidden flex items-center justify-center space-x-6 mt-3 pt-3 border-t border-border/30">
          <StatusIndicator service="bot" />
          <StatusIndicator service="web" />
        </div>
      </div>
    </header>
  )
}
