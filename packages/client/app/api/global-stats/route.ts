import { NextResponse } from "next/server";
import { botApiGet } from "@/lib/bot-api";

/**
 * Handles the GET request for global statistics.
 * Public endpoint that proxies to the bot service HTTP server for real data.
 * Adds short-term caching and a safe fallback so the homepage counters work
 * without requiring the user to be authenticated.
 * @returns A JSON response with global statistics.
 */
export async function GET() {
  try {
    const res = await botApiGet('/api/global-stats', { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch global stats" }, { status: res.status });
    }
    const stats = await res.json();
    const response = NextResponse.json(stats);
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60');
    return response;
  } catch (err) {
    console.error("Global stats proxy error", err);
    // Safe fallback so the homepage UI still renders something sensible
    const fallback = {
      activeServers: 0,
      totalTicketsProcessed: 0,
      uptime: 0,
      communityMembers: 0,
      dailyMessages: 0,
    };
    const response = NextResponse.json(fallback, { status: 200 });
    response.headers.set('Cache-Control', 'public, max-age=30, s-maxage=30');
    return response;
  }
}
