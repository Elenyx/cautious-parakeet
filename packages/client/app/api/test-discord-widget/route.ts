import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const serverId = '1420828084805959702'
    const widgetUrl = `https://discord.com/widget?id=${serverId}&theme=dark`
    
    // Test if the widget URL is accessible
    const response = await fetch(widgetUrl, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    return NextResponse.json({
      serverId,
      widgetUrl,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      accessible: response.ok,
      message: response.ok 
        ? 'Widget URL is accessible' 
        : 'Widget URL is not accessible - server widget may not be enabled'
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test Discord widget',
      message: error instanceof Error ? error.message : 'Unknown error',
      serverId: '1420828084805959702',
      widgetUrl: 'https://discord.com/widget?id=1420828084805959702&theme=dark'
    }, { status: 500 })
  }
}
