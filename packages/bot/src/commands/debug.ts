import { 
    ChatInputCommandInteraction, 
    PermissionFlagsBits,
    EmbedBuilder
} from 'discord.js';
import { GuildConfigDAO } from '../database/GuildConfigDAO';
import { TranscriptUtil } from '../utils/TranscriptUtil';
import { ErrorLogger } from '../utils/ErrorLogger';
import { LocalizedCommandBuilder } from '../utils/LocalizedCommandBuilder.js';
import { LanguageService } from '../utils/LanguageService.js';

/**
 * Debug command for testing and troubleshooting the ticket system
 */
// Create localized command data - will be dynamically updated based on guild language
export const data = new LocalizedCommandBuilder('debug')
    .setLocalizedInfo('en') // Default to English for initial registration
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addLocalizedSubcommand('config', 'en')
    .addLocalizedSubcommand('transcript', 'en', (subcommand) => {
        return subcommand.addStringOption(option =>
            option
                .setName('ticket_id')
                .setDescription('The ticket ID to generate transcript for')
                .setRequired(true)
        );
    })
    .build();

export async function execute(interaction: ChatInputCommandInteraction) {
    const errorLogger = ErrorLogger.getInstance();
    const languageService = LanguageService.getInstance();

    try {
        // Get the current language for this guild
        const currentLanguage = await languageService.getGuildLanguage(interaction.guildId!);

        const subcommand = interaction.options.getSubcommand();
        const guildConfigDAO = new GuildConfigDAO();
        
        switch (subcommand) {
            case 'config':
                await handleConfigDebug(interaction, guildConfigDAO, currentLanguage);
                break;
            case 'transcript':
                await handleTranscriptDebug(interaction, guildConfigDAO, currentLanguage);
                break;
            default:
                const unknownSubcommandError = languageService.getError('unknownSubcommand', currentLanguage);
                await interaction.reply({
                    content: unknownSubcommandError,
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error('Debug command error:', error);
        await errorLogger.logError(error as Error, {
            guildId: interaction.guildId!,
            errorType: 'Debug Command Error',
            additionalContext: { command: 'debug' }
        });
        
        if (!interaction.replied) {
            const currentLanguage = await languageService.getGuildLanguage(interaction.guildId!);
            const errorMessage = languageService.getError('debugError', currentLanguage);
            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
        }
    }
}

/**
 * Handle configuration debugging
 */
async function handleConfigDebug(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: GuildConfigDAO,
    language: string = 'en'
) {
    const guildId = interaction.guildId!;
    
    await interaction.deferReply({ ephemeral: true });
    
    console.log(`[DEBUG] Checking configuration for guild: ${guildId}`);
    
    const config = await guildConfigDAO.getGuildConfig(guildId);
    
    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('🔧 Debug: Guild Configuration')
        .setTimestamp();

    if (!config) {
        embed.setDescription('❌ **No configuration found for this guild!**')
            .addFields({
                name: '💡 Solution',
                value: 'Use `/setup` commands to configure the ticket system.',
                inline: false
            });
    } else {
        embed.setDescription('✅ **Configuration found**');
        
        // Check each configuration item
        const configItems = [
            { name: 'Category ID', value: config.category_id, field: 'category_id' },
            { name: 'Panel Channel ID', value: config.panel_channel_id, field: 'panel_channel_id' },
            { name: 'Transcript Channel', value: config.transcript_channel, field: 'transcript_channel' },
            { name: 'Error Log Channel ID', value: config.error_log_channel_id, field: 'error_log_channel_id' }
        ];
        
        for (const item of configItems) {
            const status = item.value ? '✅' : '❌';
            const value = item.value ? `<#${item.value}>` : 'Not configured';
            embed.addFields({
                name: `${status} ${item.name}`,
                value: value,
                inline: true
            });
        }
        
        // Support roles
        if (config.support_role_ids && config.support_role_ids.length > 0) {
            embed.addFields({
                name: '✅ Support Roles',
                value: config.support_role_ids.map((id: string) => `<@&${id}>`).join('\n'),
                inline: false
            });
        } else {
            embed.addFields({
                name: '❌ Support Roles',
                value: 'No support roles configured',
                inline: false
            });
        }
        
        // Ticket counter
        embed.addFields({
            name: '🎫 Ticket Counter',
            value: (config.ticket_counter || 0).toString(),
            inline: true
        });
    }
    
    console.log(`[DEBUG] Configuration check completed for guild: ${guildId}`);
    console.log(`[DEBUG] Config object:`, JSON.stringify(config, null, 2));
    
    await interaction.editReply({ embeds: [embed] });
}

/**
 * Handle transcript generation debugging
 */
async function handleTranscriptDebug(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: GuildConfigDAO,
    language: string = 'en'
) {
    const ticketId = interaction.options.getString('ticket_id', true);
    const guildId = interaction.guildId!;
    
    await interaction.deferReply({ ephemeral: true });
    
    console.log(`[DEBUG] Testing transcript generation for ticket: ${ticketId}`);
    
    // Check if transcript channel is configured
    const config = await guildConfigDAO.getGuildConfig(guildId);
    
    if (!config || !config.transcript_channel) {
        await interaction.editReply({
            content: '❌ **Transcript channel not configured!**\n\nUse `/setup transcript` to configure the transcript channel first.'
        });
        return;
    }
    
    console.log(`[DEBUG] Transcript channel configured: ${config.transcript_channel}`);
    
    try {
        // Test transcript generation
        const transcriptUtil = TranscriptUtil.getInstance();
        
        console.log(`[DEBUG] Attempting to generate transcript for ticket: ${ticketId}`);
        
        const ticketIdNumber = parseInt(ticketId, 10);
        if (isNaN(ticketIdNumber)) {
            await interaction.editReply({
                content: `❌ **Invalid ticket ID: ${ticketId}**\n\nTicket ID must be a valid number.`
            });
            return;
        }
        
        await transcriptUtil.generateTranscript(ticketIdNumber);
        
        await interaction.editReply({
            content: `✅ **Transcript generation initiated for ticket: ${ticketId}**\n\nCheck the transcript channel: <#${config.transcript_channel}>\nAlso check the console logs for detailed information.`
        });
        
    } catch (error) {
        console.error(`[DEBUG] Transcript generation failed:`, error);
        
        await interaction.editReply({
            content: `❌ **Transcript generation failed for ticket: ${ticketId}**\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nCheck the console logs for more details.`
        });
    }
}