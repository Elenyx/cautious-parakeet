import { Events, Role } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.GuildRoleCreate;

/**
 * Handle role create events to keep role cache synchronized
 */
export async function execute(role: Role) {
    try {
        console.log(`Role created: ${role.name} in ${role.guild.name} (${role.guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Refresh the guild roles cache
        await discordApiService.getGuildRoles(role.guild.id, true);
        
        console.log(`Role cache updated for guild: ${role.guild.name} (${role.guild.id})`);
    } catch (error) {
        console.error(`Error updating role cache for guild ${role.guild.id}:`, error);
    }
}