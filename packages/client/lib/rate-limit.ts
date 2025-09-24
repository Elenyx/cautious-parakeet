import { NextRequest, NextResponse } from 'next/server';
import { ClientRedisService } from './redis';

/**
 * Rate limiting middleware for Discord API calls
 * Handles rate limits proactively and provides caching
 */
export class RateLimitMiddleware {
  private static redis = ClientRedisService.getInstance();

  /**
   * Check if an endpoint is currently rate limited
   */
  static async checkRateLimit(endpoint: string): Promise<{ limited: boolean; retryAfter?: number }> {
    try {
      const isLimited = await this.redis.isRateLimited(endpoint);
      if (isLimited) {
        // Get the TTL to know when the rate limit expires
        const ttl = await this.redis['redis'].ttl(`client:ratelimit:${endpoint}`);
        return { limited: true, retryAfter: ttl > 0 ? ttl : 60 };
      }
      return { limited: false };
    } catch (error) {
      console.error('[RateLimit] Error checking rate limit:', error);
      return { limited: false };
    }
  }

  /**
   * Handle rate limit response from Discord API
   */
  static async handleRateLimit(endpoint: string, retryAfter: number): Promise<void> {
    try {
      await this.redis.setRateLimit(endpoint, retryAfter);
      console.warn(`[RateLimit] Rate limited for ${endpoint}, retry after ${retryAfter}s`);
    } catch (error) {
      console.error('[RateLimit] Error setting rate limit:', error);
    }
  }

  /**
   * Middleware wrapper for API routes
   */
  static withRateLimit(handler: (req: NextRequest) => Promise<NextResponse>) {
    return async (req: NextRequest): Promise<NextResponse> => {
      const endpoint = req.nextUrl.pathname;
      
      // Check if we're currently rate limited
      const rateLimitCheck = await this.checkRateLimit(endpoint);
      if (rateLimitCheck.limited) {
        return NextResponse.json(
          { 
            error: 'Rate limited', 
            retryAfter: rateLimitCheck.retryAfter,
            message: `Please wait ${rateLimitCheck.retryAfter} seconds before retrying`
          },
          { 
            status: 429,
            headers: {
              'Retry-After': rateLimitCheck.retryAfter?.toString() || '60'
            }
          }
        );
      }

      try {
        return await handler(req);
      } catch (error: any) {
        // Check if this is a Discord API rate limit error
        if (error.status === 429 || error.code === 429) {
          const retryAfter = error.retry_after || 60;
          await this.handleRateLimit(endpoint, retryAfter);
          
          return NextResponse.json(
            { 
              error: 'Discord API rate limited', 
              retryAfter,
              message: `Discord API rate limit hit, retry after ${retryAfter} seconds`
            },
            { 
              status: 429,
              headers: {
                'Retry-After': retryAfter.toString()
              }
            }
          );
        }

        // Re-throw other errors
        throw error;
      }
    };
  }

  /**
   * Fetch with automatic rate limit handling and caching
   */
  static async fetchWithCache(
    url: string, 
    options: RequestInit = {},
    cacheKey?: string,
    cacheTTL: number = 300
  ): Promise<Response> {
    // Check cache first if cache key is provided
    if (cacheKey) {
      const cached = await this.redis.getCachedApiResponse(cacheKey);
      if (cached) {
        console.log(`[Cache] Hit for ${cacheKey}`);
        return new Response(JSON.stringify(cached), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Check rate limit
    const endpoint = new URL(url).pathname;
    const rateLimitCheck = await this.checkRateLimit(endpoint);
    if (rateLimitCheck.limited) {
      throw new Error(`Rate limited for ${endpoint}, retry after ${rateLimitCheck.retryAfter}s`);
    }

    try {
      const response = await fetch(url, options);

      // Handle rate limit response
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get('retry-after') || '60');
        await this.handleRateLimit(endpoint, retryAfter);
        throw new Error(`Rate limited, retry after ${retryAfter}s`);
      }

      // Cache successful responses
      if (response.ok && cacheKey) {
        const data = await response.clone().json();
        await this.redis.cacheApiResponse(cacheKey, data, cacheTTL);
        console.log(`[Cache] Stored ${cacheKey} for ${cacheTTL}s`);
      }

      return response;
    } catch (error: any) {
      // If it's a rate limit error, handle it
      if (error.message.includes('Rate limited')) {
        throw error;
      }

      // For other errors, log and re-throw
      console.error('[RateLimit] Fetch error:', error);
      throw error;
    }
  }
}

/**
 * Helper function to create rate-limited API routes
 */
export function createRateLimitedRoute(handler: (req: NextRequest) => Promise<NextResponse>) {
  return RateLimitMiddleware.withRateLimit(handler);
}

/**
 * Helper function for cached Discord API calls
 */
export async function cachedDiscordFetch(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTTL: number = 300
): Promise<any> {
  const response = await RateLimitMiddleware.fetchWithCache(url, options, cacheKey, cacheTTL);
  
  if (!response.ok) {
    throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}