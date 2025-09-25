import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const serverId = '1420828084805959702'
    
    // Fetch Discord server widget data
    const widgetResponse = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`, {
      headers: {
        'User-Agent': 'TicketMesh/1.0'
      }
    })

    if (!widgetResponse.ok) {
      throw new Error(`Discord API returned ${widgetResponse.status}`)
    }

    const widgetData = await widgetResponse.json()
    
    // Calculate stats
    const memberCount = widgetData.members?.length || 0
    const onlineCount = widgetData.members?.filter((member: any) => 
      member.status === 'online' || member.status === 'idle' || member.status === 'dnd'
    ).length || 0
    
    // Get bot stats
    let ticketsProcessed = 0
    try {
      const botStatsResponse = await fetch(`${process.env.BOT_API_URL || 'http://localhost:3011'}/api/global-stats`, {
        headers: {
          'Authorization': `Bearer ${process.env.API_SECRET}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (botStatsResponse.ok) {
        const botStats = await botStatsResponse.json()
        ticketsProcessed = botStats.totalTicketsProcessed || 0
      }
    } catch (error) {
      console.warn('Failed to fetch bot stats:', error)
    }

    return NextResponse.json({
      memberCount,
      onlineCount,
      ticketsProcessed,
      serverName: widgetData.name,
      channels: widgetData.channels?.length || 0,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to fetch Discord server stats:', error)
    
    return NextResponse.json({
      error: 'Failed to fetch Discord server stats',
      message: error instanceof Error ? error.message : 'Unknown error',
      memberCount: 0,
      onlineCount: 0,
      ticketsProcessed: 0
    }, { status: 500 })
  }
}
