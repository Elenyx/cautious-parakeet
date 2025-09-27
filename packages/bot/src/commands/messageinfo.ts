import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    MessageContextMenuCommandInteraction,
    MessageFlags,
    EmbedBuilder,
    PermissionFlagsBits
} from 'discord.js';
import { ErrorLogger } from '../utils/ErrorLogger';
import { PermissionUtil } from '../utils/PermissionUtil';

/**
 * Message Info context menu command
 * Right-click on a message and select "Apps" and then "Message Info"
 * to view detailed information about the message
 */
export const data = new ContextMenuCommandBuilder()
    .setName('Message Info (Support Staff)')
    .setType(ApplicationCommandType.Message)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: MessageContextMenuCommandInteraction) {
    const errorLogger = ErrorLogger.getInstance();
    const permissionUtil = PermissionUtil.getInstance();

    try {
        // Check if user has permission to view message info
        const guild = interaction.guild!;
        const member = await guild.members.fetch(interaction.user.id);
        
        const hasPermission = permissionUtil.hasAdminPermissions(member) ||
                             await permissionUtil.hasSupportStaffPermissions(member) ||
                             member.permissions.has(PermissionFlagsBits.ManageMessages);

        if (!hasPermission) {
            await interaction.reply({
                content: '❌ You need Manage Messages permission or support staff role to view message information.',
                ephemeral: true
            });
            return;
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const message = interaction.targetMessage;
        const author = message.author;
        const channel = message.channel;

        // Create detailed embed with message information
        const embed = new EmbedBuilder()
            .setTitle('📋 Message Information')
            .setColor(0x0099ff)
            .setTimestamp()
            .setFooter({ 
                text: `Message ID: ${message.id} • Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        // Basic message information
        embed.addFields(
            {
                name: '📝 Content',
                value: message.content || '*No text content*',
                inline: false
            },
            {
                name: '👤 Author',
                value: `${author.tag} (${author.id})`,
                inline: true
            },
            {
                name: '📅 Created',
                value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`,
                inline: true
            },
            {
                name: '🆔 Message ID',
                value: message.id,
                inline: true
            }
        );

        // Channel information
        embed.addFields(
            {
                name: '📍 Channel',
                value: `${channel} (${channel.id})`,
                inline: true
            },
            {
                name: '🏷️ Channel Type',
                value: channel.type.toString(),
                inline: true
            }
        );

        // Message metadata
        const metadata = [];
        
        if (message.editedTimestamp) {
            metadata.push(`**Edited:** <t:${Math.floor(message.editedTimestamp / 1000)}:R>`);
        }
        
        if (message.pinned) {
            metadata.push('**📌 Pinned**');
        }
        
        if (message.tts) {
            metadata.push('**🔊 Text-to-Speech**');
        }
        
        if (message.mentions.everyone) {
            metadata.push('**@everyone Mention**');
        }
        
        if (message.mentions.roles.size > 0) {
            metadata.push(`**Role Mentions:** ${message.mentions.roles.size}`);
        }
        
        if (message.mentions.users.size > 0) {
            metadata.push(`**User Mentions:** ${message.mentions.users.size}`);
        }

        if (metadata.length > 0) {
            embed.addFields({
                name: '📊 Metadata',
                value: metadata.join('\n'),
                inline: false
            });
        }

        // Attachments information
        if (message.attachments.size > 0) {
            const attachments = message.attachments.map(attachment => 
                `[${attachment.name}](${attachment.url}) (${(attachment.size / 1024).toFixed(1)} KB)`
            );
            
            embed.addFields({
                name: `📎 Attachments (${message.attachments.size})`,
                value: attachments.join('\n'),
                inline: false
            });
        }

        // Embeds information
        if (message.embeds.length > 0) {
            embed.addFields({
                name: `🎨 Embeds (${message.embeds.length})`,
                value: message.embeds.map((embed, index) => 
                    `**Embed ${index + 1}:** ${embed.title || 'Untitled'}`
                ).join('\n'),
                inline: false
            });
        }

        // Reactions information
        if (message.reactions.cache.size > 0) {
            const reactions = message.reactions.cache.map(reaction => 
                `${reaction.emoji} (${reaction.count})`
            );
            
            embed.addFields({
                name: `😀 Reactions (${message.reactions.cache.size})`,
                value: reactions.join(' '),
                inline: false
            });
        }

        // Thread information (if message is in a thread)
        if (message.thread) {
            embed.addFields({
                name: '🧵 Thread',
                value: `${message.thread} (${message.thread.id})`,
                inline: true
            });
        }

        // Reference information (if message is a reply)
        if (message.reference) {
            embed.addFields({
                name: '↩️ Reply To',
                value: `[Message ${message.reference.messageId}](${message.url})`,
                inline: true
            });
        }

        // Webhook information
        if (message.webhookId) {
            embed.addFields({
                name: '🔗 Webhook',
                value: `ID: ${message.webhookId}`,
                inline: true
            });
        }

        // System message information
        if (message.system) {
            embed.addFields({
                name: '⚙️ System Message',
                value: 'This is a system-generated message',
                inline: true
            });
        }

        // Add author avatar as thumbnail
        if (author.avatarURL()) {
            embed.setThumbnail(author.avatarURL()!);
        }

        await interaction.editReply({
            content: 'Here\'s the detailed message information:',
            embeds: [embed]
        });

    } catch (error) {
        console.error('Error in message info command:', error);
        await errorLogger.logError(error as Error, {
            guildId: interaction.guildId!,
            errorType: 'Context Menu Command Error',
            additionalContext: { 
                command: 'messageinfo',
                messageId: interaction.targetMessage.id,
                userId: interaction.user.id
            }
        });

        const errorMessage = '❌ An error occurred while retrieving message information.';
        
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ content: errorMessage });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}
