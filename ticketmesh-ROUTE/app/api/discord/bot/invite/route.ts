import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { guildId, permissions = "8" }: { guildId: string; permissions?: string } = await request.json()

    // Generate Discord bot invite URL
    const botClientId = process.env.NEXT_PUBLIC_DISCORD_BOT_CLIENT_ID || "YOUR_BOT_CLIENT_ID"
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${botClientId}&permissions=${permissions}&scope=bot%20applications.commands&guild_id=${guildId}`

    return NextResponse.json({ inviteUrl })
  } catch (error) {
    console.error("Failed to generate invite URL:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
