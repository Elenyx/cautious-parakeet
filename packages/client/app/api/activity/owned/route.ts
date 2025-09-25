import { getServerSession } from "next-auth";
import { authOptions, type DiscordGuild } from "@/lib/auth";
import { NextResponse } from "next/server";
import { botApiGet, BotApiAuthError, BotApiConnectionError } from "@/lib/bot-api";
import { cachedDiscordFetch } from "@/lib/rate-limit";
import { ClientRedisService } from "@/lib/redis";

/**
 * GET /api/activity/owned
 * Returns recent activity filtered to only the guilds the authenticated user owns.
 * - Uses the user's Discord OAuth access token to fetch guilds directly
 * - Filters for owner === true and passes guildIds to bot API /api/activity
 * - Implements fallback to cached data when APIs fail
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redis = ClientRedisService.getInstance();
    const userId = session.user.id;

    // Try to get cached activity first as fallback
    const cachedActivityKey = `client:activity:owned:${userId}`;
    let cachedActivity = null;
    try {
      cachedActivity = await redis.getCachedApiResponse(cachedActivityKey);
    } catch (cacheErr) {
      console.warn("/api/activity/owned cache read error:", cacheErr);
    }

    // Fetch guilds directly from Discord API to avoid circular dependency
    let guilds: DiscordGuild[];
    let guildsFromCache = false;
    
    try {
      guilds = await cachedDiscordFetch(
        "https://discord.com/api/v10/users/@me/guilds?with_counts=false",
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            Accept: "application/json",
          },
        },
        `discord:guilds:${session.user.id}`,
        60 // Cache for 1 minute for real-time updates
      ) as DiscordGuild[];
    } catch (discordErr: unknown) {
      console.error("/api/activity/owned Discord API error:", discordErr);
      
      // Try to get cached guilds as fallback
      try {
        const cachedGuilds = await redis.getCachedUserGuilds(userId);
        if (cachedGuilds && Array.isArray(cachedGuilds)) {
          console.warn("/api/activity/owned using cached guilds due to Discord API failure");
          guilds = cachedGuilds as DiscordGuild[];
          guildsFromCache = true;
        } else {
          // If no cached guilds and Discord API fails, return cached activity if available
          if (cachedActivity) {
            console.warn("/api/activity/owned returning cached activity due to guild fetch failure");
            return NextResponse.json(cachedActivity, {
              headers: { 'X-From-Cache': 'activity' }
            });
          }
          return NextResponse.json({ error: "Failed to fetch guilds from Discord" }, { status: 500 });
        }
      } catch (fallbackErr) {
        console.error("/api/activity/owned fallback error:", fallbackErr);
        if (cachedActivity) {
          return NextResponse.json(cachedActivity, {
            headers: { 'X-From-Cache': 'activity' }
          });
        }
        return NextResponse.json({ error: "Failed to fetch guilds from Discord" }, { status: 500 });
      }
    }

    // Filter for owned guilds only
    const ownedGuildIds = guilds.filter(g => g.owner).map(g => g.id);

    // If user owns no guilds, return empty activity list
    if (ownedGuildIds.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch activity from bot API
    const params = new URLSearchParams({ guildIds: ownedGuildIds.join(",") });
    try {
      const res = await botApiGet(`/api/activity?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`/api/activity/owned bot error ${res.status}:`, text);
        
        // Return cached activity if available
        if (cachedActivity) {
          console.warn("/api/activity/owned returning cached activity due to bot API failure");
          return NextResponse.json(cachedActivity, {
            headers: { 'X-From-Cache': 'activity' }
          });
        }
        return NextResponse.json({ error: "Failed to fetch activity" }, { status: res.status });
      }

      const activity = await res.json();
      
      // Cache the successful response
      try {
        await redis.cacheApiResponse(cachedActivityKey, activity, 120); // Cache for 2 minutes
      } catch (cacheErr) {
        console.warn("/api/activity/owned cache write error:", cacheErr);
      }
      
      return NextResponse.json(activity, {
        headers: guildsFromCache ? { 'X-From-Cache': 'guilds' } : {}
      });
    } catch (botErr: unknown) {
      if (botErr instanceof BotApiAuthError) {
        console.warn("/api/activity/owned auth to bot failed:", botErr.message);
        if (cachedActivity) {
          return NextResponse.json(cachedActivity, {
            headers: { 'X-From-Cache': 'activity' }
          });
        }
        return NextResponse.json({ error: botErr.message }, { status: botErr.status || 401 });
      }
      if (botErr instanceof BotApiConnectionError) {
        console.error("/api/activity/owned bot connection error:", botErr.message);
        if (cachedActivity) {
          return NextResponse.json(cachedActivity, {
            headers: { 'X-From-Cache': 'activity' }
          });
        }
        return NextResponse.json({ error: "Bot service unavailable" }, { status: 502 });
      }
      throw botErr;
    }
  } catch (err: unknown) {
    console.error("/api/activity/owned unexpected error:", err);
    const message = err instanceof Error ? err.message : "Owned activity route error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}