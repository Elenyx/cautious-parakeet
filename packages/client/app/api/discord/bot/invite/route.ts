import { NextRequest, NextResponse } from "next/server"

/**
 * Generate bot invite URL for a specific Discord guild
 * POST /api/discord/bot/invite
 */
/**
 * Generate general bot invite URL (no specific guild)
 * GET /api/discord/bot/invite
 */
export async function GET() {
  try {
    const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
    if (!DISCORD_CLIENT_ID) {
      return NextResponse.json(
        { error: "Discord client ID not configured" },
        { status: 500 }
      )
    }

    // Generate bot invite URL with necessary permissions for ticket system
    // Required permissions: Administrator, View Channels, Send Messages, Manage Channels, Manage Roles, 
    // Read Message History, Attach Files, Embed Links, Use External Emojis, Add Reactions
    // Recommended: Manage Messages
    const permissions = "8" // Administrator permission (8) - includes all other permissions
    const scope = "bot%20applications.commands"
    
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=${permissions}&scope=${scope}`

    return NextResponse.json({ inviteUrl })
  } catch (error) {
    console.error("Failed to generate bot invite URL:", error)
    return NextResponse.json(
      { error: "Failed to generate invite URL" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { guildId } = await request.json()

    if (!guildId || typeof guildId !== 'string') {
      return NextResponse.json(
        { error: "Invalid guildId" },
        { status: 400 }
      )
    }

    const DISCORD_CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
    if (!DISCORD_CLIENT_ID) {
      return NextResponse.json(
        { error: "Discord client ID not configured" },
        { status: 500 }
      )
    }

    // Generate bot invite URL with necessary permissions for ticket system
    // Required permissions: Administrator, View Channels, Send Messages, Manage Channels, Manage Roles, 
    // Read Message History, Attach Files, Embed Links, Use External Emojis, Add Reactions
    // Recommended: Manage Messages
    const permissions = "8" // Administrator permission (8) - includes all other permissions
    const scope = "bot%20applications.commands"
    
    const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&permissions=${permissions}&scope=${scope}&guild_id=${guildId}`

    return NextResponse.json({ inviteUrl })
  } catch (error) {
    console.error("Failed to generate bot invite URL:", error)
    return NextResponse.json(
      { error: "Failed to generate invite URL" },
      { status: 500 }
    )
  }
}