import { Client } from 'discord.js';
import { RedisService } from './RedisService';
import { RateLimitManager } from './RateLimitManager';
import { TaskQueue } from './TaskQueue';
import { CacheMetrics } from './CacheMetrics';

/**
 * Discord API service with caching and rate limiting
 */
export class DiscordApiService {
    private client: Client;
    private redis: RedisService;
    private rateLimitManager: RateLimitManager;
    private taskQueue: TaskQueue;
    private cacheMetrics: CacheMetrics;
    private static instance: DiscordApiService;

    private constructor(client: Client) {
        this.client = client;
        this.redis = RedisService.getInstance();
        this.rateLimitManager = RateLimitManager.getInstance();
        this.cacheMetrics = CacheMetrics.getInstance();
        this.taskQueue = new TaskQueue({
            concurrency: 3,
            defaultMaxRetries: 3,
            baseDelay: 1000,
            maxDelay: 30000,
            backoffMultiplier: 2
        });
    }

    /**
     * Initialize the service with Discord client
     */
    public static initialize(client: Client): DiscordApiService {
        if (!DiscordApiService.instance) {
            DiscordApiService.instance = new DiscordApiService(client);
        }
        return DiscordApiService.instance;
    }

    /**
     * Get singleton instance
     */
    public static getInstance(): DiscordApiService {
        if (!DiscordApiService.instance) {
            throw new Error('DiscordApiService must be initialized first');
        }
        return DiscordApiService.instance;
    }

    /**
     * Get guild data with caching and task queue
     */
    async getGuildData(guildId: string, forceRefresh: boolean = false): Promise<any | null> {
        const startTime = Date.now();
        const cacheKey = `guild-data:${guildId}`;

        // Check cache first
        if (!forceRefresh) {
            const cached = await this.redis.getCachedGuildData(guildId);
            if (cached) {
                const responseTime = Date.now() - startTime;
                this.cacheMetrics.recordHit(cacheKey, responseTime);
                console.log(`Using cached guild data for ${guildId}`);
                return cached;
            }
        }

        // Use task queue for reliable API calls
        const result = await this.taskQueue.addTask(
            `guild-data:${guildId}`,
            async () => {
                // Fetch from Discord API with rate limiting
                const guild = await this.rateLimitManager.executeWithRateLimit(
                    `guild:${guildId}`,
                    async () => {
                        const fetchedGuild = this.client.guilds.cache.get(guildId);
                        if (!fetchedGuild) {
                            return null;
                        }
                        return fetchedGuild;
                    }
                );

                if (!guild) {
                    return null;
                }

                const guildData = {
                    id: guild.id,
                    name: guild.name,
                    icon: guild.icon,
                    memberCount: guild.memberCount,
                    ownerId: guild.ownerId,
                    description: guild.description,
                    features: guild.features,
                    premiumTier: guild.premiumTier,
                    premiumSubscriptionCount: guild.premiumSubscriptionCount,
                    createdAt: guild.createdAt.toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                // Cache the data
                await this.redis.cacheGuildData(guildId, guildData, 300); // 5 minutes
                console.log(`Cached guild data for ${guildId}`);

                return guildData;
            },
            { priority: 'medium' }
        );

        // Record cache miss
        const responseTime = Date.now() - startTime;
        this.cacheMetrics.recordMiss(cacheKey, responseTime);

        return result;
    }

    /**
     * Get guild members with caching
     */
    async getGuildMembers(guildId: string, forceRefresh: boolean = false): Promise<any[] | null> {
        // Check cache first
        if (!forceRefresh) {
            const cached = await this.redis.getCachedGuildMembers(guildId);
            if (cached) {
                console.log(`Using cached guild members for ${guildId}`);
                return cached;
            }
        }

        // Fetch from Discord API with rate limiting and timeout
        try {
            const members = await this.rateLimitManager.executeWithRateLimit(
                `guild:${guildId}:members`,
                async () => {
                    const guild = this.client.guilds.cache.get(guildId);
                    if (!guild) {
                        return null;
                    }
                    
                    // Fetch all members with timeout to prevent hanging
                    const fetchedMembers = await Promise.race([
                        guild.members.fetch(),
                        new Promise<never>((_, reject) => 
                            setTimeout(() => reject(new Error('Guild members fetch timeout')), 30000) // 30 second timeout
                        )
                    ]);
                    return Array.from(fetchedMembers.values());
                }
            );

            if (!members) {
                return null;
            }

            // Cache the members
            await this.redis.cacheGuildMembers(guildId, members, 600); // 10 minutes
            console.log(`Cached ${members.length} guild members for ${guildId}`);

            return await this.redis.getCachedGuildMembers(guildId);
        } catch (error) {
            if (error instanceof Error && error.message.includes('timeout')) {
                console.warn(`Guild members fetch timeout for ${guildId} - this is normal for large guilds`);
            } else {
                console.error(`Error fetching guild members for ${guildId}:`, error);
            }
            return null;
        }
    }

    /**
     * Get guild channels with caching
     */
    async getGuildChannels(guildId: string, forceRefresh: boolean = false): Promise<any[] | null> {
        // Check cache first
        if (!forceRefresh) {
            const cached = await this.redis.getCachedGuildChannels(guildId);
            if (cached) {
                console.log(`Using cached guild channels for ${guildId}`);
                return cached;
            }
        }

        // Fetch from Discord API with rate limiting
        try {
            const channels = await this.rateLimitManager.executeWithRateLimit(
                `guild:${guildId}:channels`,
                async () => {
                    const guild = this.client.guilds.cache.get(guildId);
                    if (!guild) {
                        return null;
                    }
                    
                    // Filter to only guild channels (exclude threads)
                    return Array.from(guild.channels.cache.values()).filter(channel => 
                        !channel.isThread()
                    ) as any[];
                }
            );

            if (!channels) {
                return null;
            }

            // Cache the channels
            await this.redis.cacheGuildChannels(guildId, channels, 300); // 5 minutes
            console.log(`Cached ${channels.length} guild channels for ${guildId}`);

            return await this.redis.getCachedGuildChannels(guildId);
        } catch (error) {
            console.error(`Error fetching guild channels for ${guildId}:`, error);
            return null;
        }
    }

    /**
     * Get guild roles with caching
     */
    async getGuildRoles(guildId: string, forceRefresh: boolean = false): Promise<any[] | null> {
        // Check cache first
        if (!forceRefresh) {
            const cached = await this.redis.getCachedGuildRoles(guildId);
            if (cached) {
                console.log(`Using cached guild roles for ${guildId}`);
                return cached;
            }
        }

        // Fetch from Discord API with rate limiting
        try {
            const roles = await this.rateLimitManager.executeWithRateLimit(
                `guild:${guildId}:roles`,
                async () => {
                    const guild = this.client.guilds.cache.get(guildId);
                    if (!guild) {
                        return null;
                    }
                    
                    return Array.from(guild.roles.cache.values());
                }
            );

            if (!roles) {
                return null;
            }

            // Cache the roles
            await this.redis.cacheGuildRoles(guildId, roles, 300); // 5 minutes
            console.log(`Cached ${roles.length} guild roles for ${guildId}`);

            return await this.redis.getCachedGuildRoles(guildId);
        } catch (error) {
            console.error(`Error fetching guild roles for ${guildId}:`, error);
            return null;
        }
    }

    /**
     * Check bot presence in guilds with caching
     */
    async checkBotPresence(guildIds: string[], forceRefresh: boolean = false): Promise<{ guildId: string; present: boolean }[]> {
        const results: { guildId: string; present: boolean }[] = [];
        const uncachedGuildIds: string[] = [];

        // Check cache first
        if (!forceRefresh) {
            const cachedResults = await this.redis.getCachedBotPresenceMultiple(guildIds);
            
            for (const { guildId, present } of cachedResults) {
                if (present !== null) {
                    results.push({ guildId, present });
                } else {
                    uncachedGuildIds.push(guildId);
                }
            }
        } else {
            uncachedGuildIds.push(...guildIds);
        }

        // Fetch uncached data
        if (uncachedGuildIds.length > 0) {
            const freshResults: { guildId: string; present: boolean }[] = [];
            
            for (const guildId of uncachedGuildIds) {
                try {
                    const guild = this.client.guilds.cache.get(guildId);
                    const present = guild !== undefined;
                    freshResults.push({ guildId, present });
                } catch (error) {
                    console.error(`Error checking bot presence for ${guildId}:`, error);
                    freshResults.push({ guildId, present: false });
                }
            }

            // Cache the fresh results
            await this.redis.cacheBotPresenceMultiple(freshResults, 60); // 1 minute
            results.push(...freshResults);
        }

        return results;
    }

    /**
     * Invalidate cache for a guild (useful when guild data changes)
     */
    async invalidateGuildCache(guildId: string): Promise<void> {
        await this.redis.invalidateGuildCache(guildId);
        console.log(`Invalidated cache for guild ${guildId}`);
    }

    /**
     * Get all guilds the bot is in (with caching)
     */
    async getAllGuilds(): Promise<any[]> {
        const guilds = this.client.guilds.cache.map(guild => ({
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            memberCount: guild.memberCount,
            ownerId: guild.ownerId,
        }));

        return guilds;
    }

    /**
     * Get all cached guilds (alias for getAllGuilds)
     */
    async getCachedGuilds(): Promise<any[]> {
        return this.getAllGuilds();
    }

    /**
     * Get cached guild data by ID
     */
    async getCachedGuildData(guildId: string): Promise<any | null> {
        return this.getGuildData(guildId, false);
    }

    /**
     * Get cached guild members by ID
     */
    async getCachedGuildMembers(guildId: string): Promise<any[] | null> {
        return this.getGuildMembers(guildId, false);
    }

    /**
     * Get cached guild channels by ID
     */
    async getCachedGuildChannels(guildId: string): Promise<any[] | null> {
        return this.getGuildChannels(guildId, false);
    }

    /**
     * Get cached guild roles by ID
     */
    async getCachedGuildRoles(guildId: string): Promise<any[] | null> {
        return this.getGuildRoles(guildId, false);
    }

    /**
     * Get task queue statistics
     */
    getTaskQueueStats(): {
        queueLength: number;
        runningTasks: number;
        concurrency: number;
        runningTaskIds: string[];
        queuedTaskIds: string[];
    } {
        const stats = this.taskQueue.getStats();
        return {
            ...stats,
            runningTaskIds: this.taskQueue.getRunningTasks(),
            queuedTaskIds: this.taskQueue.getQueuedTasks(),
        };
    }

    /**
     * Get cache metrics
     */
    getCacheMetrics(): {
        overall: any;
        detailed: any;
        topPerformers: any[];
        worstPerformers: any[];
        summary: string;
    } {
        return {
            overall: this.cacheMetrics.getOverallStats(),
            detailed: this.cacheMetrics.getDetailedMetrics(),
            topPerformers: this.cacheMetrics.getTopPerformers(5),
            worstPerformers: this.cacheMetrics.getWorstPerformers(5),
            summary: this.cacheMetrics.getSummary(),
        };
    }

    /**
     * Reset cache metrics
     */
    resetCacheMetrics(): void {
        this.cacheMetrics.resetAllMetrics();
    }
}