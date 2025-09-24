import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Handles the GET request for dashboard stats.
 * Proxies to bot service HTTP server for real data.
 * @returns A JSON response with dashboard stats.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.BOT_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ error: "BOT_API_BASE_URL not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(`${base}/api/stats`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: res.status });
    }
    const stats = await res.json();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Stats proxy error", err);
    return NextResponse.json({ error: "Stats proxy error" }, { status: 500 });
  }
}