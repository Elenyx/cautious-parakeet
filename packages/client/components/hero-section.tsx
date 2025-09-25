"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Plus } from "lucide-react"
import { useEffect, useState } from "react"

interface GlobalStats {
  activeServers: number;
  totalTicketsProcessed: number;
  uptime: number;
  communityMembers: number;
  dailyMessages: number;
}

export function HeroSection() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/global-stats', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch global stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleAddToDiscord = async () => {
    try {
      const response = await fetch('/api/discord/bot/invite')
      const data = await response.json()
      if (data.inviteUrl) {
        window.open(data.inviteUrl, '_blank')
      }
    } catch (error) {
      console.error('Failed to get invite URL:', error)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M+`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K+`;
    }
    return num.toString();
  };
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-8">
            <span>🎫 Advanced Discord Ticket Management</span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
            Streamline Your Discord{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Support System
            </span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your Discord server into a professional support hub with TicketMesh. Advanced ticket management,
            automated workflows, and seamless user experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-orange group"
              onClick={handleAddToDiscord}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Discord
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground bg-transparent"
              onClick={() => window.open('https://discord.gg/EGnvFKd6p3', '_blank')}
            >
              Join Discord Community
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {loading ? '...' : stats ? formatNumber(stats.activeServers) : '0'}
              </div>
              <div className="text-muted-foreground">Active Servers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary mb-2">
                {loading ? '...' : stats ? formatNumber(stats.totalTicketsProcessed) : '0'}
              </div>
              <div className="text-muted-foreground">Tickets Processed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {loading ? '...' : stats ? `${stats.uptime.toFixed(1)}%` : '0%'}
              </div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
