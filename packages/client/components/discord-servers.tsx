'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Bot, Crown, ExternalLink } from "lucide-react"
import { type DiscordGuild } from "@/lib/auth"

interface GuildWithTickets extends DiscordGuild {
  activeTickets?: number;
}

export function DiscordServers() {
  const [servers, setServers] = useState<GuildWithTickets[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      }
    } catch (err) {
      console.error('Failed to generate bot invite:', err);
    }
  };

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        const response = await fetch("/api/guilds");
        if (!response.ok) {
          throw new Error("Failed to fetch guilds");
        }
        const data = await response.json();
        setServers(data);

        // Fetch active tickets for each server
        const ticketPromises = data.map(async (server: GuildWithTickets) => {
          const ticketResponse = await fetch(`/api/guilds/${server.id}`);
          if (ticketResponse.ok) {
            const ticketData = await ticketResponse.json();
            return { ...server, activeTickets: ticketData.activeTickets };
          }
          return server;
        });

        const serversWithTickets = await Promise.all(ticketPromises);
        setServers(serversWithTickets);

      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuilds();
  }, []);

  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-white">Your Discord Servers</CardTitle>
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