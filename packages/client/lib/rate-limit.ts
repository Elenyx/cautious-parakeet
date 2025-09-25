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
        // Return a shorter retry after time for better real-time experience
        return { limited: true, retryAfter: 30 };
      }
      return { limited: false };
    } catch (error) {
      console.warn('[RateLimit] Error checking rate limit:', error);
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
      console.warn('[RateLimit] Error setting rate limit:', error);
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
              'Retry-After': rateLimitCheck.retryAfter?.toString() || '30'
            }
          }
        );
      }

      try {
        return await handler(req);
      } catch (error: unknown) {
        // Check if this is a Discord API rate limit error
        const errorObj = error as { status?: number; code?: number; retry_after?: number };
        if (errorObj.status === 429 || errorObj.code === 429) {
          const retryAfter = Math.min(errorObj.retry_after || 30, 60); // Cap at 60 seconds max
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
    } catch (error: unknown) {
      // If it's a rate limit error, handle it
      if (error instanceof Error && error.message.includes('Rate limited')) {
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
): Promise<unknown> {
  const response = await RateLimitMiddleware.fetchWithCache(url, options, cacheKey, cacheTTL);
  
  if (!response.ok) {
    throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}