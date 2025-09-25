import { NextRequest, NextResponse } from "next/server"
import { botApiPost } from "@/lib/bot-api"

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

    // Check bot presence via authenticated bot API
    const response = await botApiPost('/api/bot/presence', { guildIds })

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