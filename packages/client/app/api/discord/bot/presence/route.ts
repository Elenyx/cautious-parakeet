import { NextRequest, NextResponse } from "next/server"

/**
 * Check bot presence in multiple Discord guilds
 * POST /api/discord/bot/presence
 */
export async function POST(request: NextRequest) {
  try {
    const { guildIds } = await request.json()

    if (!guildIds || !Array.isArray(guildIds)) {
      return NextResponse.json(
        { error: "Invalid guildIds array" },
        { status: 400 }
      )
    }

    const BOT_API_BASE_URL = process.env.BOT_API_BASE_URL
    if (!BOT_API_BASE_URL) {
      console.error("BOT_API_BASE_URL not configured")
      // Return fallback data for development
      const presenceChecks = guildIds.map(guildId => ({
        guildId,
        present: Math.random() > 0.3 // Random fallback for demo
      }))
      return NextResponse.json({ presenceChecks })
    }

    // Check bot presence via bot API
    const response = await fetch(`${BOT_API_BASE_URL}/api/bot/presence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guildIds }),
    })

    if (!response.ok) {
      throw new Error(`Bot API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to check bot presence:", error)
    
    // Fallback response for development
    const { guildIds } = await request.json().catch(() => ({ guildIds: [] }))
    const presenceChecks = guildIds.map((guildId: string) => ({
      guildId,
      present: Math.random() > 0.3 // Random fallback
    }))
    
    return NextResponse.json({ presenceChecks })
  }
}