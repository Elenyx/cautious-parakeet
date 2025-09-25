import { NextResponse } from 'next/server'
import { DatabaseHealthChecker } from '@/lib/database-health'

export async function GET() {
  try {
    // Perform real PostgreSQL health check
    const healthResult = await DatabaseHealthChecker.checkHealth()
    
    if (healthResult.status === 'healthy') {
      return NextResponse.json({
        status: 'healthy',
        responseTime: healthResult.responseTime,
        timestamp: new Date().toISOString(),
        database: {
          type: 'postgresql',
          connected: healthResult.details.connected,
          queryTime: healthResult.details.queryTime,
          poolStats: healthResult.details.poolStats,
          // Add Railway-specific info if available
          environment: process.env.NODE_ENV,
          region: process.env.RAILWAY_REGION || 'unknown'
        }
      })
    } else {
      return NextResponse.json(
        { 
          status: 'unhealthy', 
          responseTime: healthResult.responseTime,
          error: healthResult.details.error || 'Database connection failed',
          timestamp: new Date().toISOString(),
          database: {
            type: 'postgresql',
            connected: false,
            poolStats: healthResult.details.poolStats
          }
        },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('Database health check failed:', error)
    
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: 'Database health check failed',
        timestamp: new Date().toISOString(),
        database: {
          type: 'postgresql',
          connected: false
        }
      },
      { status: 503 }
    )
  }
}
