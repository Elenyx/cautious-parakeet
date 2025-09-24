import { Events, GuildMember } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.GuildMemberRemove;

/**
 * Handle guild member remove events to keep member cache synchronized
 */
export async function execute(member: GuildMember) {
    try {
        console.log(`Member left: ${member.user.tag} from ${member.guild.name} (${member.guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Refresh the guild members cache
        await discordApiService.getGuildMembers(member.guild.id, true);
        
        // Also update the guild data to reflect new member count
        await discordApiService.getGuildData(member.guild.id, true);
        
        console.log(`Member cache updated for guild: ${member.guild.name} (${member.guild.id})`);
    } catch (error) {
        console.error(`Error updating member cache for guild ${member.guild.id}:`, error);
    }
}