import { Events, Guild } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.GuildCreate;

/**
 * Handle guild create events to keep guild cache synchronized
 */
export async function execute(guild: Guild) {
    try {
        console.log(`Bot joined new guild: ${guild.name} (${guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Pre-cache all guild data for the new guild
        await Promise.all([
            discordApiService.getGuildData(guild.id, true),
            discordApiService.getGuildMembers(guild.id, true),
            discordApiService.getGuildChannels(guild.id, true),
            discordApiService.getGuildRoles(guild.id, true)
        ]);
        
        console.log(`Pre-cached all data for new guild: ${guild.name} (${guild.id})`);
    } catch (error) {
        console.error(`Error pre-caching data for new guild ${guild.id}:`, error);
    }
}