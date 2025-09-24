import { Events, Role } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";

export const name = Events.GuildRoleDelete;

/**
 * Handle role delete events to keep role cache synchronized
 */
export async function execute(role: Role) {
    try {
        console.log(`Role deleted: ${role.name} from ${role.guild.name} (${role.guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Refresh the guild roles cache
        await discordApiService.getGuildRoles(role.guild.id, true);
        
        console.log(`Role cache updated for guild: ${role.guild.name} (${role.guild.id})`);
    } catch (error) {
        console.error(`Error updating role cache for guild ${role.guild.id}:`, error);
    }
}