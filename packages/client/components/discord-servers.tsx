'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { Bot, Crown, ExternalLink, RefreshCw } from "lucide-react"
import { type DiscordGuild } from "@/lib/auth"
import { signOut, signIn } from "next-auth/react"

interface GuildWithTickets extends DiscordGuild {
  activeTickets?: number;
}

export function DiscordServers() {
  const [servers, setServers] = useState<GuildWithTickets[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const pollTimerRef = useRef<NodeJS.Timer | null>(null);

  const generateBotInvite = async (guildId: string) => {
    try {
      const response = await fetch('/api/discord/bot/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId }),
      });
      
      if (response.ok) {
        const { inviteUrl } = await response.json();
        window.open(inviteUrl, '_blank');

        // Short-lived polling to detect bot joining the guild after invite
        try {
          let attempts = 0;
          const maxAttempts = 12; // ~1 minute
          const intervalMs = 5000;

          const poll = async () => {
            attempts += 1;
            try {
              const presenceRes = await fetch('/api/discord/bot/presence', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guildIds: [guildId] }),
              });
              if (presenceRes.ok) {
                const data = await presenceRes.json();
                const checks = Array.isArray(data) ? data : data.presenceChecks;
                const found = Array.isArray(checks) ? checks.find((c: any) => c.guildId === guildId) : null;
                const present = Boolean(found?.present);
                if (present) {
                  setServers(prev => prev.map(s => s.id === guildId ? { ...s, bot_present: true } : s));
                  return true;
                }
              }
            } catch {}
            return false;
          };

          const interval = setInterval(async () => {
            const done = await poll();
            if (done || attempts >= maxAttempts) {
              clearInterval(interval);
            }
          }, intervalMs);
        } catch {}
      }
    } catch (err) {
      console.error('Failed to generate bot invite:', err);
    }
  };

  const fetchGuilds = useCallback(async (options?: { fresh?: boolean }) => {
    const fresh = options?.fresh ?? false;
    try {
      if (!loading) setRefreshing(true);
      const response = await fetch(`/api/guilds${fresh ? '?fresh=1' : ''}`, { cache: fresh ? 'no-store' : 'default' });
      
      // Check if we got cached data (indicated by X-From-Cache header)
      const fromCache = response.headers.get('X-From-Cache');
      const isStale = fromCache === 'stale';
      
      if (!response.ok) {
        // If we have existing servers data, don't show error - just log it
        if (servers.length > 0) {
          console.warn("Failed to fetch fresh guilds, using existing data");
          return;
        }
        throw new Error("Failed to fetch guilds");
      }
      
      const data = await response.json();
      setServers(data);
      
      // Clear any previous errors if we got data
      if (data && data.length >= 0) {
        setError(null);
        console.log(`✅ Successfully loaded ${data.length} guilds`);
      }

      // Fetch active tickets for each server
      const ticketPromises = data.map(async (server: GuildWithTickets) => {
        try {
          const ticketResponse = await fetch(`/api/guilds/${server.id}`, { cache: 'no-store' });
          if (ticketResponse.ok) {
            const ticketData = await ticketResponse.json();
            return { ...server, activeTickets: ticketData.activeTickets };
          }
        } catch {}
        return server;
      });

      const serversWithTickets = await Promise.all(ticketPromises);
      setServers(serversWithTickets);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      
      // Only set error if we don't have any existing data
      if (servers.length === 0) {
        setError(message);
        console.error("Guild fetch failed with no existing data:", message);
      } else {
        // If we have existing data, just log the error but don't show it to user
        console.warn("Guild fetch error (using existing data):", message);
        // Explicitly clear any previous error since we have data
        setError(null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading, servers]);

  useEffect(() => {
    // Initial load - try fresh first, then fallback to cached
    const initialLoad = async () => {
      try {
        await fetchGuilds({ fresh: true });
      } catch (err) {
        // If fresh fails, try without fresh flag to get cached data
        console.warn("Fresh load failed, trying cached data");
        try {
          await fetchGuilds({ fresh: false });
        } catch (cachedErr) {
          console.error("Both fresh and cached loads failed:", cachedErr);
        }
      }
    };
    
    initialLoad();
    
    // Start background polling every 20s for near real-time updates
    pollTimerRef.current = setInterval(() => {
      fetchGuilds({ fresh: true });
    }, 20000);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [fetchGuilds]);

  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Your Discord Servers</CardTitle>
        <Button variant="outline" size="sm" className="border-zinc-600 hover:bg-zinc-700" onClick={() => fetchGuilds({ fresh: true })} disabled={refreshing}>
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && <p>Loading servers...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {servers.map((server) => (
            <div key={server.id} className="flex items-center justify-between p-3 rounded-md hover:bg-zinc-700/50 border border-zinc-700/50">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center mr-4 relative">
                  {server.icon ? (
                    <Image
                      src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}
                      alt={`${server.name} icon`}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="font-bold text-lg">{server.name.charAt(0)}</span>
                  )}
                  {server.owner && (
                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{server.name}</span>
                    {server.owner && (
                      <Badge variant="secondary" className="text-xs">
                        Owner
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {server.activeTickets ?? 0} active tickets
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Bot className="w-3 h-3" />
                    <span className={`text-xs ${server.bot_present ? 'text-green-400' : 'text-red-400'}`}>
                      Bot {server.bot_present ? 'Active' : 'Not Added'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!server.bot_present ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                    onClick={() => generateBotInvite(server.id)}
                  >
                    <Bot className="w-4 h-4 mr-1" />
                    Add Bot
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="border-zinc-600 hover:bg-zinc-700">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Manage
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}