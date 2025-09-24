import { getServerSession } from "next-auth"
import { authOptions, type DiscordGuild } from "@/lib/auth"
import { NextResponse } from "next/server"

/**
 * Fetches the guilds (servers) of the authenticated user from the Discord API.
 * - Requires the user's Discord OAuth access token with `guilds` scope.
 * - Uses Discord API v10 endpoint for stability.
 * - Includes bot presence checking for each guild.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session in /api/guilds:", session)

    if (!session || !session.accessToken) {
      console.warn("/api/guilds: missing accessToken on session. Ask user to re-auth with Discord provider.")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const text = await response.text().catch(() => "")
      console.error(`/api/guilds Discord error ${response.status}:`, text)
      return NextResponse.json({ error: "Failed to fetch guilds" }, { status: response.status })
    }

    const guilds: DiscordGuild[] = await response.json()

    // Check bot presence in each guild
    try {
      const guildIds = guilds.map(guild => guild.id)
      const presenceResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/discord/bot/presence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ guildIds }),
      })

      if (presenceResponse.ok) {
        const presenceData = await presenceResponse.json()
        const presenceMap: Record<string, boolean> = {}
        
        presenceData.presenceChecks?.forEach((check: { guildId: string; present: boolean }) => {
          presenceMap[check.guildId] = check.present
        })

        // Add bot presence information to guilds
        const guildsWithBotStatus = guilds.map(guild => ({
          ...guild,
          bot_present: presenceMap[guild.id] || false,
        }))

        return NextResponse.json(guildsWithBotStatus)
      }
    } catch (presenceError) {
      console.warn("Failed to check bot presence, returning guilds without bot status:", presenceError)
    }

    // Return guilds without bot presence if checking failed
    return NextResponse.json(guilds)
  } catch (err: unknown) {
    console.error("/api/guilds unexpected error:", err)
    const message = err instanceof Error ? err.message : "Guilds route error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}