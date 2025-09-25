"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Github, Twitter, MessageCircle, Mail, Heart } from "lucide-react"
import { DiscordServerWidget } from "@/components/discord-server-widget"
import { DiscordInviteWidget } from "@/components/discord-invite-widget"
import { useEffect, useState } from "react"

interface CommunityStats {
  memberCount: number;
  onlineCount: number;
  dailyMessages: number;
}

export function Footer() {
  const [stats, setStats] = useState<CommunityStats>({
    memberCount: 0,
    onlineCount: 0,
    dailyMessages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/discord-server-stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            memberCount: data.memberCount || 0,
            onlineCount: data.onlineCount || 0,
            dailyMessages: data.ticketsProcessed || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch community stats:', error);
        // Keep default values
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return num.toString();
  };

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
        {/* Discord Server Widget Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with other users, get support, and stay updated with the latest TicketMesh news and features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Features Section */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10l-1-2H9.5l-1 2v2h2v8h2v-6h2v6h2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Active Community</h3>
                      <p className="text-muted-foreground text-sm">
                        Connect with Discord server owners and moderators who are actively using TicketMesh.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">24/7 Support</h3>
                      <p className="text-muted-foreground text-sm">
                        Get help from our community and support team whenever you need it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Early Access</h3>
                      <p className="text-muted-foreground text-sm">
                        Be the first to try new features and updates before they're released.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500 mb-1">
                    {loading ? '...' : formatNumber(stats.memberCount)}
                  </div>
                  <div className="text-sm text-muted-foreground">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500 mb-1">
                    {loading ? '...' : '24/7'}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500 mb-1">
                    {loading ? '...' : formatNumber(stats.dailyMessages)}
                  </div>
                  <div className="text-sm text-muted-foreground">Tickets Processed</div>
                </div>
              </div>
            </div>

            {/* Discord Widget */}
            <div className="flex justify-center lg:justify-end">
              <DiscordServerWidget 
                serverId="1420828084805959702" 
                theme="dark"
                width={350}
                height={500}
                className="shadow-2xl shadow-primary/20"
              />
            </div>
          </div>
        </div>

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
