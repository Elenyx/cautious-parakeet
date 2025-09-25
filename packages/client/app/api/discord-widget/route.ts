import { NextResponse } from "next/server";

/**
 * Proxies Discord widget API requests to avoid CORS issues
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serverId = searchParams.get('serverId');

  if (!serverId) {
    return NextResponse.json({ error: 'Server ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://discord.com/api/guilds/${serverId}/widget.json`, {
      headers: {
        'User-Agent': 'TicketMesh/1.0',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Discord server data' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Discord widget API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
