/**
 * Enhanced Discord API client with advanced rate limiting
 * Implements Discord API best practices and provides a clean interface
 */

import { discordApiFetch, cachedDiscordFetch } from './rate-limit';
import { ClientRedisService } from './redis';

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  email?: string;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  guild_id?: string;
  position?: number;
}

/**
 * Enhanced Discord API client with rate limiting and caching
 */
export class DiscordApiClient {
  private static instance: DiscordApiClient;
  private redis = ClientRedisService.getInstance();

  private constructor() {}

  public static getInstance(): DiscordApiClient {
    if (!DiscordApiClient.instance) {
      DiscordApiClient.instance = new DiscordApiClient();
    }
    return DiscordApiClient.instance;
  }

  /**
   * Get user's guilds with enhanced rate limiting
   */
  async getUserGuilds(accessToken: string, userId: string, fresh: boolean = false): Promise<DiscordGuild[]> {
    const cacheKey = `discord:guilds:${userId}`;
    
    // Check cache first unless fresh is requested
    if (!fresh) {
      const cached = await this.redis.getCachedUserGuilds(userId);
      if (cached && Array.isArray(cached)) {
        console.log(`[DiscordAPI] Cache hit for user guilds: ${userId}`);
        return cached as DiscordGuild[];
      }
    }

    try {
      const guilds = await cachedDiscordFetch(
        'https://discord.com/api/v10/users/@me/guilds?with_counts=false',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        },
        cacheKey,
        300, // 5 minutes cache
        3 // 3 retries
      ) as DiscordGuild[];

      // Cache the result
      await this.redis.cacheUserGuilds(userId, guilds, 300);
      
      return guilds;
    } catch (error) {
      console.error('[DiscordAPI] Error fetching user guilds:', error);
      
      // Try to return cached data as fallback
      const cached = await this.redis.getCachedUserGuilds(userId);
      if (cached && Array.isArray(cached)) {
        console.warn('[DiscordAPI] Returning cached guilds due to API error');
        return cached as DiscordGuild[];
      }
      
      throw error;
    }
  }

  /**
   * Get guild information with rate limiting
   */
  async getGuild(guildId: string, accessToken: string): Promise<DiscordGuild | null> {
    const cacheKey = `discord:guild:${guildId}`;
    
    // Check cache first
    const cached = await this.redis.getCachedGuildData(guildId);
    if (cached) {
      console.log(`[DiscordAPI] Cache hit for guild: ${guildId}`);
      return cached as DiscordGuild;
    }

    try {
      const guild = await cachedDiscordFetch(
        `https://discord.com/api/v10/guilds/${guildId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        },
        cacheKey,
        600, // 10 minutes cache
        3 // 3 retries
      ) as DiscordGuild;

      // Cache the result
      await this.redis.cacheGuildData(guildId, guild, 600);
      
      return guild;
    } catch (error) {
      console.error(`[DiscordAPI] Error fetching guild ${guildId}:`, error);
      return null;
    }
  }

  /**
   * Get guild channels with rate limiting
   */
  async getGuildChannels(guildId: string, accessToken: string): Promise<DiscordChannel[]> {
    const cacheKey = `discord:channels:${guildId}`;
    
    // Check cache first
    const cached = await this.redis.getCachedApiResponse(cacheKey);
    if (cached && Array.isArray(cached)) {
      console.log(`[DiscordAPI] Cache hit for guild channels: ${guildId}`);
      return cached as DiscordChannel[];
    }

    try {
      const channels = await cachedDiscordFetch(
        `https://discord.com/api/v10/guilds/${guildId}/channels`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        },
        cacheKey,
        300, // 5 minutes cache
        3 // 3 retries
      ) as DiscordChannel[];

      // Cache the result
      await this.redis.cacheApiResponse(cacheKey, channels, 300);
      
      return channels;
    } catch (error) {
      console.error(`[DiscordAPI] Error fetching guild channels ${guildId}:`, error);
      return [];
    }
  }

  /**
   * Get current user information
   */
  async getCurrentUser(accessToken: string): Promise<DiscordUser | null> {
    const cacheKey = 'discord:user:me';
    
    // Check cache first
    const cached = await this.redis.getCachedApiResponse(cacheKey);
    if (cached) {
      console.log('[DiscordAPI] Cache hit for current user');
      return cached as DiscordUser;
    }

    try {
      const user = await cachedDiscordFetch(
        'https://discord.com/api/v10/users/@me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        },
        cacheKey,
        600, // 10 minutes cache
        3 // 3 retries
      ) as DiscordUser;

      // Cache the result
      await this.redis.cacheApiResponse(cacheKey, user, 600);
      
      return user;
    } catch (error) {
      console.error('[DiscordAPI] Error fetching current user:', error);
      return null;
    }
  }

  /**
   * Check if user has permission in guild
   */
  hasGuildPermission(guild: DiscordGuild, permission: string): boolean {
    if (guild.owner) return true;
    
    const permissions = parseInt(guild.permissions || '0');
    const permissionFlags: Record<string, number> = {
      'MANAGE_GUILD': 0x20,
      'ADMINISTRATOR': 0x8,
      'MANAGE_CHANNELS': 0x10,
      'MANAGE_ROLES': 0x10000000,
    };
    
    const flag = permissionFlags[permission];
    return flag ? (permissions & flag) === flag : false;
  }

  /**
   * Filter guilds by permission
   */
  filterGuildsByPermission(guilds: DiscordGuild[], permission: string = 'MANAGE_GUILD'): DiscordGuild[] {
    return guilds.filter(guild => this.hasGuildPermission(guild, permission));
  }

  /**
   * Clear cache for a specific user
   */
  async clearUserCache(userId: string): Promise<void> {
    await this.redis.clearCache(`user:${userId}:*`);
    await this.redis.clearCache(`discord:guilds:${userId}`);
  }

  /**
   * Clear cache for a specific guild
   */
  async clearGuildCache(guildId: string): Promise<void> {
    await this.redis.clearCache(`guild:${guildId}`);
    await this.redis.clearCache(`discord:guild:${guildId}`);
    await this.redis.clearCache(`discord:channels:${guildId}`);
  }
}

/**
 * Singleton instance for easy access
 */
export const discordApi = DiscordApiClient.getInstance();
