import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { botApiGet } from "@/lib/bot-api";

/**
 * Handles the GET request for global statistics.
 * Proxies to bot service HTTP server for real data.
 * @returns A JSON response with global statistics.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await botApiGet('/api/global-stats', { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch global stats" }, { status: res.status });
    }
    const stats = await res.json();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("Global stats proxy error", err);
    return NextResponse.json({ error: "Global stats proxy error" }, { status: 500 });
  }
}
