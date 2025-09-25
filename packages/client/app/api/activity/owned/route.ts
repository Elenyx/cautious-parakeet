import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { botApiGet } from "@/lib/bot-api";

/**
 * GET /api/activity/owned
 * Returns recent activity filtered to only the guilds the authenticated user owns.
 * - Uses the user's Discord OAuth access token to fetch guilds
 * - Filters for owner === true and passes guildIds to bot API /api/activity
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Reuse our guilds API (which handles caching, permissions and presence)
    // Forward the incoming request cookies to preserve the session on server-side fetch
    const cookieHeader = cookies().toString();
    const guildsRes = await fetch('/api/guilds', {
      cache: 'no-store',
      headers: { cookie: cookieHeader },
    });
    if (!guildsRes.ok) {
      const text = await guildsRes.text().catch(() => "");
      console.error(`/api/activity/owned guilds api error ${guildsRes.status}:`, text);
      return NextResponse.json({ error: "Failed to fetch guilds" }, { status: guildsRes.status });
    }

    const guilds: Array<{ id: string; owner: boolean }> = await guildsRes.json();
    const ownedGuildIds = guilds.filter(g => g.owner).map(g => g.id);

    // If user owns no guilds, return empty activity list
    if (ownedGuildIds.length === 0) {
      return NextResponse.json([]);
    }

    const params = new URLSearchParams({ guildIds: ownedGuildIds.join(",") });
    const res = await botApiGet(`/api/activity?${params.toString()}`, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`/api/activity/owned bot error ${res.status}:`, text);
      return NextResponse.json({ error: "Failed to fetch activity" }, { status: res.status });
    }

    const activity = await res.json();
    return NextResponse.json(activity);
  } catch (err: unknown) {
    console.error("/api/activity/owned unexpected error:", err);
    const message = err instanceof Error ? err.message : "Owned activity route error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}