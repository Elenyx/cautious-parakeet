import { NextResponse } from "next/server"
import { botApiHealth } from "@/lib/bot-api"

/**
 * Health check endpoint for Railway deployment
 * GET /api/health
 */
export async function GET() {
  try {
    // Basic health check - verify environment variables are loaded
    const requiredEnvVars = [
      'DISCORD_CLIENT_ID',
      'DISCORD_CLIENT_SECRET', 
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ]
    
    const optionalEnvVars = [
      'API_SECRET',
      'BOT_API_BASE_URL'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
    
    if (missingVars.length > 0) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Missing environment variables",
          missing: missingVars,
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      )
    }

    // Check if we can reach the bot service (if configured)
    let botServiceStatus = "unknown"
    if (process.env.BOT_API_BASE_URL) {
      try {
        const botHealthResponse = await botApiHealth()
        botServiceStatus = botHealthResponse.ok ? "healthy" : "unhealthy"
      } catch (_error) {
        botServiceStatus = "unreachable"
      }
    }

    return NextResponse.json({
      ok: true,
      service: "ticketmesh-client",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "unknown",
      botService: {
        url: process.env.BOT_API_BASE_URL || "not configured",
        status: botServiceStatus
      },
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID ? "configured" : "missing",
        authUrl: process.env.NEXTAUTH_URL || "not configured"
      },
      security: {
        apiSecret: process.env.API_SECRET ? "configured" : "missing - unauthenticated requests to bot service"
      }
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      { 
        ok: false, 
        error: "Health check failed",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}