"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import type { DiscordGuild } from "@/lib/auth"
import Image from "next/image"
import { Settings, Save, RotateCcw, Hash, Users, MessageSquare, Clock, X } from "lucide-react"
import { useState, useEffect } from "react"

interface CommandsConfigProps {
  guilds: DiscordGuild[]
  selectedGuild: DiscordGuild | null
  onGuildSelect: (guildId: string | null) => void
}

interface TicketConfig {
  guildId: string
  ticketCategory: string
  panelChannel: string
  transcriptChannel: string
  supportRoles: string[]
  welcomeMessage: string
  closeMessage: string
  maxTicketsPerUser: number
  autoCloseInactive: boolean
  inactiveTimeoutHours: number
  dmOnTicketCreate: boolean
  dmOnTicketClose: boolean
  logChannel?: string
  ticketNameFormat: string
  enableTranscripts: boolean
}

interface DiscordChannel {
  id: string
  name: string
  type: number
}

interface DiscordRole {
  id: string
  name: string
  color: number
  position: number
}

export function CommandsConfig({ guilds, selectedGuild, onGuildSelect }: CommandsConfigProps) {
  const [config, setConfig] = useState<TicketConfig>({
    guildId: "",
    ticketCategory: "defaultCategory",
    panelChannel: "defaultChannel",
    transcriptChannel: "defaultChannel",
    supportRoles: [],
    welcomeMessage: "Hello! Thank you for creating a support ticket. A staff member will assist you shortly.",
    closeMessage: "This ticket has been closed. Thank you for contacting support!",
    maxTicketsPerUser: 3,
    autoCloseInactive: false,
    inactiveTimeoutHours: 24,
    dmOnTicketCreate: true,
    dmOnTicketClose: true,
    ticketNameFormat: "ticket-{username}-{number}",
    enableTranscripts: true,
  })

  const [channels, setChannels] = useState<DiscordChannel[]>([])
  const [roles, setRoles] = useState<DiscordRole[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    if (selectedGuild) {
      loadGuildData(selectedGuild.id)
    } else {
      setChannels([])
      setRoles([])
      resetConfig()
    }
  }, [selectedGuild])

  const loadGuildData = async (guildId: string) => {
    setIsLoading(true)
    try {
      const [configResponse, serverResponse] = await Promise.all([
        fetch(`/api/discord/server/${guildId}/config`),
        fetch(`/api/discord/server/${guildId}`),
      ])

      if (configResponse.ok) {
        const configData = await configResponse.json()
        setConfig(configData)
      }

      if (serverResponse.ok) {
        const serverData = await serverResponse.json()
        setChannels([
          ...serverData.channels.categories.map((c: any) => ({ ...c, type: 4 })),
          ...serverData.channels.text.map((c: any) => ({ ...c, type: 0 })),
        ])
        setRoles(serverData.roles.filter((r: any) => r.name !== "@everyone"))
      }
    } catch (error) {
      console.error("Failed to load guild data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selectedGuild) return

    setIsSaving(true)
    setSaveStatus("idle")

    try {
      const response = await fetch(`/api/discord/server/${selectedGuild.id}/config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...config, guildId: selectedGuild.id }),
      })

      if (response.ok) {
        setSaveStatus("success")
        setTimeout(() => setSaveStatus("idle"), 3000)
      } else {
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    } catch (error) {
      console.error("Failed to save config:", error)
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const resetConfig = () => {
    setConfig({
      guildId: "",
      ticketCategory: "defaultCategory",
      panelChannel: "defaultChannel",
      transcriptChannel: "defaultChannel",
      supportRoles: [],
      welcomeMessage: "Hello! Thank you for creating a support ticket. A staff member will assist you shortly.",
      closeMessage: "This ticket has been closed. Thank you for contacting support!",
      maxTicketsPerUser: 3,
      autoCloseInactive: false,
      inactiveTimeoutHours: 24,
      dmOnTicketCreate: true,
      dmOnTicketClose: true,
      ticketNameFormat: "ticket-{username}-{number}",
      enableTranscripts: true,
    })
  }

  const addSupportRole = (roleId: string) => {
    if (!config.supportRoles.includes(roleId)) {
      setConfig({ ...config, supportRoles: [...config.supportRoles, roleId] })
    }
  }

  const removeSupportRole = (roleId: string) => {
    setConfig({ ...config, supportRoles: config.supportRoles.filter((id) => id !== roleId) })
  }

  const getChannelName = (channelId: string) => {
    const channel = channels.find((c) => c.id === channelId)
    return channel ? `#${channel.name}` : "Unknown Channel"
  }

  const getRoleName = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    return role ? role.name : "Unknown Role"
  }

  const categories = channels.filter((c) => c.type === 4)
  const textChannels = channels.filter((c) => c.type === 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Commands Configuration</h1>
        <p className="text-muted-foreground">Configure TicketMesh settings for your Discord servers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Server</CardTitle>
              <CardDescription>Choose a server to configure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {guilds
                .filter((g) => g.bot_present)
                .map((guild) => (
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
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-foreground">{guild.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium text-foreground truncate text-sm">{guild.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        Active
                      </Badge>
                    </div>
                  </button>
                ))}

              {guilds.filter((g) => g.bot_present).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No servers with TicketMesh found. Add the bot to your servers first.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedGuild ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {selectedGuild.icon ? (
                        <Image
                          src={`https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png`}
                          alt={selectedGuild.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-foreground">
                            {selectedGuild.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <CardTitle>Configure {selectedGuild.name}</CardTitle>
                        <CardDescription>Set up ticket system settings</CardDescription>
                      </div>
                    </div>
                    {isLoading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>}
                  </div>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Hash className="h-4 w-4" />
                      <span>Channel Settings</span>
                    </CardTitle>
                    <CardDescription>Configure where tickets are created and managed</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ticketCategory">Ticket Category</Label>
                      <Select
                        value={config.ticketCategory}
                        onValueChange={(value) => setConfig({ ...config, ticketCategory: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              📁 {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="panelChannel">Panel Channel</Label>
                      <Select
                        value={config.panelChannel}
                        onValueChange={(value) => setConfig({ ...config, panelChannel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {textChannels.map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                              # {channel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transcriptChannel">Transcript Channel</Label>
                      <Select
                        value={config.transcriptChannel}
                        onValueChange={(value) => setConfig({ ...config, transcriptChannel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {textChannels.map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                              # {channel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logChannel">Log Channel (Optional)</Label>
                      <Select
                        value={config.logChannel || "None"}
                        onValueChange={(value) =>
                          setConfig({ ...config, logChannel: value === "None" ? undefined : value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select log channel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          {textChannels.map((channel) => (
                            <SelectItem key={channel.id} value={channel.id}>
                              # {channel.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Role & Permission Settings</span>
                    </CardTitle>
                    <CardDescription>Configure support roles and user limits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Support Roles</Label>
                      <Select onValueChange={addSupportRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add support role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles
                            .filter((role) => !config.supportRoles.includes(role.id))
                            .map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                @{role.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {config.supportRoles.map((roleId) => (
                          <Badge key={roleId} variant="secondary" className="flex items-center space-x-1">
                            <span>@{getRoleName(roleId)}</span>
                            <button onClick={() => removeSupportRole(roleId)} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxTickets">Max Tickets Per User</Label>
                      <Input
                        id="maxTickets"
                        type="number"
                        min="1"
                        max="10"
                        value={config.maxTicketsPerUser}
                        onChange={(e) => setConfig({ ...config, maxTicketsPerUser: Number.parseInt(e.target.value) })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ticketNameFormat">Ticket Name Format</Label>
                      <Input
                        id="ticketNameFormat"
                        value={config.ticketNameFormat}
                        onChange={(e) => setConfig({ ...config, ticketNameFormat: e.target.value })}
                        placeholder="ticket-{username}-{number}"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use {"{username}"} and {"{number}"} as placeholders
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Message Settings</span>
                  </CardTitle>
                  <CardDescription>Customize messages sent to users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcomeMessage">Welcome Message</Label>
                    <Textarea
                      id="welcomeMessage"
                      placeholder="Message sent when a ticket is created"
                      value={config.welcomeMessage}
                      onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="closeMessage">Close Message</Label>
                    <Textarea
                      id="closeMessage"
                      placeholder="Message sent when a ticket is closed"
                      value={config.closeMessage}
                      onChange={(e) => setConfig({ ...config, closeMessage: e.target.value })}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Automation Settings</span>
                  </CardTitle>
                  <CardDescription>Configure automatic ticket management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-close Inactive Tickets</Label>
                      <p className="text-sm text-muted-foreground">Automatically close tickets after inactivity</p>
                    </div>
                    <Switch
                      checked={config.autoCloseInactive}
                      onCheckedChange={(checked) => setConfig({ ...config, autoCloseInactive: checked })}
                    />
                  </div>

                  {config.autoCloseInactive && (
                    <div className="space-y-2">
                      <Label htmlFor="inactiveTimeout">Inactive Timeout (Hours)</Label>
                      <Input
                        id="inactiveTimeout"
                        type="number"
                        min="1"
                        max="168"
                        value={config.inactiveTimeoutHours}
                        onChange={(e) =>
                          setConfig({ ...config, inactiveTimeoutHours: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>DM on Ticket Create</Label>
                      <p className="text-sm text-muted-foreground">Send DM when user creates a ticket</p>
                    </div>
                    <Switch
                      checked={config.dmOnTicketCreate}
                      onCheckedChange={(checked) => setConfig({ ...config, dmOnTicketCreate: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>DM on Ticket Close</Label>
                      <p className="text-sm text-muted-foreground">Send DM when ticket is closed</p>
                    </div>
                    <Switch
                      checked={config.dmOnTicketClose}
                      onCheckedChange={(checked) => setConfig({ ...config, dmOnTicketClose: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable Transcripts</Label>
                      <p className="text-sm text-muted-foreground">Save ticket conversations as transcripts</p>
                    </div>
                    <Switch
                      checked={config.enableTranscripts}
                      onCheckedChange={(checked) => setConfig({ ...config, enableTranscripts: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={resetConfig}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Configuration"}
                </Button>
              </div>

              {saveStatus === "success" && (
                <div className="flex items-center space-x-2 text-green-600 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Configuration saved successfully!</span>
                </div>
              )}

              {saveStatus === "error" && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span>Failed to save configuration. Please try again.</span>
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Select a Server</h3>
                  <p className="text-muted-foreground">
                    Choose a server with TicketMesh installed to configure its settings.
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
