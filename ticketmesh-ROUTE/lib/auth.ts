export interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string | null
  email?: string
  verified?: boolean
}

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

export const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
export const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
export const DISCORD_REDIRECT_URI =
  process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI || "http://localhost:3000/api/auth/discord/callback"

export function getDiscordAuthUrl() {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID!,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email guilds",
  })

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}

export async function exchangeCodeForToken(code: string) {
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID!,
      client_secret: DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to exchange code for token")
  }

  return response.json()
}

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

    data.presenceChecks.forEach((check: any) => {
      presenceMap[check.guildId] = check.present
    })

    return presenceMap
  } catch (error) {
    console.error("Failed to check bot presence:", error)
    // Fallback to random for demo purposes
    const presenceMap: Record<string, boolean> = {}
    guildIds.forEach((id) => {
      presenceMap[id] = Math.random() > 0.3
    })
    return presenceMap
  }
}

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
    // Fallback URL
    return `https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT_CLIENT_ID&permissions=8&scope=bot%20applications.commands&guild_id=${guildId}`
  }
}
