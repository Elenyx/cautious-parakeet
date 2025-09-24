import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

interface BotPresenceCheck {
  guildId: string
  present: boolean
  permissions?: string[]
  roles?: string[]
  joinedAt?: string
  lastSeen?: string
  botUser?: {
    id: string
    username: string
    discriminator: string
    avatar: string | null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { guildIds }: { guildIds: string[] } = await request.json()
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("discord_token")

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check bot presence in multiple guilds
    const presenceChecks = await Promise.all(
      guildIds.map(async (guildId): Promise<BotPresenceCheck> => {
        try {
          // In a real implementation, you would use your bot token to check if the bot is in the guild
          const botToken = process.env.DISCORD_BOT_TOKEN

          if (!botToken) {
            return { guildId, present: false }
          }

          // Check if bot is a member of the guild
          const memberResponse = await fetch(
            `https://discord.com/api/guilds/${guildId}/members/${process.env.DISCORD_BOT_USER_ID || "YOUR_BOT_USER_ID"}`,
            {
              headers: {
                Authorization: `Bot ${botToken}`,
              },
            },
          )

          if (!memberResponse.ok) {
            return { guildId, present: false }
          }

          const memberData = await memberResponse.json()

          // Get bot's permissions in the guild
          const botUser = memberData.user
          const roles = memberData.roles || []
          const joinedAt = memberData.joined_at

          // Calculate permissions (simplified - in reality you'd need to calculate based on roles and channel overwrites)
          const permissions = [
            "SEND_MESSAGES",
            "MANAGE_CHANNELS",
            "MANAGE_ROLES",
            "READ_MESSAGE_HISTORY",
            "EMBED_LINKS",
            "ATTACH_FILES",
            "USE_SLASH_COMMANDS",
          ]

          return {
            guildId,
            present: true,
            permissions,
            roles,
            joinedAt,
            lastSeen: new Date().toISOString(), // In reality, you'd track this
            botUser,
          }
        } catch (error) {
          console.error(`Failed to check bot presence in guild ${guildId}:`, error)
          return { guildId, present: false }
        }
      }),
    )

    return NextResponse.json({ presenceChecks })
  } catch (error) {
    console.error("Failed to check bot presence:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
