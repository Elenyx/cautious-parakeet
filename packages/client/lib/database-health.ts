/**
 * Database health check utility for Railway PostgreSQL
 * This uses a simple HTTP-based approach to avoid bundling issues
 */
export class DatabaseHealthChecker {
  /**
   * Perform a database health check by calling the bot service
   * This avoids bundling pg in the client package
   */
  private static async callBotHealthCheck(): Promise<{
    status: 'healthy' | 'unhealthy'
    responseTime: number
    details: {
      connected: boolean
      queryTime: number
      poolStats: {
        totalCount: number
        idleCount: number
        waitingCount: number
      }
      error?: string
    }
  }> {
    const startTime = Date.now()
    
    try {
      const botApiUrl = process.env.BOT_API_BASE_URL || 'http://localhost:3001'
      console.log(`[DatabaseHealth] Checking bot service at: ${botApiUrl}/health`)
      
      const response = await fetch(`${botApiUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(10000), // Increased timeout
        headers: {
          'User-Agent': 'TicketMesh-Client/1.0'
        }
      })
      
      const responseTime = Date.now() - startTime
      
      if (response.ok) {
        const healthData = await response.json()
        
        if (healthData.ok && healthData.services?.database?.status === 'connected') {
          return {
            status: 'healthy',
            responseTime,
            details: {
              connected: true,
              queryTime: healthData.services.database.responseTime || 0,
              poolStats: {
                totalCount: 0,
                idleCount: 0,
                waitingCount: 0
              }
            }
          }
        } else {
          return {
            status: 'unhealthy',
            responseTime,
            details: {
              connected: false,
              queryTime: 0,
              poolStats: {
                totalCount: 0,
                idleCount: 0,
                waitingCount: 0
              },
              error: 'Database not connected according to bot service'
            }
          }
        }
      } else {
        const errorText = await response.text().catch(() => 'Unknown error')
        console.error(`[DatabaseHealth] Bot service returned ${response.status}: ${errorText}`)
        return {
          status: 'unhealthy',
          responseTime,
          details: {
            connected: false,
            queryTime: 0,
            poolStats: {
              totalCount: 0,
              idleCount: 0,
              waitingCount: 0
            },
            error: `Bot service returned ${response.status}: ${errorText}`
          }
        }
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[DatabaseHealth] Failed to check bot service: ${errorMessage}`)
      return {
        status: 'unhealthy',
        responseTime,
        details: {
          connected: false,
          queryTime: 0,
          poolStats: {
            totalCount: 0,
            idleCount: 0,
            waitingCount: 0
          },
          error: `Connection failed: ${errorMessage}`
        }
      }
    }
  }

  /**
   * Perform a comprehensive database health check
   */
  static async checkHealth(): Promise<{
    status: 'healthy' | 'unhealthy'
    responseTime: number
    details: {
      connected: boolean
      queryTime: number
      poolStats: {
        totalCount: number
        idleCount: number
        waitingCount: number
      }
      error?: string
    }
  }> {
    return await this.callBotHealthCheck()
  }

}
