import { Events, Message, Client } from 'discord.js';
import { ErrorLogger } from '../utils/ErrorLogger';

export const name = Events.MessageCreate;

/**
 * Handle message creation events to respond to bot mentions with help information
 */
export async function execute(message: Message, client: Client) {
    const errorLogger = ErrorLogger.getInstance();

    try {
        // Ignore messages from bots
        if (message.author.bot) return;

        // Check if the bot is mentioned in the message
        const botMentioned = message.mentions.has(client.user!);
        
        if (botMentioned) {
            // Create a helpful response embed
            const helpEmbed = {
                title: '👋 Hello! I\'m TicketMesh',
                description: 'I\'m here to help you with your Discord ticket system!',
                color: 0x5865F2,
                fields: [
                    {
                        name: '🚀 Quick Start',
                        value: 'Use `/help` to see all available commands and get started!',
                        inline: false
                    },
                    {
                        name: '⚙️ Setup',
                        value: 'Use `/setup-wizard` to configure your ticket system (Admin only)',
                        inline: false
                    },
                    {
                        name: '📋 Commands',
                        value: 'Use `/help commands` to see all available commands',
                        inline: false
                    },
                    {
                        name: '🆘 Need Help?',
                        value: 'Use `/help support` for additional assistance and support links',
                        inline: false
                    }
                ],
                footer: {
                    text: 'TicketMesh • Mention me anytime for help!',
                    icon_url: client.user?.displayAvatarURL() || undefined
                },
                timestamp: new Date().toISOString()
            };

            // Send the help message
            await message.reply({ embeds: [helpEmbed] });
            
            console.log(`Responded to mention from ${message.author.tag} in ${message.guild?.name || 'DM'}`);
        }

        // Check for common help requests in message content
        const helpKeywords = ['help', 'how to', 'how do i', 'tutorial', 'guide', 'setup'];
        const messageContent = message.content.toLowerCase();
        
        if (helpKeywords.some(keyword => messageContent.includes(keyword)) && 
            (messageContent.includes('ticket') || messageContent.includes('bot'))) {
            
            // Only respond if the message is asking for help and mentions tickets or bot
            const contextualHelpEmbed = {
                title: '💡 I can help with that!',
                description: 'It looks like you\'re looking for help with TicketMesh. Here are some useful commands:',
                color: 0x00FF00,
                fields: [
                    {
                        name: '📚 Get Help',
                        value: 'Use `/help` for a complete guide to all features',
                        inline: true
                    },
                    {
                        name: '⚙️ Setup Guide',
                        value: 'Use `/help setup` for step-by-step setup instructions',
                        inline: true
                    },
                    {
                        name: '🎫 Ticket Usage',
                        value: 'Use `/help tickets` to learn how to use the ticket system',
                        inline: true
                    }
                ],
                footer: {
                    text: 'TicketMesh • Always here to help!',
                    icon_url: client.user?.displayAvatarURL() || undefined
                },
                timestamp: new Date().toISOString()
            };

            // Send contextual help (only if not already responded to mention)
            if (!botMentioned) {
                await message.reply({ embeds: [contextualHelpEmbed] });
                console.log(`Provided contextual help to ${message.author.tag} in ${message.guild?.name || 'DM'}`);
            }
        }

    } catch (error) {
        console.error('Error in messageCreate event:', error);
        await errorLogger.logCommandError(error as Error, {
            guildId: message.guildId || undefined,
            userId: message.author.id,
            commandName: 'messageCreate'
        });
    }
}
