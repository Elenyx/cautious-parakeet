import { Events, Guild } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.GuildUpdate;

/**
 * Handle guild update events to keep cache synchronized
 */
export async function execute(oldGuild: Guild, newGuild: Guild) {
    try {
        console.log(`Guild updated: ${newGuild.name} (${newGuild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Invalidate the old cache
        await discordApiService.invalidateGuildCache(newGuild.id);
        
        // Pre-cache the updated guild data
        await discordApiService.getGuildData(newGuild.id, true);
        
        console.log(`Cache updated for guild: ${newGuild.name} (${newGuild.id})`);
    } catch (error) {
        console.error(`Error updating cache for guild ${newGuild.id}:`, error);
    }
}