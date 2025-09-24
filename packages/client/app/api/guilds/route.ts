import { getServerSession } from "next-auth"
import { authOptions, type DiscordGuild } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ClientRedisService } from "@/lib/redis"
import { cachedDiscordFetch, createRateLimitedRoute } from "@/lib/rate-limit"

/**
 * Fetches the guilds (servers) of the authenticated user from the Discord API.
 * - Requires the user's Discord OAuth access token with `guilds` scope.
 * - Uses Discord API v10 endpoint for stability.
 * - Includes bot presence checking for each guild.
 * - Implements caching and rate limiting to prevent Discord API issues.
 */
async function getGuildsHandler() {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session in /api/guilds:", session)

    if (!session || !session.accessToken || !session.user?.id) {
      console.warn("/api/guilds: missing accessToken or user ID on session. Ask user to re-auth with Discord provider.")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const redis = ClientRedisService.getInstance()
    const userId = session.user.id

    // Check cache first
    const cachedGuilds = await redis.getCachedUserGuilds(userId)
    if (cachedGuilds) {
      console.log(`[Cache] Hit for user ${userId} guilds`)
      return NextResponse.json(cachedGuilds)
    }

    // Fetch from Discord API with rate limiting and caching
    const guilds: DiscordGuild[] = await cachedDiscordFetch(
      "https://discord.com/api/v10/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
      },
      `discord:guilds:${userId}`,
      300 // Cache for 5 minutes
    )

    // Check bot presence in each guild using the bot service
    let guildsWithBotStatus = guilds
    try {
      const guildIds = guilds.map(guild => guild.id)
      
      // Use the bot service directly instead of the client proxy
      const botServiceUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3011'
      const presenceResponse = await fetch(`${botServiceUrl}/api/bot/presence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guildIds }),
      })

      if (presenceResponse.ok) {
        const presenceData = await presenceResponse.json()
        const presenceMap: Record<string, boolean> = {}
        
        presenceData.presenceChecks?.forEach((check: { guildId: string; present: boolean }) => {
          presenceMap[check.guildId] = check.present
        })

        // Add bot presence information to guilds
        guildsWithBotStatus = guilds.map(guild => ({
          ...guild,
          bot_present: presenceMap[guild.id] || false,
        }))
      }
    } catch (presenceError) {
      console.warn("Failed to check bot presence, returning guilds without bot status:", presenceError)
    }

    // Cache the final result with bot presence
    await redis.cacheUserGuilds(userId, guildsWithBotStatus, 300) // Cache for 5 minutes

    return NextResponse.json(guildsWithBotStatus)
  } catch (err: unknown) {
    console.error("/api/guilds unexpected error:", err)
    const message = err instanceof Error ? err.message : "Guilds route error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Export the rate-limited version of the handler
export const GET = createRateLimitedRoute(getGuildsHandler)