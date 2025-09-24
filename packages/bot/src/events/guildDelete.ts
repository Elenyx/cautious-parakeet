import { Events, Guild } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.GuildDelete;

/**
 * Handle guild delete events to clean up cached data
 */
export async function execute(guild: Guild) {
    try {
        console.log(`Bot left guild: ${guild.name} (${guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Clean up all cached data for the guild
        await discordApiService.invalidateGuildCache(guild.id);
        
        console.log(`Cleaned up cache for guild: ${guild.name} (${guild.id})`);
    } catch (error) {
        console.error(`Error cleaning up cache for guild ${guild.id}:`, error);
    }
}