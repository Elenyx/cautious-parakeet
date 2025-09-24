"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { DiscordUser, DiscordGuild } from "@/lib/auth"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import Link from "next/link"
import { Home, Server, Settings, LogOut, ChevronRight, Shield, CheckCircle, XCircle } from "lucide-react"

interface DashboardSidebarProps {
  user: DiscordUser
  guilds: DiscordGuild[]
  currentView: string
  onViewChange: (view: "overview" | "server-info" | "commands-config") => void
  selectedGuildId: string | null
  onGuildSelect: (guildId: string | null) => void
}

export function DashboardSidebar({
  user,
  guilds,
  currentView,
  onViewChange,
  selectedGuildId,
  onGuildSelect,
}: DashboardSidebarProps) {
  const { logout } = useAuth()

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-E2iIA8pzOyl01u81dqxuvpdaIFBzsi.png"
              alt="TicketMesh Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-lg font-bold text-sidebar-foreground">TicketMesh</span>
          </Link>

          <div className="flex items-center space-x-2">
            {user.avatar && (
              <Image
                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                alt={user.username}
                width={24}
                height={24}
                className="rounded-full"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.username}</p>
              <p className="text-xs text-sidebar-foreground/60">{guilds.length} servers</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              <div className="space-y-1">
                <Button
                  variant={currentView === "overview" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onViewChange("overview")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Overview
                </Button>

                <Button
                  variant={currentView === "server-info" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onViewChange("server-info")}
                >
                  <Server className="mr-2 h-4 w-4" />
                  Server Info
                </Button>

                <Button
                  variant={currentView === "commands-config" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onViewChange("commands-config")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Commands Config
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
                  Your Servers
                </h3>

                <div className="space-y-1">
                  {guilds.slice(0, 10).map((guild) => (
                    <button
                      key={guild.id}
                      onClick={() => onGuildSelect(selectedGuildId === guild.id ? null : guild.id)}
                      className={`w-full flex items-center space-x-2 p-2 rounded-md text-left hover:bg-sidebar-accent transition-colors ${
                        selectedGuildId === guild.id ? "bg-sidebar-accent" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {guild.icon ? (
                          <Image
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            alt={guild.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 bg-sidebar-primary rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-sidebar-primary-foreground">
                              {guild.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">{guild.name}</p>
                      </div>

                      <div className="flex-shrink-0 flex items-center space-x-1">
                        {guild.bot_present ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-500" />
                        )}
                        {guild.owner && <Shield className="h-3 w-3 text-yellow-500" />}
                        <ChevronRight
                          className={`h-3 w-3 text-sidebar-foreground/40 transition-transform ${
                            selectedGuildId === guild.id ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </button>
                  ))}

                  {guilds.length > 10 && (
                    <p className="text-xs text-sidebar-foreground/60 px-2 py-1">+{guilds.length - 10} more servers</p>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
