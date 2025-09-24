"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { DiscordGuild } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import {
  Shield,
  Users,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Plus,
  Settings,
  Server,
  Hash,
  Volume2,
  Activity,
  Calendar,
  BarChart3,
} from "lucide-react"
import { useState, useEffect } from "react"

interface ServerInfoProps {
  guilds: DiscordGuild[]
  selectedGuild: DiscordGuild | null
  onGuildSelect: (guildId: string | null) => void
}

interface ServerDetails {
  id: string
  name: string
  icon: string | null
  description?: string
  member_count: number
  presence_count: number
  channels: {
    text: any[]
    voice: any[]
    categories: any[]
    total: number
  }
  roles: any[]
  features: string[]
  verification_level: number
  premium_tier: number
  premium_subscription_count?: number
  banner?: string
  owner_id: string
  statistics: {
    memberCount: number
    onlineCount: number
    textChannels: number
    voiceChannels: number
    roles: number
    premiumTier: number
    premiumSubscriptions: number
  }
}

interface BotStatus {
  present: boolean
  permissions: string[]
  roles: string[]
  joinedAt?: string
  lastSeen?: string
  commands: {
    total: number
    enabled: number
    disabled: number
  }
  tickets: {
    total: number
    open: number
    closed: number
    thisMonth: number
  }
}

export function ServerInfo({ guilds, selectedGuild, onGuildSelect }: ServerInfoProps) {
  const { refreshGuilds, checkBotPresence } = useAuth()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [serverDetails, setServerDetails] = useState<ServerDetails | null>(null)
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [isCheckingPresence, setIsCheckingPresence] = useState(false)

  useEffect(() => {
    if (selectedGuild) {
      fetchServerDetails(selectedGuild.id)
    } else {
      setServerDetails(null)
      setBotStatus(null)
    }
  }, [selectedGuild])

  const fetchServerDetails = async (guildId: string) => {
    setIsLoadingDetails(true)
    try {
      const [detailsResponse, botResponse] = await Promise.all([
        fetch(`/api/discord/server/${guildId}`),
        fetch(`/api/discord/server/${guildId}/bot-status`),
      ])

      if (detailsResponse.ok) {
        const details = await detailsResponse.json()
        setServerDetails(details)
      }

      if (botResponse.ok) {
        const status = await botResponse.json()
        setBotStatus(status)
      }
    } catch (error) {
      console.error("Failed to fetch server details:", error)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshGuilds()
    if (selectedGuild) {
      await fetchServerDetails(selectedGuild.id)
    }
    setIsRefreshing(false)
  }

  const handleInviteBot = async (guildId: string) => {
    try {
      const response = await fetch("/api/discord/bot/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guildId }),
      })

      if (response.ok) {
        const data = await response.json()
        window.open(data.inviteUrl, "_blank")

        // Check bot presence after a delay to see if user added the bot
        setTimeout(async () => {
          setIsCheckingPresence(true)
          await checkBotPresence([guildId])
          setIsCheckingPresence(false)
        }, 5000)
      }
    } catch (error) {
      console.error("Failed to generate invite URL:", error)
    }
  }

  const handleCheckBotPresence = async () => {
    if (!selectedGuild) return

    setIsCheckingPresence(true)
    await checkBotPresence([selectedGuild.id])
    await fetchServerDetails(selectedGuild.id)
    setIsCheckingPresence(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Server Information</h1>
          <p className="text-muted-foreground">
            View detailed information about your Discord servers and TicketMesh integration status.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {selectedGuild && (
            <Button
              onClick={handleCheckBotPresence}
              disabled={isCheckingPresence}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-transparent"
            >
              <CheckCircle className={`h-4 w-4 ${isCheckingPresence ? "animate-spin" : ""}`} />
              <span>Check Bot</span>
            </Button>
          )}

          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="flex items-center space-x-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Servers ({guilds.length})</CardTitle>
              <CardDescription>Click on a server to view details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {guilds.map((guild) => (
                <button
                  key={guild.id}
                  onClick={() => onGuildSelect(selectedGuild?.id === guild.id ? null : guild.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    selectedGuild?.id === guild.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {guild.icon ? (
                      <Image
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                        alt={guild.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-primary-foreground">{guild.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium text-foreground truncate">{guild.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {guild.bot_present ? (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Added
                        </Badge>
                      )}
                      {guild.owner && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Owner
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedGuild ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    {selectedGuild.icon ? (
                      <Image
                        src={`https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png`}
                        alt={selectedGuild.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-primary-foreground">
                          {selectedGuild.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-xl">{selectedGuild.name}</CardTitle>
                      <CardDescription>Server ID: {selectedGuild.id}</CardDescription>
                      {serverDetails?.description && (
                        <p className="text-sm text-muted-foreground mt-1">{serverDetails.description}</p>
                      )}
                    </div>
                    {isLoadingDetails && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {serverDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            {serverDetails.statistics.memberCount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Total Members</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            {serverDetails.statistics.onlineCount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Online Now</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-secondary" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{serverDetails.statistics.textChannels}</p>
                          <p className="text-xs text-muted-foreground">Text Channels</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{serverDetails.statistics.voiceChannels}</p>
                          <p className="text-xs text-muted-foreground">Voice Channels</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {botStatus && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>Bot Status</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        {botStatus.present ? (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            <XCircle className="h-3 w-3 mr-1" />
                            Not Present
                          </Badge>
                        )}
                      </div>

                      {botStatus.present && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Joined</span>
                            <span className="text-sm text-foreground">
                              {botStatus.joinedAt && formatDate(botStatus.joinedAt)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last Seen</span>
                            <span className="text-sm text-foreground">
                              {botStatus.lastSeen && formatDate(botStatus.lastSeen)}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Commands</span>
                              <span className="text-sm text-foreground">
                                {botStatus.commands.enabled}/{botStatus.commands.total}
                              </span>
                            </div>
                            <Progress
                              value={(botStatus.commands.enabled / botStatus.commands.total) * 100}
                              className="h-2"
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Ticket Statistics</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{botStatus.tickets.total}</p>
                          <p className="text-xs text-muted-foreground">Total Tickets</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-500">{botStatus.tickets.open}</p>
                          <p className="text-xs text-muted-foreground">Open</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-muted-foreground">{botStatus.tickets.closed}</p>
                          <p className="text-xs text-muted-foreground">Closed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-secondary">{botStatus.tickets.thisMonth}</p>
                          <p className="text-xs text-muted-foreground">This Month</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                {!selectedGuild.bot_present ? (
                  <Button onClick={() => handleInviteBot(selectedGuild.id)} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add TicketMesh</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => onGuildSelect(selectedGuild.id)}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Configure Bot</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  onClick={() => window.open(`https://discord.com/channels/${selectedGuild.id}`, "_blank")}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open in Discord</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCheckBotPresence}
                  disabled={isCheckingPresence}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <RefreshCw className={`h-4 w-4 ${isCheckingPresence ? "animate-spin" : ""}`} />
                  <span>Refresh Status</span>
                </Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a Server</h3>
                  <p className="text-muted-foreground">
                    Choose a server from the list to view detailed information and manage TicketMesh integration.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
