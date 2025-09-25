import { NextRequest, NextResponse } from 'next/server';
import { ClientRedisService } from './redis';

/**
 * Rate limiting middleware for Discord API calls
 * Handles rate limits proactively and provides caching
 * Implements Discord API best practices for rate limiting
 */
export class RateLimitMiddleware {
  private static redis = ClientRedisService.getInstance();
  private static pendingRequests = new Map<string, Promise<Response>>();
  private static requestQueue = new Map<string, Array<() => Promise<void>>>();
  private static isProcessingQueue = false;
  private static globalRequestCount = 0;
  private static lastGlobalReset = Date.now();
  
  // Discord API limits based on official documentation
  private static readonly GLOBAL_RATE_LIMIT = 50; // requests per second
  private static readonly PER_ROUTE_LIMITS = new Map<string, { limit: number; window: number }>([
    ['/users/@me/guilds', { limit: 5, window: 60000 }], // 5 per minute
    ['/guilds', { limit: 10, window: 60000 }], // 10 per minute
    ['/channels', { limit: 5, window: 60000 }], // 5 per minute
    ['/webhooks', { limit: 30, window: 60000 }], // 30 per minute
  ]);

  /**
   * Check if an endpoint is currently rate limited
   */
  static async checkRateLimit(endpoint: string): Promise<{ limited: boolean; retryAfter?: number }> {
    try {
      const rateLimitInfo = await this.redis.getRateLimitInfo(endpoint);
      if (rateLimitInfo) {
        return { limited: true, retryAfter: rateLimitInfo.retryAfter };
      }
      return { limited: false };
    } catch (error) {
      console.warn('[RateLimit] Error checking rate limit:', error);
      return { limited: false };
    }
  }

  /**
   * Check global rate limit (50 requests per second)
   */
  private static checkGlobalRateLimit(): boolean {
    const now = Date.now();
    const timeSinceReset = now - this.lastGlobalReset;
    
    // Reset counter every second
    if (timeSinceReset >= 1000) {
      this.globalRequestCount = 0;
      this.lastGlobalReset = now;
    }
    
    return this.globalRequestCount < this.GLOBAL_RATE_LIMIT;
  }

  /**
   * Increment global request counter
   */
  private static incrementGlobalCounter(): void {
    this.globalRequestCount++;
  }

  /**
   * Check per-route rate limit
   */
  private static async checkPerRouteLimit(endpoint: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    const routeLimit = this.PER_ROUTE_LIMITS.get(endpoint);
    if (!routeLimit) {
      return { allowed: true };
    }

    try {
      const routeKey = `route_limit:${endpoint}`;
      const currentCount = await this.redis.getCachedApiResponse(routeKey) as number || 0;
      
      if (currentCount >= routeLimit.limit) {
        const retryAfter = Math.ceil(routeLimit.window / 1000);
        return { allowed: false, retryAfter };
      }
      
      return { allowed: true };
    } catch (error) {
      console.warn('[RateLimit] Error checking per-route limit:', error);
      return { allowed: true };
    }
  }

  /**
   * Increment per-route counter
   */
  private static async incrementPerRouteCounter(endpoint: string): Promise<void> {
    const routeLimit = this.PER_ROUTE_LIMITS.get(endpoint);
    if (!routeLimit) return;

    try {
      const routeKey = `route_limit:${endpoint}`;
      const currentCount = await this.redis.getCachedApiResponse(routeKey) as number || 0;
      await this.redis.cacheApiResponse(routeKey, currentCount + 1, Math.ceil(routeLimit.window / 1000));
    } catch (error) {
      console.warn('[RateLimit] Error incrementing per-route counter:', error);
    }
  }

  /**
   * Parse Discord rate limit headers
   */
  private static parseRateLimitHeaders(response: Response): {
    remaining: number;
    reset: number;
    retryAfter?: number;
  } {
    const remaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0');
    const reset = parseInt(response.headers.get('x-ratelimit-reset') || '0');
    const retryAfter = response.headers.get('retry-after');
    
    return {
      remaining,
      reset: reset * 1000, // Convert to milliseconds
      retryAfter: retryAfter ? parseInt(retryAfter) : undefined
    };
  }

  /**
   * Calculate exponential backoff delay
   */
  private static calculateBackoffDelay(attempt: number, baseDelay: number = 1000): number {
    const maxDelay = 30000; // 30 seconds max
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    // Add jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }

  /**
   * Add request to queue for rate-limited endpoints
   */
  private static async queueRequest(endpoint: string, requestFn: () => Promise<void>): Promise<void> {
    if (!this.requestQueue.has(endpoint)) {
      this.requestQueue.set(endpoint, []);
    }
    
    this.requestQueue.get(endpoint)!.push(requestFn);
    
    // Start processing queue if not already processing
    if (!this.isProcessingQueue) {
      this.processRequestQueue();
    }
  }

  /**
   * Process the request queue with proper rate limiting
   */
  private static async processRequestQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    
    this.isProcessingQueue = true;
    
    try {
      while (this.requestQueue.size > 0) {
        for (const [endpoint, requests] of this.requestQueue.entries()) {
          if (requests.length === 0) {
            this.requestQueue.delete(endpoint);
            continue;
          }
          
          // Check if we can make a request for this endpoint
          const rateLimitCheck = await this.checkRateLimit(endpoint);
          if (rateLimitCheck.limited) {
            // Wait for rate limit to reset
            await new Promise(resolve => setTimeout(resolve, (rateLimitCheck.retryAfter || 30) * 1000));
            continue;
          }
          
          // Check global rate limit
          if (!this.checkGlobalRateLimit()) {
            // Wait for global rate limit reset
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          
          // Execute the next request in the queue
          const requestFn = requests.shift()!;
          try {
            await requestFn();
          } catch (error) {
            console.error(`[RateLimit] Queued request failed for ${endpoint}:`, error);
          }
        }
        
        // Small delay between queue processing cycles
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } finally {
      this.isProcessingQueue = false;
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
   * Generate a unique key for request deduplication
   */
  private static generateRequestKey(url: string, options: RequestInit = {}): string {
    const method = options.method || 'GET';
    const headers = options.headers ? JSON.stringify(options.headers) : '';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${url}:${headers}:${body}`;
  }

  /**
   * Fetch with automatic rate limit handling, caching, and deduplication
   * Implements exponential backoff and proper Discord API rate limit handling
   */
  static async fetchWithCache(
    url: string, 
    options: RequestInit = {},
    cacheKey?: string,
    cacheTTL: number = 300,
    maxRetries: number = 3
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

    // Check for pending requests to prevent duplicates
    const requestKey = this.generateRequestKey(url, options);
    if (this.pendingRequests.has(requestKey)) {
      console.log(`[Deduplication] Reusing pending request for ${url}`);
      return this.pendingRequests.get(requestKey)!;
    }

    const endpoint = new URL(url).pathname;
    
    // Check all rate limits before making request
    const rateLimitCheck = await this.checkRateLimit(endpoint);
    if (rateLimitCheck.limited) {
      // Queue the request instead of throwing immediately
      return new Promise((resolve, reject) => {
        this.queueRequest(endpoint, async () => {
          try {
            const response = await this.executeRequestWithRetry(url, options, cacheKey, cacheTTL, maxRetries);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    // Check global rate limit
    if (!this.checkGlobalRateLimit()) {
      // Queue the request instead of throwing immediately
      return new Promise((resolve, reject) => {
        this.queueRequest(endpoint, async () => {
          try {
            const response = await this.executeRequestWithRetry(url, options, cacheKey, cacheTTL, maxRetries);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    // Check per-route rate limit
    const perRouteCheck = await this.checkPerRouteLimit(endpoint);
    if (!perRouteCheck.allowed) {
      // Queue the request instead of throwing immediately
      return new Promise((resolve, reject) => {
        this.queueRequest(endpoint, async () => {
          try {
            const response = await this.executeRequestWithRetry(url, options, cacheKey, cacheTTL, maxRetries);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });
    }

    // Create the request promise with retry logic and store it for deduplication
    const requestPromise = this.executeRequestWithRetry(url, options, cacheKey, cacheTTL, maxRetries);
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const response = await requestPromise;
      return response;
    } finally {
      // Clean up the pending request
      this.pendingRequests.delete(requestKey);
    }
  }

  /**
   * Execute request with exponential backoff retry logic
   */
  private static async executeRequestWithRetry(
    url: string,
    options: RequestInit,
    cacheKey?: string,
    cacheTTL: number = 300,
    maxRetries: number = 3
  ): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Increment counters before making request
        this.incrementGlobalCounter();
        const endpoint = new URL(url).pathname;
        await this.incrementPerRouteCounter(endpoint);
        
        const response = await this.executeRequest(url, options, cacheKey, cacheTTL);
        
        // Parse and log rate limit headers for monitoring
        const rateLimitInfo = this.parseRateLimitHeaders(response);
        if (rateLimitInfo.remaining < 5) {
          console.warn(`[RateLimit] Low remaining requests for ${endpoint}: ${rateLimitInfo.remaining}`);
        }
        
        return response;
      } catch (error: unknown) {
        lastError = error as Error;
        
        // If it's a rate limit error, handle it with exponential backoff
        if (error instanceof Error && error.message.includes('Rate limited')) {
          if (attempt < maxRetries) {
            const backoffDelay = this.calculateBackoffDelay(attempt);
            console.warn(`[RateLimit] Retry ${attempt + 1}/${maxRetries} after ${backoffDelay}ms for ${url}`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            continue;
          }
        }
        
        // For non-rate-limit errors or final attempt, throw immediately
        if (attempt === maxRetries || !(error instanceof Error && error.message.includes('Rate limited'))) {
          throw error;
        }
      }
    }
    
    throw lastError || new Error('Request failed after all retries');
  }

  /**
   * Execute the actual request
   */
  private static async executeRequest(
    url: string,
    options: RequestInit,
    cacheKey?: string,
    cacheTTL: number = 300
  ): Promise<Response> {
    try {
      const response = await fetch(url, options);

      // Handle rate limit response with proper header parsing
      if (response.status === 429) {
        const endpoint = new URL(url).pathname;
        const rateLimitInfo = this.parseRateLimitHeaders(response);
        const retryAfter = rateLimitInfo.retryAfter || 60;
        
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
 * Helper function for cached Discord API calls with enhanced rate limiting
 */
export async function cachedDiscordFetch(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTTL: number = 300,
  maxRetries: number = 3
): Promise<unknown> {
  const response = await RateLimitMiddleware.fetchWithCache(url, options, cacheKey, cacheTTL, maxRetries);
  
  if (!response.ok) {
    throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Enhanced Discord API fetch with automatic retry and rate limit handling
 * Specifically designed for Discord API endpoints
 */
export async function discordApiFetch(
  url: string,
  options: RequestInit = {},
  cacheKey?: string,
  cacheTTL: number = 300
): Promise<Response> {
  // Add Discord-specific headers
  const enhancedOptions: RequestInit = {
    ...options,
    headers: {
      'User-Agent': 'TicketMesh-Client/1.0',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  return RateLimitMiddleware.fetchWithCache(url, enhancedOptions, cacheKey, cacheTTL);
}