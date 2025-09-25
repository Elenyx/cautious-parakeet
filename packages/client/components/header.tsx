"use client"

import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/status-indicator"
import Image from "next/image"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="border-b border-border/50 backdrop-blur-md bg-background/90 sticky top-0 z-50 shadow-lg shadow-black/5">
      <div className="container mx-auto px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="https://i.imgur.com/UDzjrCQ.png"
                alt="TicketMesh Logo"
                width={44}
                height={44}
                className="rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground tracking-tight">TicketMesh</span>
              <span className="text-xs text-muted-foreground/70 font-medium">Discord Bot</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-muted/50 relative group"
            >
              Home
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-200 group-hover:w-full" />
            </Link>
            <Link 
              href="/features" 
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-muted/50 relative group"
            >
              Features
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-200 group-hover:w-full" />
            </Link>
            <Link 
              href="/documentation" 
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-muted/50 relative group"
            >
              Documentation
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-200 group-hover:w-full" />
            </Link>
            {session && (
              <Link 
                href="/dashboard" 
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-muted/50 relative group"
              >
                Dashboard
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-200 group-hover:w-full" />
              </Link>
            )}
            <Link 
              href="/support" 
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg hover:bg-muted/50 relative group"
            >
              Support
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary transition-all duration-200 group-hover:w-full" />
            </Link>
          </nav>

          {/* Right Side - Status & Auth */}
          <div className="flex items-center space-x-4">
            {/* Status Indicators - Desktop */}
            <div className="hidden lg:flex items-center space-x-3">
              <StatusIndicator service="bot" />
              <StatusIndicator service="web" />
            </div>

            {/* Auth Section */}
            {session ? (
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <Image
                    src={session.user?.image as string}
                    alt={session.user?.name as string}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-transparent group-hover:border-primary/50 transition-all duration-200"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-secondary/50 text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent transition-all duration-200 hover:scale-105"
                  onClick={() => signOut()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent transition-all duration-200 hover:scale-105 font-medium hover:border-primary"
                onClick={() => signIn("discord")}
              >
                Login to Discord
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/30 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/features" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/documentation" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              {session && (
                <Link 
                  href="/dashboard" 
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link 
                href="/support" 
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
            </nav>
            
            {/* Mobile Status Indicators */}
            <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-border/30">
              <StatusIndicator service="bot" />
              <StatusIndicator service="web" />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
