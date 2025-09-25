import { getServerSession } from "next-auth"
import { authOptions, type DiscordGuild } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ClientRedisService } from "@/lib/redis"
import { cachedDiscordFetch, createRateLimitedRoute } from "@/lib/rate-limit"
import { botApiPost } from "@/lib/bot-api"

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
    // Only fetch guilds where user has MANAGE_GUILD permission (0x20)
    const guilds: DiscordGuild[] = await cachedDiscordFetch(
      "https://discord.com/api/v10/users/@me/guilds?with_counts=false",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          Accept: "application/json",
        },
      },
      `discord:guilds:${userId}`,
      300 // Cache for 5 minutes
    )

    // Filter guilds to only include those where user has MANAGE_GUILD permission (0x20) or is owner
    const manageableGuilds = guilds.filter(guild => {
      // Check if user is owner
      if (guild.owner) return true
      
      // Check if user has MANAGE_GUILD permission (0x20)
      const permissions = parseInt(guild.permissions || '0')
      const MANAGE_GUILD = 0x20
      return (permissions & MANAGE_GUILD) === MANAGE_GUILD
    })

    // Check bot presence in each guild using the bot service
    let guildsWithBotStatus = manageableGuilds
    try {
      const guildIds = manageableGuilds.map(guild => guild.id)
      
      // Use authenticated bot API request
      const presenceResponse = await botApiPost('/api/bot/presence', { guildIds })

      if (presenceResponse.ok) {
        const presenceData = await presenceResponse.json()
        const presenceMap: Record<string, boolean> = {}
        
        // Bot service returns direct array, not wrapped in presenceChecks
        if (Array.isArray(presenceData)) {
          presenceData.forEach((check: { guildId: string; present: boolean }) => {
            presenceMap[check.guildId] = check.present
          })
        }

        // Add bot presence information to guilds
        guildsWithBotStatus = manageableGuilds.map(guild => ({
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