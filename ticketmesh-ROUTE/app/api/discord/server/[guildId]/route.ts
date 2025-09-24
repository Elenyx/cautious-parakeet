import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

interface DiscordChannel {
  id: string
  name: string
  type: number
  position: number
  parent_id?: string
}

interface DiscordRole {
  id: string
  name: string
  color: number
  permissions: string
  position: number
  managed: boolean
}

interface DiscordMember {
  user: {
    id: string
    username: string
    discriminator: string
    avatar: string | null
  }
  nick?: string
  roles: string[]
  joined_at: string
}

interface ServerDetails {
  id: string
  name: string
  icon: string | null
  description?: string
  member_count: number
  presence_count: number
  channels: DiscordChannel[]
  roles: DiscordRole[]
  features: string[]
  verification_level: number
  default_message_notifications: number
  explicit_content_filter: number
  mfa_level: number
  premium_tier: number
  premium_subscription_count?: number
  banner?: string
  splash?: string
  owner_id: string
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  try {
    const { guildId } = await params
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("discord_token")

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch detailed server information
    const [guildResponse, channelsResponse, rolesResponse] = await Promise.all([
      fetch(`https://discord.com/api/guilds/${guildId}?with_counts=true`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`, // Use bot token for detailed info
        },
      }),
      fetch(`https://discord.com/api/guilds/${guildId}/channels`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }),
      fetch(`https://discord.com/api/guilds/${guildId}/roles`, {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }),
    ])

    if (!guildResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch server details" }, { status: 500 })
    }

    const guild: ServerDetails = await guildResponse.json()
    const channels: DiscordChannel[] = channelsResponse.ok ? await channelsResponse.json() : []
    const roles: DiscordRole[] = rolesResponse.ok ? await rolesResponse.json() : []

    // Organize channels by type
    const textChannels = channels.filter((c) => c.type === 0).sort((a, b) => a.position - b.position)
    const voiceChannels = channels.filter((c) => c.type === 2).sort((a, b) => a.position - b.position)
    const categories = channels.filter((c) => c.type === 4).sort((a, b) => a.position - b.position)

    // Sort roles by position (highest first)
    const sortedRoles = roles.sort((a, b) => b.position - a.position)

    const serverDetails = {
      ...guild,
      channels: {
        text: textChannels,
        voice: voiceChannels,
        categories: categories,
        total: channels.length,
      },
      roles: sortedRoles,
      statistics: {
        memberCount: guild.member_count || 0,
        onlineCount: guild.presence_count || 0,
        textChannels: textChannels.length,
        voiceChannels: voiceChannels.length,
        roles: roles.length,
        premiumTier: guild.premium_tier || 0,
        premiumSubscriptions: guild.premium_subscription_count || 0,
      },
    }

    return NextResponse.json(serverDetails)
  } catch (error) {
    console.error("Failed to fetch server details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
