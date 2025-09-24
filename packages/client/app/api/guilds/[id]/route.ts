import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * GET /api/guilds/[id]
 * Proxies to the bot server to fetch guild-specific dashboard data (e.g., active tickets).
 * Requires an authenticated session.
 *
 * NOTE: Next.js typed routes expect the `context.params` to be a Promise in this project setup.
 * We therefore await `context.params` to extract the `id` safely.
 *
 * @param req - The incoming HTTP request.
 * @param context - Route context containing the dynamic params from Next.js router.
 * @returns JSON payload from bot service or an error response.
 */
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.BOT_API_BASE_URL;
  if (!base) {
    return NextResponse.json({ error: "BOT_API_BASE_URL not configured" }, { status: 500 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "Guild ID required" }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/api/guilds/${id}`, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch guild info" }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Guild proxy error", err);
    return NextResponse.json({ error: "Guild proxy error" }, { status: 500 });
  }
}