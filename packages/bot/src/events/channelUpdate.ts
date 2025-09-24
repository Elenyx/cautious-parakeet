import { Events, GuildChannel } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.ChannelUpdate;

/**
 * Handle channel update events to keep channel cache synchronized
 */
export async function execute(oldChannel: GuildChannel, newChannel: GuildChannel) {
    try {
        // Only handle guild channels
        if (!newChannel.guild) return;
        
        console.log(`Channel updated: ${newChannel.name} in ${newChannel.guild.name} (${newChannel.guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Refresh the guild channels cache
        await discordApiService.getGuildChannels(newChannel.guild.id, true);
        
        console.log(`Channel cache updated for guild: ${newChannel.guild.name} (${newChannel.guild.id})`);
    } catch (error) {
        console.error(`Error updating channel cache for guild ${newChannel.guild?.id}:`, error);
    }
}