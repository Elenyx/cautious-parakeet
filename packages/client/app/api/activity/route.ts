import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { NextResponse } from "next/server";
import { botApiGet } from "../../../lib/bot-api";

/**
 * GET /api/activity
 * Proxies to bot server for recent activity feed.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await botApiGet('/api/activity', { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch activity" }, { status: res.status });
    }
    const feed = await res.json();
    return NextResponse.json(feed);
  } catch (err) {
    console.error("Activity proxy error", err);
    return NextResponse.json({ error: "Activity proxy error" }, { status: 500 });
  }
}