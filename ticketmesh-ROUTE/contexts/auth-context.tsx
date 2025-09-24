"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type DiscordUser, type DiscordGuild, checkBotPresenceInGuilds } from "@/lib/auth"

interface AuthContextType {
  user: DiscordUser | null
  guilds: DiscordGuild[]
  isLoading: boolean
  login: () => void
  logout: () => void
  refreshGuilds: () => Promise<void>
  checkBotPresence: (guildIds: string[]) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [guilds, setGuilds] = useState<DiscordGuild[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)

        if (data.guilds && data.guilds.length > 0) {
          // Check bot presence for all guilds
          const guildIds = data.guilds.map((g: DiscordGuild) => g.id)
          const presenceMap = await checkBotPresenceInGuilds(guildIds)

          const guildsWithPresence = data.guilds.map((guild: DiscordGuild) => ({
            ...guild,
            bot_present: presenceMap[guild.id] || false,
          }))

          setGuilds(guildsWithPresence)
        } else {
          setGuilds([])
        }
      }
    } catch (error) {
      console.error("Failed to check auth status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = () => {
    window.location.href = "/api/auth/discord"
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      setGuilds([])
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const refreshGuilds = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/auth/guilds")
      if (response.ok) {
        const data = await response.json()

        // Check bot presence for refreshed guilds
        const guildIds = data.guilds.map((g: DiscordGuild) => g.id)
        const presenceMap = await checkBotPresenceInGuilds(guildIds)

        const guildsWithPresence = data.guilds.map((guild: DiscordGuild) => ({
          ...guild,
          bot_present: presenceMap[guild.id] || false,
        }))

        setGuilds(guildsWithPresence)
      }
    } catch (error) {
      console.error("Failed to refresh guilds:", error)
    }
  }

  const checkBotPresence = async (guildIds: string[]) => {
    try {
      const presenceMap = await checkBotPresenceInGuilds(guildIds)

      setGuilds((prevGuilds) =>
        prevGuilds.map((guild) => ({
          ...guild,
          bot_present: presenceMap[guild.id] !== undefined ? presenceMap[guild.id] : guild.bot_present,
        })),
      )
    } catch (error) {
      console.error("Failed to check bot presence:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        guilds,
        isLoading,
        login,
        logout,
        refreshGuilds,
        checkBotPresence,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
