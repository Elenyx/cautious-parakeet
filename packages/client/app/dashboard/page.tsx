'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/stats-card'
import { DiscordServers } from '@/components/discord-servers'
import { RecentActivity } from '@/components/recent-activity'
import { BarChart, CheckCircle, Clock, Server, Shield, Bot } from 'lucide-react'
import { type DiscordGuild } from '@/lib/auth'

interface Stats {
  activeTickets: number;
  connectedServers: number;
  resolvedToday: number;
  avgResponse: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/')
    },
  })
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownedCount, setOwnedCount] = useState<number>(0);
  const [botActiveCount, setBotActiveCount] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client flag to prevent hydration mismatch
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, guildsRes] = await Promise.all([
          fetch('/api/stats', { cache: 'no-store' }),
          fetch('/api/guilds?fresh=1', { cache: 'no-store' }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (guildsRes.ok) {
          const guilds: DiscordGuild[] = await guildsRes.json();
          const owned = guilds.filter(g => g.owner).length;
          const botActive = guilds.filter(g => g.bot_present).length;
          setOwnedCount(owned);
          setBotActiveCount(botActive);
        } else {
          // If guilds fetch fails, don't update counts but don't fail the entire stats fetch
          console.warn('Failed to fetch guilds for stats, keeping existing counts');
        }
      } catch (err: unknown) {
        console.error('Error fetching stats/guilds:', err instanceof Error ? err.message : err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // No auto-refresh to prevent rate limiting
    // Users can manually refresh the page if needed
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="container mx-auto px-6 lg:px-8 py-4">
      <h1 className="text-3xl font-bold">
        Welcome back, {isClient && session?.user?.name ? session.user.name : 'User'}! 👋
      </h1>
      <p className="text-zinc-400 mb-8">Manage your Discord servers and support tickets from this dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <StatsCard title="Active Tickets" value={loading ? '...' : String(stats?.activeTickets ?? 0)} icon={BarChart} />
        <StatsCard title="Connected Servers" value={loading ? '...' : String(stats?.connectedServers ?? 0)} icon={Server} />
        <StatsCard title="Resolved Today" value={loading ? '...' : String(stats?.resolvedToday ?? 0)} icon={CheckCircle} />
        <StatsCard title="Avg Response" value={loading ? '...' : `${String(stats?.avgResponse ?? 0)}m`} icon={Clock} />
        <StatsCard title="Owned Servers" value={loading ? '...' : String(ownedCount)} icon={Shield} />
        <StatsCard title="Bot Active" value={loading ? '...' : String(botActiveCount)} icon={Bot} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DiscordServers />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}