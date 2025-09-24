import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

interface TicketConfig {
  guildId: string
  ticketCategory: string
  panelChannel: string
  transcriptChannel: string
  supportRoles: string[]
  welcomeMessage: string
  closeMessage: string
  maxTicketsPerUser: number
  autoCloseInactive: boolean
  inactiveTimeoutHours: number
  dmOnTicketCreate: boolean
  dmOnTicketClose: boolean
  logChannel?: string
  ticketNameFormat: string
  enableTranscripts: boolean
}

// GET - Fetch current configuration
export async function GET(request: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  try {
    const { guildId } = await params
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("discord_token")

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real implementation, you would fetch this from your database
    // For now, we'll return a default configuration
    const defaultConfig: TicketConfig = {
      guildId,
      ticketCategory: "",
      panelChannel: "",
      transcriptChannel: "",
      supportRoles: [],
      welcomeMessage: "Hello! Thank you for creating a support ticket. A staff member will assist you shortly.",
      closeMessage: "This ticket has been closed. Thank you for contacting support!",
      maxTicketsPerUser: 3,
      autoCloseInactive: false,
      inactiveTimeoutHours: 24,
      dmOnTicketCreate: true,
      dmOnTicketClose: true,
      ticketNameFormat: "ticket-{username}-{number}",
      enableTranscripts: true,
    }

    return NextResponse.json(defaultConfig)
  } catch (error) {
    console.error("Failed to fetch config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Save configuration
export async function POST(request: NextRequest, { params }: { params: Promise<{ guildId: string }> }) {
  try {
    const { guildId } = await params
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get("discord_token")

    if (!tokenCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const config: TicketConfig = await request.json()

    // Validate required fields
    if (!config.ticketCategory || !config.panelChannel || !config.transcriptChannel) {
      return NextResponse.json({ error: "Missing required configuration fields" }, { status: 400 })
    }

    // In a real implementation, you would:
    // 1. Validate the user has permission to configure this guild
    // 2. Validate that channels and roles exist in the guild
    // 3. Save the configuration to your database
    // 4. Update the bot's configuration for this guild

    console.log("Saving config for guild:", guildId, config)

    // Simulate saving delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error("Failed to save config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
