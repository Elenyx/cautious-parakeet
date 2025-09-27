import { Events, Guild, TextChannel, MessageFlags } from "discord.js";
import { DiscordApiService } from "../utils/DiscordApiService.js";
import { GuildConfigDAO } from "../database/GuildConfigDAO.js";
import { WelcomeMessageBuilder, SupportedLanguage } from "../utils/WelcomeMessageBuilder.js";
import { ErrorLogger } from "../utils/ErrorLogger.js";

export const name = Events.GuildCreate;

/**
 * Handle guild create events to keep guild cache synchronized and send welcome message
 */
export async function execute(guild: Guild) {
    const errorLogger = ErrorLogger.getInstance();
    
    try {
        console.log(`[GUILD_CREATE] Bot joined new guild: ${guild.name} (${guild.id})`);
        
        // Get the Discord API service instance
        const discordApiService = DiscordApiService.getInstance();
        
        // Pre-cache all guild data for the new guild (use allSettled to handle individual failures)
        const cacheResults = await Promise.allSettled([
            discordApiService.getGuildData(guild.id, true),
            discordApiService.getGuildMembers(guild.id, true),
            discordApiService.getGuildChannels(guild.id, true),
            discordApiService.getGuildRoles(guild.id, true)
        ]);
        
        // Log any failures but don't let them stop the welcome message
        cacheResults.forEach((result, index) => {
            const operations = ['guild data', 'guild members', 'guild channels', 'guild roles'];
            if (result.status === 'rejected') {
                console.warn(`[GUILD_CREATE] Failed to cache ${operations[index]} for ${guild.name}:`, result.reason);
            }
        });
        
        console.log(`[GUILD_CREATE] Pre-cached all data for new guild: ${guild.name} (${guild.id})`);
        
        // Initialize guild configuration with default language
        const guildConfigDAO = new GuildConfigDAO();
        await guildConfigDAO.upsertGuildConfig({
            guild_id: guild.id,
            language: 'en' // Default to English
        });
        
        // Send welcome message
        await sendWelcomeMessage(guild);
        
    } catch (error) {
        console.error(`[GUILD_CREATE] Error handling new guild ${guild.id}:`, error);
        await errorLogger.logError(error as Error, {
            guildId: guild.id,
            errorType: 'GuildCreateError',
            additionalContext: { guildName: guild.name }
        });
    }
}

/**
 * Send welcome message to the first available text channel
 */
async function sendWelcomeMessage(guild: Guild) {
    const errorLogger = ErrorLogger.getInstance();
    
    try {
        // Find the first available text channel where the bot can send messages
        const textChannel = guild.channels.cache.find(channel => 
            channel.isTextBased() && 
            channel.permissionsFor(guild.members.me!)?.has(['SendMessages', 'ViewChannel'])
        ) as TextChannel;

        if (!textChannel) {
            console.log(`[WELCOME_MESSAGE] No suitable channel found for welcome message in guild: ${guild.name} (${guild.id})`);
            return;
        }

        // Get guild configuration to determine language
        const guildConfigDAO = new GuildConfigDAO();
        const config = await guildConfigDAO.getGuildConfig(guild.id);
        const language = (config?.language as SupportedLanguage) || 'en';

        // Create and send welcome message
        const welcomeBuilder = new WelcomeMessageBuilder(language, guild.id);
        const welcomeMessage = welcomeBuilder.build();

        await textChannel.send({
            ...welcomeMessage,
            flags: [MessageFlags.IsComponentsV2]
        });
        
        console.log(`[WELCOME_MESSAGE] Sent welcome message to ${textChannel.name} in guild: ${guild.name} (${guild.id})`);
        
    } catch (error) {
        console.error(`[WELCOME_MESSAGE] Error sending welcome message to guild ${guild.id}:`, error);
        await errorLogger.logError(error as Error, {
            guildId: guild.id,
            errorType: 'WelcomeMessageError',
            additionalContext: { guildName: guild.name }
        });
    }
}