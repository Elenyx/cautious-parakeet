import Redis from 'ioredis';
import { GuildMember, Role, GuildChannel } from 'discord.js';

/**
 * Redis service for caching Discord data and managing rate limits
 */
export class RedisService {
    private redis: Redis;
    private static instance: RedisService;

    private constructor() {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            throw new Error('REDIS_URL environment variable is required');
        }

        this.redis = new Redis(redisUrl, {
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
        });

        this.redis.on('error', (error) => {
            console.error('Redis connection error:', error);
        });

        this.redis.on('connect', () => {
            console.log('✅ Connected to Redis');
        });
    }

    /**
     * Get singleton instance of RedisService
     */
    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    /**
     * Cache guild data with expiration
     */
    async cacheGuildData(guildId: string, data: any, ttlSeconds: number = 300): Promise<void> {
        const key = `guild:${guildId}`;
        await this.redis.setex(key, ttlSeconds, JSON.stringify(data));
    }

    /**
     * Get cached guild data
     */
    async getCachedGuildData(guildId: string): Promise<any | null> {
        const key = `guild:${guildId}`;
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Cache guild members with expiration
     */
    async cacheGuildMembers(guildId: string, members: GuildMember[], ttlSeconds: number = 600): Promise<void> {
        const key = `guild:${guildId}:members`;
        const memberData = members.map(member => ({
            id: member.id,
            username: member.user.username,
            displayName: member.displayName,
            avatar: member.user.avatar,
            roles: member.roles.cache.map(role => role.id),
            joinedAt: member.joinedAt?.toISOString(),
        }));
        await this.redis.setex(key, ttlSeconds, JSON.stringify(memberData));
    }

    /**
     * Get cached guild members
     */
    async getCachedGuildMembers(guildId: string): Promise<any[] | null> {
        const key = `guild:${guildId}:members`;
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Cache guild channels with expiration
     */
    async cacheGuildChannels(guildId: string, channels: GuildChannel[], ttlSeconds: number = 300): Promise<void> {
        const key = `guild:${guildId}:channels`;
        const channelData = channels.map(channel => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
            parentId: channel.parentId,
            position: channel.position,
        }));
        await this.redis.setex(key, ttlSeconds, JSON.stringify(channelData));
    }

    /**
     * Get cached guild channels
     */
    async getCachedGuildChannels(guildId: string): Promise<any[] | null> {
        const key = `guild:${guildId}:channels`;
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Cache guild roles with expiration
     */
    async cacheGuildRoles(guildId: string, roles: Role[], ttlSeconds: number = 300): Promise<void> {
        const key = `guild:${guildId}:roles`;
        const roleData = roles.map(role => ({
            id: role.id,
            name: role.name,
            color: role.color,
            position: role.position,
            permissions: role.permissions.bitfield.toString(),
        }));
        await this.redis.setex(key, ttlSeconds, JSON.stringify(roleData));
    }

    /**
     * Get cached guild roles
     */
    async getCachedGuildRoles(guildId: string): Promise<any[] | null> {
        const key = `guild:${guildId}:roles`;
        const data = await this.redis.get(key);
        return data ? JSON.parse(data) : null;
    }

    /**
     * Rate limiting: Check if we can make a request to a specific endpoint
     */
    async canMakeRequest(endpoint: string): Promise<boolean> {
        const key = `ratelimit:${endpoint}`;
        const current = await this.redis.get(key);
        return current === null;
    }

    /**
     * Rate limiting: Set rate limit for an endpoint
     */
    async setRateLimit(endpoint: string, retryAfterSeconds: number): Promise<void> {
        const key = `ratelimit:${endpoint}`;
        await this.redis.setex(key, retryAfterSeconds, '1');
    }

    /**
     * Rate limiting: Get remaining time for rate limit
     */
    async getRateLimitTTL(endpoint: string): Promise<number> {
        const key = `ratelimit:${endpoint}`;
        return await this.redis.ttl(key);
    }

    /**
     * Cache bot presence data for guilds
     */
    async cacheBotPresence(guildId: string, isPresent: boolean, ttlSeconds: number = 60): Promise<void> {
        const key = `bot:presence:${guildId}`;
        await this.redis.setex(key, ttlSeconds, isPresent ? '1' : '0');
    }

    /**
     * Get cached bot presence data
     */
    async getCachedBotPresence(guildId: string): Promise<boolean | null> {
        const key = `bot:presence:${guildId}`;
        const data = await this.redis.get(key);
        return data === null ? null : data === '1';
    }

    /**
     * Cache multiple bot presence checks
     */
    async cacheBotPresenceMultiple(presenceData: { guildId: string; present: boolean }[], ttlSeconds: number = 60): Promise<void> {
        const pipeline = this.redis.pipeline();
        
        for (const { guildId, present } of presenceData) {
            const key = `bot:presence:${guildId}`;
            pipeline.setex(key, ttlSeconds, present ? '1' : '0');
        }
        
        await pipeline.exec();
    }

    /**
     * Get multiple cached bot presence checks
     */
    async getCachedBotPresenceMultiple(guildIds: string[]): Promise<{ guildId: string; present: boolean | null }[]> {
        const pipeline = this.redis.pipeline();
        
        for (const guildId of guildIds) {
            const key = `bot:presence:${guildId}`;
            pipeline.get(key);
        }
        
        const results = await pipeline.exec();
        
        return guildIds.map((guildId, index) => ({
            guildId,
            present: results?.[index]?.[1] === null ? null : results?.[index]?.[1] === '1'
        }));
    }

    /**
     * Invalidate cache for a specific guild
     */
    async invalidateGuildCache(guildId: string): Promise<void> {
        const keys = [
            `guild:${guildId}`,
            `guild:${guildId}:members`,
            `guild:${guildId}:channels`,
            `guild:${guildId}:roles`,
            `bot:presence:${guildId}`
        ];
        
        await this.redis.del(...keys);
    }

    /**
     * Close Redis connection
     */
    async disconnect(): Promise<void> {
        await this.redis.quit();
    }
}