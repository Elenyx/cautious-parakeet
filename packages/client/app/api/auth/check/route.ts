import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const requiredEnvVars = [
      'DISCORD_CLIENT_ID',
      'DISCORD_CLIENT_SECRET', 
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        error: 'Missing environment variables',
        missing: missingVars,
        status: 'error'
      }, { status: 500 })
    }

    return NextResponse.json({
      status: 'ok',
      message: 'All required environment variables are present',
      hasClientId: !!process.env.DISCORD_CLIENT_ID,
      hasClientSecret: !!process.env.DISCORD_CLIENT_SECRET,
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      hasUrl: !!process.env.NEXTAUTH_URL
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check environment',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
