import { getServerSession } from "next-auth";
import { authOptions, type DiscordGuild } from "@/lib/auth";
import { NextResponse } from "next/server";
import { botApiGet, BotApiAuthError, BotApiConnectionError } from "@/lib/bot-api";
import { cachedDiscordFetch } from "@/lib/rate-limit";

/**
 * GET /api/activity/owned
 * Returns recent activity filtered to only the guilds the authenticated user owns.
 * - Uses the user's Discord OAuth access token to fetch guilds directly
 * - Filters for owner === true and passes guildIds to bot API /api/activity
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch guilds directly from Discord API to avoid circular dependency
    let guilds: DiscordGuild[];
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
      return NextResponse.json({ error: "Failed to fetch guilds from Discord" }, { status: 500 });
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
        return NextResponse.json({ error: "Failed to fetch activity" }, { status: res.status });
      }

      const activity = await res.json();
      return NextResponse.json(activity);
    } catch (botErr: unknown) {
      if (botErr instanceof BotApiAuthError) {
        console.warn("/api/activity/owned auth to bot failed:", botErr.message);
        return NextResponse.json({ error: botErr.message }, { status: botErr.status || 401 });
      }
      if (botErr instanceof BotApiConnectionError) {
        console.error("/api/activity/owned bot connection error:", botErr.message);
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