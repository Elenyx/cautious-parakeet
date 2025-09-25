import Redis from 'ioredis';

/**
 * Redis service for client-side caching
 * Provides caching functionality to reduce API calls and improve performance
 * Falls back to in-memory caching when Redis is not available
 */
export class ClientRedisService {
  private static instance: ClientRedisService;
  private redis: Redis | null = null;
  private isRedisAvailable: boolean = false;
  private memoryCache: Map<string, { data: unknown; expiry: number }> = new Map();

  private constructor() {
    // Only initialize Redis if REDIS_URL is provided
    if (process.env.REDIS_URL) {
      try {
        this.redis = new Redis(process.env.REDIS_URL, {
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true,
          connectTimeout: 5000,
          commandTimeout: 5000,
        });

        this.redis.on('error', (err) => {
          console.warn('[Redis] Connection error, falling back to memory cache:', err.message);
          this.isRedisAvailable = false;
        });

        this.redis.on('connect', () => {
          console.log('[Redis] Connected successfully');
          this.isRedisAvailable = true;
        });

        this.redis.on('close', () => {
          console.warn('[Redis] Connection closed, falling back to memory cache');
          this.isRedisAvailable = false;
        });
      } catch (error) {
        console.warn('[Redis] Failed to initialize Redis, using memory cache:', error);
        this.redis = null;
        this.isRedisAvailable = false;
      }
    } else {
      console.info('[Redis] REDIS_URL not provided, using in-memory cache');
      this.isRedisAvailable = false;
    }

    // Clean up expired memory cache entries every 5 minutes
    setInterval(() => {
      this.cleanupMemoryCache();
    }, 5 * 60 * 1000);
  }

  /**
   * Clean up expired entries from memory cache
   */
  private cleanupMemoryCache(): void {
    const now = Date.now();
    for (const [key, value] of this.memoryCache.entries()) {
      if (value.expiry < now) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Get singleton instance of Redis service
   */
  public static getInstance(): ClientRedisService {
    if (!ClientRedisService.instance) {
      ClientRedisService.instance = new ClientRedisService();
    }
    return ClientRedisService.instance;
  }

  /**
   * Cache guild data with TTL
   */
  async cacheGuildData(guildId: string, data: unknown, ttlSeconds: number = 300): Promise<void> {
    const key = `client:guild:${guildId}`;
    
    if (this.redis && this.isRedisAvailable) {
      try {
        await this.redis.setex(key, ttlSeconds, JSON.stringify(data));
        return;
      } catch (error) {
        console.warn('[Redis] Error caching guild data, falling back to memory:', error);
        this.isRedisAvailable = false;
      }
    }
    
    // Fallback to memory cache
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.memoryCache.set(key, { data, expiry });
  }

  /**
   * Get cached guild data
   */
  async getCachedGuildData(guildId: string): Promise<unknown | null> {
    const key = `client:guild:${guildId}`;
    
    if (this.redis && this.isRedisAvailable) {
      try {
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.warn('[Redis] Error getting cached guild data, falling back to memory:', error);
        this.isRedisAvailable = false;
      }
    }
    
    // Fallback to memory cache
    const cached = this.memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    } else if (cached) {
      this.memoryCache.delete(key);
    }
    return null;
  }

  /**
   * Cache user guilds list
   */
  async cacheUserGuilds(userId: string, guilds: unknown[], ttlSeconds: number = 300): Promise<void> {
    const key = `client:user:${userId}:guilds`;
    
    if (this.redis && this.isRedisAvailable) {
      try {
        await this.redis.setex(key, ttlSeconds, JSON.stringify(guilds));
        return;
      } catch (error) {
        console.warn('[Redis] Error caching user guilds, falling back to memory:', error);
        this.isRedisAvailable = false;
      }
    }
    
    // Fallback to memory cache
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.memoryCache.set(key, { data: guilds, expiry });
  }

  /**
   * Get cached user guilds
   */
  async getCachedUserGuilds(userId: string): Promise<unknown[] | null> {
    const key = `client:user:${userId}:guilds`;
    
    if (this.redis && this.isRedisAvailable) {
      try {
        const cached = await this.redis.get(key);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.warn('[Redis] Error getting cached user guilds, falling back to memory:', error);
        this.isRedisAvailable = false;
      }
    }
    
    // Fallback to memory cache
    const cached = this.memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    } else if (cached) {
      this.memoryCache.delete(key);
    }
    return null;
  }

  /**
   * Cache API response with TTL
   */
  async cacheApiResponse(key: string, data: unknown, ttlSeconds: number = 300): Promise<void> {
    const cacheKey = `client:api:${key}`;
    
    if (this.redis && this.isRedisAvailable) {
      try {
        await this.redis.setex(cacheKey, ttlSeconds, JSON.stringify(data));
        return;
      } catch (error) {
        console.warn('[Redis] Error caching API response, falling back to memory:', error);
        this.isRedisAvailable = false;
      }
    }
    
    // Fallback to memory cache
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.memoryCache.set(cacheKey, { data, expiry });
  }

  /**
   * Get cached API response
   */
  async getCachedApiResponse(key: string): Promise<unknown | null> {
    const cacheKey = `client:api:${key}`;
    
    if (this.redis && this.isRedisAvailable) {
      try {
        const cached = await this.redis.get(cacheKey);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.warn('[Redis] Error getting cached API response, falling back to memory:', error);
        this.isRedisAvailable = false;
      }
    }
    
    // Fallback to memory cache
    const cached = this.memoryCache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    } else if (cached) {
      this.memoryCache.delete(cacheKey);
    }
    return null;
  }

  /**
   * Check if we're being rate limited for a specific endpoint
   */
  async isRateLimited(endpoint: string): Promise<boolean> {
    const rateLimitKey = `client:ratelimit:${endpoint}`;
    
    if (this.redis && this.isRedisAvailable) {
      try {
        const exists = await this.redis.exists(rateLimitKey);
        return exists === 1;
      } catch (error) {
        console.warn('[Redis] Error checking rate limit, falling back to memory:', error);
        this.isRedisAvailable = false;
      }
    }
    
    // Fallback to memory cache
    const cached = this.memoryCache.get(rateLimitKey);
    return cached && cached.expiry > Date.now();
  }

  /**
   * Set rate limit for an endpoint
   */
  async setRateLimit(endpoint: string, retryAfterSeconds: number): Promise<void> {
    const rateLimitKey = `client:ratelimit:${endpoint}`;
    
    if (this.redis && this.isRedisAvailable) {
      try {
        await this.redis.setex(rateLimitKey, retryAfterSeconds, '1');
        return;
      } catch (error) {
        console.warn('[Redis] Error setting rate limit, falling back to memory:', error);
        this.isRedisAvailable = false;
      }
    }
    
    // Fallback to memory cache
    const expiry = Date.now() + (retryAfterSeconds * 1000);
    this.memoryCache.set(rateLimitKey, { data: '1', expiry });
  }

  /**
   * Clear cache for a specific pattern
   */
  async clearCache(pattern: string): Promise<void> {
    const fullPattern = `client:${pattern}`;
    
    if (this.redis && this.isRedisAvailable) {
      try {
        const keys = await this.redis.keys(fullPattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      } catch (error) {
        console.warn('[Redis] Error clearing cache, falling back to memory:', error);
        this.isRedisAvailable = false;
      }
    }
    
    // Clear from memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(fullPattern.replace('*', ''))) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.quit();
      } catch (error) {
        console.error('[Redis] Error disconnecting:', error);
      }
    }
    
    // Clear memory cache
    this.memoryCache.clear();
  }
}