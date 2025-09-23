import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Github, Twitter, MessageCircle, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card/30 border-t border-border/50">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-E2iIA8pzOyl01u81dqxuvpdaIFBzsi.png"
                alt="TicketMesh Logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-lg font-bold text-foreground">TicketMesh</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The most advanced Discord ticket management bot. Streamline your support, enhance your community.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="ghost" className="p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2">
                <Github className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2">
                <MessageCircle className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#docs" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#community" className="text-muted-foreground hover:text-foreground transition-colors">
                  Discord Server
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#status" className="text-muted-foreground hover:text-foreground transition-colors">
                  Status Page
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#cookies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#dmca" className="text-muted-foreground hover:text-foreground transition-colors">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">© 2025 TicketMesh. All rights reserved.</div>
          <div className="text-sm text-muted-foreground">Made with ❤️ for Discord communities</div>
        </div>
      </div>
    </footer>
  )
}
