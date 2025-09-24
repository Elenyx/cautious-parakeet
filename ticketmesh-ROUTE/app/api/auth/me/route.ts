import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("discord_user")
    const guildsCookie = cookieStore.get("discord_guilds")

    if (!userCookie) {
      return NextResponse.json({ user: null, guilds: [] })
    }

    const user = JSON.parse(userCookie.value)
    const guilds = guildsCookie ? JSON.parse(guildsCookie.value) : []

    return NextResponse.json({ user, guilds })
  } catch (error) {
    console.error("Failed to get auth status:", error)
    return NextResponse.json({ user: null, guilds: [] })
  }
}
