import { Events, GuildMember } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.GuildMemberUpdate;

/**
 * Handle guild member update events to keep member cache synchronized
 */
export async function execute(oldMember: GuildMember, newMember: GuildMember) {
    try {
        console.log(`Member updated: ${newMember.user.tag} in ${newMember.guild.name} (${newMember.guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Refresh the guild members cache to reflect the changes
        await discordApiService.getGuildMembers(newMember.guild.id, true);
        
        console.log(`Member cache updated for guild: ${newMember.guild.name} (${newMember.guild.id})`);
    } catch (error) {
        console.error(`Error updating member cache for guild ${newMember.guild.id}:`, error);
    }
}