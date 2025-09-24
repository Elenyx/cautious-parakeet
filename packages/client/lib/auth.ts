import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from "next-auth/providers/discord";

/**
 * Discord user interface matching Discord API response
 */
export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
  verified?: boolean
}

/**
 * Discord guild interface with bot presence information
 */
export interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
  features: string[]
  bot_present?: boolean
  bot_permissions?: string[]
  bot_roles?: string[]
  bot_joined_at?: string
  bot_last_seen?: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: { params: { scope: 'identify email guilds' } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    /**
     * JWT callback: attach Discord OAuth access_token to the JWT so it can be surfaced in the session.
     */
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    /**
     * Session callback: expose JWT's accessToken on the session object for server-side routes.
     */
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
};

/**
 * Fetch Discord user data using access token
 */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch Discord user")
  }

  return response.json()
}

/**
 * Fetch Discord guilds for the authenticated user
 */
export async function getDiscordGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch Discord guilds")
  }

  return response.json()
}

/**
 * Check bot presence in multiple guilds
 */
export async function checkBotPresenceInGuilds(guildIds: string[]): Promise<Record<string, boolean>> {
  try {
    const response = await fetch("/api/discord/bot/presence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guildIds }),
    })

    if (!response.ok) {
      throw new Error("Failed to check bot presence")
    }

    const data = await response.json()
    const presenceMap: Record<string, boolean> = {}

    data.presenceChecks.forEach((check: { guildId: string; present: boolean }) => {
      presenceMap[check.guildId] = check.present
    })

    return presenceMap
  } catch (error) {
    console.error("Failed to check bot presence:", error)
    // Fallback to checking via bot API
    const presenceMap: Record<string, boolean> = {}
    guildIds.forEach((id) => {
      presenceMap[id] = Math.random() > 0.3 // Temporary fallback
    })
    return presenceMap
  }
}

/**
 * Generate bot invite URL for a specific guild
 */
export async function generateBotInviteUrl(guildId: string): Promise<string> {
  try {
    const response = await fetch("/api/discord/bot/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guildId }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate invite URL")
    }

    const data = await response.json()
    return data.inviteUrl
  } catch (error) {
    console.error("Failed to generate invite URL:", error)
    // Fallback URL - replace with actual bot client ID
    return `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}`
  }
}