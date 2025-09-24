"use client"

import { useAuth } from "@/contexts/auth-context"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { ServerInfo } from "@/components/dashboard/server-info"
import { CommandsConfig } from "@/components/dashboard/commands-config"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardView = "overview" | "server-info" | "commands-config"

export default function DashboardPage() {
  const { user, guilds, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState<DashboardView>("overview")
  const [selectedGuildId, setSelectedGuildId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/")
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const selectedGuild = selectedGuildId ? guilds.find((g) => g.id === selectedGuildId) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar
          user={user}
          guilds={guilds}
          currentView={currentView}
          onViewChange={setCurrentView}
          selectedGuildId={selectedGuildId}
          onGuildSelect={setSelectedGuildId}
        />

        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto">
            {currentView === "overview" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
                  <p className="text-muted-foreground">
                    Welcome back, {user.username}! Manage your Discord servers and TicketMesh configuration.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">Total Servers</CardTitle>
                      <CardDescription>Servers you own or manage</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">{guilds.length}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-secondary">Bot Active</CardTitle>
                      <CardDescription>Servers with TicketMesh</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        {guilds.filter((g) => g.bot_present).length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-accent">Pending Setup</CardTitle>
                      <CardDescription>Servers needing configuration</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        {guilds.filter((g) => !g.bot_present).length}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with TicketMesh</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => setCurrentView("server-info")}
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <h3 className="font-semibold text-foreground mb-2">View Server Info</h3>
                        <p className="text-sm text-muted-foreground">
                          Check which servers have TicketMesh installed and their status
                        </p>
                      </button>
                      <button
                        onClick={() => setCurrentView("commands-config")}
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <h3 className="font-semibold text-foreground mb-2">Configure Commands</h3>
                        <p className="text-sm text-muted-foreground">
                          Set up ticket categories, channels, and bot permissions
                        </p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === "server-info" && (
              <ServerInfo guilds={guilds} selectedGuild={selectedGuild} onGuildSelect={setSelectedGuildId} />
            )}

            {currentView === "commands-config" && (
              <CommandsConfig guilds={guilds} selectedGuild={selectedGuild} onGuildSelect={setSelectedGuildId} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
