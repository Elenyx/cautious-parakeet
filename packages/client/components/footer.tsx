import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Github, Twitter, MessageCircle, Mail, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-background to-card/50 border-t border-border/50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-secondary rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-1/3 w-1 h-1 bg-secondary rounded-full animate-pulse delay-1500"></div>
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-primary rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-secondary rounded-full animate-pulse delay-3000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <Image
                  src="https://i.imgur.com/UDzjrCQ.png"
                  alt="TicketMesh Logo"
                  width={40}
                  height={40}
                  className="rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground tracking-tight">TicketMesh</span>
                <span className="text-xs text-muted-foreground/70 font-medium">Discord Bot</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              The most advanced Discord ticket management bot. Streamline your support, enhance your community.
            </p>
            <div className="flex space-x-2">
              <Button size="sm" variant="ghost" className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-200">
                <Github className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-200">
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 hover:bg-primary/10 hover:text-primary transition-all duration-200">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base mb-6 relative">
              Product
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base mb-6 relative">
              Support
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/support" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/discord" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Discord Server
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Status Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground text-base mb-6 relative">
              Legal
              <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:translate-x-1 inline-block">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border/30 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                © 2025 TicketMesh. All rights reserved.
              </div>
              <div className="w-6 h-6 rounded-full border border-border/50 bg-muted/30 flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">N</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for Discord communities</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
