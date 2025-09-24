import { Events, GuildChannel } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.ChannelDelete;

/**
 * Handle channel delete events to keep channel cache synchronized
 */
export async function execute(channel: GuildChannel) {
    try {
        // Only handle guild channels
        if (!channel.guild) return;
        
        console.log(`Channel deleted: ${channel.name} from ${channel.guild.name} (${channel.guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Refresh the guild channels cache
        await discordApiService.getGuildChannels(channel.guild.id, true);
        
        console.log(`Channel cache updated for guild: ${channel.guild.name} (${channel.guild.id})`);
    } catch (error) {
        console.error(`Error updating channel cache for guild ${channel.guild?.id}:`, error);
    }
}