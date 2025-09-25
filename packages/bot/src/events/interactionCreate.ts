import { Events, Interaction, Client, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { TicketHandler } from "../components/ticketHandler.js";
import { ErrorLogger } from "../utils/ErrorLogger.js";
import { handleSetupWizardInteraction } from "../handlers/setupWizardHandler.js";
import { handleHelpButtonInteraction } from "../handlers/helpButtonHandler.js";

export const name = Events.InteractionCreate;

export async function execute(interaction: Interaction, client: Client) {
    const errorLogger = ErrorLogger.getInstance();

    try {
        // Handle slash commands
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                await errorLogger.logCommandError(
                    new Error(`Command not found: ${interaction.commandName}`),
                    {
                        guildId: interaction.guildId || undefined,
                        userId: interaction.user.id,
                        commandName: interaction.commandName
                    }
                );
                
                // Provide helpful error message with available commands
                await sendCommandNotFoundHelp(interaction, client);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Error executing command:', error);
                await errorLogger.logCommandError(error as Error, {
                    guildId: interaction.guildId || undefined,
                    userId: interaction.user.id,
                    commandName: interaction.commandName
                });

                // Provide contextual help based on the error
                await sendCommandErrorHelp(interaction, error as Error, interaction.commandName);
            }
            return;
        }

        // Handle context menu commands (Message and User)
        if (interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No context menu command matching ${interaction.commandName} was found.`);
                await errorLogger.logCommandError(
                    new Error(`Context menu command not found: ${interaction.commandName}`),
                    {
                        guildId: interaction.guildId || undefined,
                        userId: interaction.user.id,
                        commandName: interaction.commandName
                    }
                );
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error('Error executing context menu command:', error);
                await errorLogger.logCommandError(error as Error, {
                    guildId: interaction.guildId || undefined,
                    userId: interaction.user.id,
                    commandName: interaction.commandName
                });

                const reply = {
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                };
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
            return;
        }

        // Handle button interactions
        if (interaction.isButton()) {
            // Handle help button interactions
            if (await handleHelpButtonInteraction(interaction, client)) {
                return;
            }

            // Handle setup wizard interactions
            if (await handleSetupWizardInteraction(interaction)) {
                return;
            }

            // Handle ticket system interactions
            if (await TicketHandler.handleInteraction(interaction)) {
                return;
            }

            // Handle other button interactions here if needed
            console.log(`Unhandled button interaction: ${interaction.customId}`);
        }

        // Handle select menu interactions
        if (interaction.isStringSelectMenu() || interaction.isChannelSelectMenu() || interaction.isRoleSelectMenu()) {
            // Handle setup wizard interactions
            if (await handleSetupWizardInteraction(interaction)) {
                return;
            }

            // Handle other select menu interactions here if needed
            console.log(`Unhandled select menu interaction: ${interaction.customId}`);
        }

        // Handle modal interactions
        if (interaction.isModalSubmit()) {
            // Handle setup wizard interactions
            if (await handleSetupWizardInteraction(interaction)) {
                return;
            }

            // Handle other modal interactions here if needed
            console.log(`Unhandled modal interaction: ${interaction.customId}`);
        }

    } catch (error) {
        console.error('Error in interaction handler:', error);
        await errorLogger.logError(error as Error, {
            guildId: interaction.guildId || undefined,
            errorType: 'InteractionError',
            additionalContext: {
                userId: interaction.user.id,
                operation: 'interaction_handler'
            }
        });

        // Try to respond to the interaction if possible
        try {
            const reply = {
                content: 'An unexpected error occurred. Please try again later.',
                ephemeral: true
            };

            if (interaction.isRepliable()) {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(reply);
                } else {
                    await interaction.reply(reply);
                }
            }
        } catch (replyError) {
            console.error('Failed to send error reply:', replyError);
        }
    }
}

/**
 * Send helpful error message when a command is not found
 */
async function sendCommandNotFoundHelp(interaction: any, client: Client) {
    const embed = new EmbedBuilder()
        .setTitle('❌ Command Not Found')
        .setDescription(`The command \`/${interaction.commandName}\` doesn't exist.`)
        .setColor(0xFF6B6B)
        .addFields(
            {
                name: '💡 Available Commands',
                value: [
                    '`/help` - Get help and usage instructions',
                    '`/setup-wizard` - Configure your ticket system',
                    '`/stats` - View ticket statistics',
                    '`/debug` - Debug and test functionality'
                ].join('\n'),
                inline: false
            },
            {
                name: '🔍 Need Help?',
                value: 'Use `/help` to see all available commands and their usage.',
                inline: false
            }
        )
        .setFooter({ 
            text: 'TicketMesh • Use /help for complete command list',
            iconURL: client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('help_commands')
                .setLabel('View All Commands')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📋')
        );

    try {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ embeds: [embed], components: [row], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        }
    } catch (error) {
        console.error('Failed to send command not found help:', error);
    }
}

/**
 * Send contextual help when a command execution fails
 */
async function sendCommandErrorHelp(interaction: any, error: Error, commandName: string) {
    const errorMessage = error.message.toLowerCase();
    
    let helpEmbed: EmbedBuilder;
    
    // Determine the type of error and provide appropriate help
    if (errorMessage.includes('permission') || errorMessage.includes('access')) {
        helpEmbed = new EmbedBuilder()
            .setTitle('🔐 Permission Error')
            .setDescription('You don\'t have the required permissions to use this command.')
            .setColor(0xFF6B6B)
            .addFields(
                {
                    name: '💡 What to do:',
                    value: [
                        '• Check if you have the required role or permissions',
                        '• Contact a server administrator for help',
                        '• Use `/help permissions` to understand permission requirements'
                    ].join('\n'),
                    inline: false
                }
            );
    } else if (errorMessage.includes('setup') || errorMessage.includes('configure')) {
        helpEmbed = new EmbedBuilder()
            .setTitle('⚙️ Setup Required')
            .setDescription('The ticket system needs to be configured before using this command.')
            .setColor(0xFFA500)
            .addFields(
                {
                    name: '💡 What to do:',
                    value: [
                        '• Use `/setup-wizard` to configure the system',
                        '• Ensure you have Administrator permissions',
                        '• Use `/help setup` for detailed setup instructions'
                    ].join('\n'),
                    inline: false
                }
            );
    } else if (errorMessage.includes('guild') || errorMessage.includes('server')) {
        helpEmbed = new EmbedBuilder()
            .setTitle('🏠 Server Context Error')
            .setDescription('This command can only be used in a server.')
            .setColor(0xFF6B6B)
            .addFields(
                {
                    name: '💡 What to do:',
                    value: [
                        '• Use this command in a Discord server, not in DMs',
                        '• Make sure the bot is in your server',
                        '• Check if the bot has the required permissions'
                    ].join('\n'),
                    inline: false
                }
            );
    } else {
        helpEmbed = new EmbedBuilder()
            .setTitle('❌ Command Error')
            .setDescription('An error occurred while executing this command.')
            .setColor(0xFF6B6B)
            .addFields(
                {
                    name: '💡 What to do:',
                    value: [
                        '• Try the command again in a few moments',
                        '• Check if the bot has the required permissions',
                        '• Use `/help` for usage instructions',
                        '• Contact support if the problem persists'
                    ].join('\n'),
                    inline: false
                }
            );
    }

    helpEmbed
        .setFooter({ 
            text: 'TicketMesh • Use /help support for additional assistance',
            iconURL: interaction.client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('help_support')
                .setLabel('Get Support')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🆘')
        );

    try {
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ embeds: [helpEmbed], components: [row], ephemeral: true });
        } else {
            await interaction.reply({ embeds: [helpEmbed], components: [row], ephemeral: true });
        }
    } catch (replyError) {
        console.error('Failed to send command error help:', replyError);
        // Fallback to simple text message
        try {
            const fallbackMessage = '❌ An error occurred while executing this command. Use `/help` for assistance.';
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: fallbackMessage, ephemeral: true });
            } else {
                await interaction.reply({ content: fallbackMessage, ephemeral: true });
            }
        } catch (fallbackError) {
            console.error('Failed to send fallback error message:', fallbackError);
        }
    }
}