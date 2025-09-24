import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getDiscordGuilds, checkBotInGuild } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("discord_token")

    if (!tokenCookie) {
      return NextResponse.json({ guilds: [] }, { status: 401 })
    }

    const guilds = await getDiscordGuilds(tokenCookie.value)

    // Check bot presence in each guild
    const guildsWithBotStatus = await Promise.all(
      guilds.map(async (guild) => ({
        ...guild,
        bot_present: await checkBotInGuild(guild.id),
        permission_level: guild.owner ? "owner" : "admin",
      })),
    )

    // Update stored guilds
    cookieStore.set("discord_guilds", JSON.stringify(guildsWithBotStatus), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600, // 1 hour
    })

    return NextResponse.json({ guilds: guildsWithBotStatus })
  } catch (error) {
    console.error("Failed to fetch guilds:", error)
    return NextResponse.json({ error: "Failed to fetch guilds" }, { status: 500 })
  }
}
