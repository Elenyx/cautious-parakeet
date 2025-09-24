import Redis from 'ioredis';

/**
 * Redis service for client-side caching
 * Provides caching functionality to reduce API calls and improve performance
 */
export class ClientRedisService {
  private static instance: ClientRedisService;
  private redis: Redis;

  private constructor() {
    this.redis = new Redis(process.env.REDIS_URL!, {
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.redis.on('error', (err) => {
      console.error('[Redis] Connection error:', err);
    });

    this.redis.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });
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
  async cacheGuildData(guildId: string, data: any, ttlSeconds: number = 300): Promise<void> {
    try {
      await this.redis.setex(`client:guild:${guildId}`, ttlSeconds, JSON.stringify(data));
    } catch (error) {
      console.error('[Redis] Error caching guild data:', error);
    }
  }

  /**
   * Get cached guild data
   */
  async getCachedGuildData(guildId: string): Promise<any | null> {
    try {
      const data = await this.redis.get(`client:guild:${guildId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Redis] Error getting cached guild data:', error);
      return null;
    }
  }

  /**
   * Cache user guilds list
   */
  async cacheUserGuilds(userId: string, guilds: any[], ttlSeconds: number = 300): Promise<void> {
    try {
      await this.redis.setex(`client:user:${userId}:guilds`, ttlSeconds, JSON.stringify(guilds));
    } catch (error) {
      console.error('[Redis] Error caching user guilds:', error);
    }
  }

  /**
   * Get cached user guilds
   */
  async getCachedUserGuilds(userId: string): Promise<any[] | null> {
    try {
      const data = await this.redis.get(`client:user:${userId}:guilds`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Redis] Error getting cached user guilds:', error);
      return null;
    }
  }

  /**
   * Cache API response with TTL
   */
  async cacheApiResponse(key: string, data: any, ttlSeconds: number = 300): Promise<void> {
    try {
      await this.redis.setex(`client:api:${key}`, ttlSeconds, JSON.stringify(data));
    } catch (error) {
      console.error('[Redis] Error caching API response:', error);
    }
  }

  /**
   * Get cached API response
   */
  async getCachedApiResponse(key: string): Promise<any | null> {
    try {
      const data = await this.redis.get(`client:api:${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[Redis] Error getting cached API response:', error);
      return null;
    }
  }

  /**
   * Check if we're being rate limited for a specific endpoint
   */
  async isRateLimited(endpoint: string): Promise<boolean> {
    try {
      const rateLimitKey = `client:ratelimit:${endpoint}`;
      const exists = await this.redis.exists(rateLimitKey);
      return exists === 1;
    } catch (error) {
      console.error('[Redis] Error checking rate limit:', error);
      return false;
    }
  }

  /**
   * Set rate limit for an endpoint
   */
  async setRateLimit(endpoint: string, retryAfterSeconds: number): Promise<void> {
    try {
      const rateLimitKey = `client:ratelimit:${endpoint}`;
      await this.redis.setex(rateLimitKey, retryAfterSeconds, '1');
    } catch (error) {
      console.error('[Redis] Error setting rate limit:', error);
    }
  }

  /**
   * Clear cache for a specific pattern
   */
  async clearCache(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(`client:${pattern}`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error('[Redis] Error clearing cache:', error);
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      console.error('[Redis] Error disconnecting:', error);
    }
  }
}