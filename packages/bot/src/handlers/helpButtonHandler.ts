import { ButtonInteraction, Client } from 'discord.js';
import { HelpEmbedBuilder } from '../utils/HelpEmbedBuilder';
import { ErrorLogger } from '../utils/ErrorLogger';

/**
 * Handle button interactions for the help system
 */
export async function handleHelpButtonInteraction(interaction: ButtonInteraction, client: Client): Promise<boolean> {
    const errorLogger = ErrorLogger.getInstance();

    try {
        // Check if this is a help button interaction
        if (!interaction.customId.startsWith('help_')) {
            return false;
        }

        const helpEmbedBuilder = new HelpEmbedBuilder(client);
        let response: { embed: any; components: any[] } | null = null;

        // Handle different help categories
        switch (interaction.customId) {
            case 'help_overview':
                response = helpEmbedBuilder.buildOverviewEmbed();
                break;
            case 'help_commands':
                response = helpEmbedBuilder.buildCommandsEmbed();
                break;
            case 'help_setup':
                response = helpEmbedBuilder.buildSetupEmbed();
                break;
            case 'help_tickets':
                response = helpEmbedBuilder.buildTicketsEmbed();
                break;
            case 'help_permissions':
                response = helpEmbedBuilder.buildPermissionsEmbed();
                break;
            case 'help_support':
                response = helpEmbedBuilder.buildSupportEmbed();
                break;
            default:
                console.log(`Unknown help button interaction: ${interaction.customId}`);
                return false;
        }

        if (response) {
            await interaction.update({
                embeds: [response.embed],
                components: response.components
            });
            
            console.log(`Help button interaction handled: ${interaction.customId} by ${interaction.user.tag}`);
            return true;
        }

        return false;

    } catch (error) {
        console.error('Error handling help button interaction:', error);
        await errorLogger.logCommandError(error as Error, {
            guildId: interaction.guildId || undefined,
            userId: interaction.user.id,
            commandName: 'help_button_interaction'
        });

        // Try to send an error message
        try {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: '❌ An error occurred while processing your help request. Please try again.',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: '❌ An error occurred while processing your help request. Please try again.',
                    ephemeral: true
                });
            }
        } catch (replyError) {
            console.error('Failed to send error reply for help button:', replyError);
        }

        return true; // Return true to indicate we handled the interaction
    }
}
