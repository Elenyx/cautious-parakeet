import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()

    // Clear all auth cookies
    cookieStore.delete("discord_token")
    cookieStore.delete("discord_user")
    cookieStore.delete("discord_guilds")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to logout:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
