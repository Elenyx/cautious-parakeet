import { Events, Interaction, Client } from "discord.js";
import { TicketHandler } from "../components/ticketHandler.js";
import { ErrorLogger } from "../utils/ErrorLogger.js";
import { handleSetupWizardInteraction } from "../handlers/setupWizardHandler.js";

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