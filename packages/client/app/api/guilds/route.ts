import { getServerSession } from "next-auth"
import { authOptions, type DiscordGuild } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { ClientRedisService } from "@/lib/redis"
import { createRateLimitedRoute } from "@/lib/rate-limit"
import { botApiPost } from "@/lib/bot-api"
import { discordApi } from "@/lib/discord-api-client"

/**
 * Fetches the guilds (servers) of the authenticated user from the Discord API.
 * - Requires the user's Discord OAuth access token with `guilds` scope.
 * - Uses Discord API v10 endpoint for stability.
 * - Includes bot presence checking for each guild.
 * - Implements caching and rate limiting to prevent Discord API issues.
 */
async function getGuildsHandler(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session in /api/guilds:", session)

    if (!session || !session.accessToken || !session.user?.id) {
      console.warn("/api/guilds: missing accessToken or user ID on session. Ask user to re-auth with Discord provider.")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const redis = ClientRedisService.getInstance()
    const userId = session.user.id

    // Support fresh fetch to bypass cache for real-time updates
    const freshParam = req.nextUrl.searchParams.get('fresh')
    const isFresh = freshParam === '1' ||
      (req.headers.get('cache-control')?.toLowerCase().includes('no-cache') ?? false)
    
    // Check if we're currently rate limited before attempting fresh fetch
    if (isFresh) {
      const isRateLimited = await redis.isRateLimited('/api/guilds')
      if (isRateLimited) {
        console.warn("/api/guilds fresh request blocked due to rate limiting")
        // Force non-fresh behavior to use cache
        const cachedGuilds = await redis.getCachedUserGuilds(userId)
        if (cachedGuilds) {
          return NextResponse.json(cachedGuilds, {
            headers: { 'X-From-Cache': 'rate-limited' }
          })
        }
      }
    }

    // Always check cache first - even for fresh requests, we'll use cache as fallback
    const cachedGuilds = await redis.getCachedUserGuilds(userId)
    
    // If not fresh and we have cached data, return it immediately
    if (!isFresh && cachedGuilds) {
      console.log(`[Cache] Hit for user ${userId} guilds`)
      return NextResponse.json(cachedGuilds, {
        headers: { 'X-From-Cache': 'guilds' }
      })
    }

    // Use enhanced Discord API client with built-in rate limiting and caching
    let guilds: DiscordGuild[]
    try {
      guilds = await discordApi.getUserGuilds(session.accessToken, userId, isFresh)
      console.log(`/api/guilds: fetched ${guilds.length} guilds for user ${userId}`)
    } catch (error: unknown) {
      console.error("/api/guilds Discord API error:", error)
      
      // Try to get cached guilds as fallback
      if (cachedGuilds) {
        console.warn("/api/guilds: falling back to cached guilds due to API error")
        return NextResponse.json(cachedGuilds, {
          headers: { 'X-From-Cache': 'fallback' },
        })
      }
      
      // If no cached data available, return appropriate error
      if (error instanceof Error && error.message.includes('Rate limited')) {
        return NextResponse.json(
          { error: "Discord rate limited. Please retry shortly." },
          { status: 429, headers: { 'Retry-After': '30' } }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to fetch guilds from Discord API" },
        { status: 500 }
      )
    }

    // Filter guilds to only include those where user has MANAGE_GUILD permission or is owner
    const manageableGuilds = discordApi.filterGuildsByPermission(guilds, 'MANAGE_GUILD')

    // Check bot presence in each guild using the bot service
    let guildsWithBotStatus = manageableGuilds
    try {
      const guildIds = manageableGuilds.map(guild => guild.id)
      
      // Use authenticated bot API request with timeout
      const presenceResponse = await Promise.race([
        botApiPost('/api/bot/presence', { guildIds }),
        new Promise<Response>((_, reject) => 
          setTimeout(() => reject(new Error('Bot presence check timeout')), 5000)
        )
      ])

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
      } else {
        console.warn(`Bot presence check failed with status ${presenceResponse.status}`)
      }
    } catch (presenceError) {
      console.warn("Failed to check bot presence, returning guilds without bot status:", presenceError)
      // Keep the original guilds without bot status - this is acceptable
    }

    // Cache the final result with bot presence
    // Only cache when not explicitly fresh; otherwise keep result ephemeral
    if (!isFresh) {
      await redis.cacheUserGuilds(userId, guildsWithBotStatus, 300) // Cache for 5 minutes to reduce API calls
    }

    return NextResponse.json(guildsWithBotStatus)
  } catch (err: unknown) {
    console.error("/api/guilds unexpected error:", err)
    const message = err instanceof Error ? err.message : "Guilds route error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Export the rate-limited version of the handler
export const GET = createRateLimitedRoute(getGuildsHandler)