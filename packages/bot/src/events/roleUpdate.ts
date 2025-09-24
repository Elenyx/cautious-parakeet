import { Events, Role } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.GuildRoleUpdate;

/**
 * Handle role update events to keep role cache synchronized
 */
export async function execute(oldRole: Role, newRole: Role) {
    try {
        console.log(`Role updated: ${newRole.name} in ${newRole.guild.name} (${newRole.guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Refresh the guild roles cache
        await discordApiService.getGuildRoles(newRole.guild.id, true);
        
        console.log(`Role cache updated for guild: ${newRole.guild.name} (${newRole.guild.id})`);
    } catch (error) {
        console.error(`Error updating role cache for guild ${newRole.guild.id}:`, error);
    }
}