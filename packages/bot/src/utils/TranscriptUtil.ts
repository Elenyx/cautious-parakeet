import { 
    TextChannel, 
    Message, 
    EmbedBuilder, 
    AttachmentBuilder, 
    Client
} from 'discord.js';
import { TicketDAO } from '../database/TicketDAO';
import { GuildConfigDAO } from '../database/GuildConfigDAO';
import { ErrorLogger } from './ErrorLogger';

/**
 * Interface for transcript data
 */
export interface TranscriptData {
    ticketId: number;
    ticketNumber: string;
    guildId: string;
    channelId: string;
    createdBy: string;
    createdAt: string;
    closedAt: string;
    messages: TranscriptMessage[];
    participants: string[];
}

/**
 * Interface for transcript message
 */
export interface TranscriptMessage {
    id: string;
    author: {
        id: string;
        username: string;
        displayName: string;
        avatar?: string;
        bot: boolean;
    };
    content: string;
    timestamp: string;
    attachments: Array<{
        name: string;
        url: string;
        size: number;
    }>;
    embeds: Array<{
        title?: string;
        description?: string;
        color?: number;
        fields?: Array<{ name: string; value: string; inline?: boolean }>;
    }>;
    reactions: Array<{
        emoji: string;
        count: number;
    }>;
}

/**
 * Transcript utility for generating and saving ticket conversation transcripts
 */
export class TranscriptUtil {
    private static instance: TranscriptUtil;
    private ticketDAO: TicketDAO;
    private guildConfigDAO: GuildConfigDAO;
    private errorLogger: ErrorLogger;
    private client: Client | null = null;

    private constructor() {
        this.ticketDAO = new TicketDAO();
        this.guildConfigDAO = new GuildConfigDAO();
        this.errorLogger = ErrorLogger.getInstance();
    }

    /**
     * Get singleton instance of TranscriptUtil
     */
    public static getInstance(): TranscriptUtil {
        if (!TranscriptUtil.instance) {
            TranscriptUtil.instance = new TranscriptUtil();
        }
        return TranscriptUtil.instance;
    }

    /**
     * Set the Discord client
     */
    public setClient(client: Client): void {
        this.client = client;
    }

    /**
     * Generate and save transcript for a ticket
     */
    public async generateTranscript(ticketId: number): Promise<boolean> {
        console.log(`🔍 [TRANSCRIPT] Starting transcript generation for ticket ${ticketId}`);
        try {
            if (!this.client) {
                console.error(`❌ [TRANSCRIPT] Discord client not set`);
                throw new Error('Discord client not set');
            }
            console.log(`✅ [TRANSCRIPT] Discord client is available`);

            // Get ticket data
            console.log(`🔍 [TRANSCRIPT] Fetching ticket data for ID: ${ticketId}`);
            const ticket = await this.ticketDAO.getTicket(ticketId);
            if (!ticket) {
                console.error(`❌ [TRANSCRIPT] Ticket ${ticketId} not found in database`);
                throw new Error(`Ticket ${ticketId} not found`);
            }
            console.log(`✅ [TRANSCRIPT] Ticket found: #${ticket.ticket_number} in guild ${ticket.guild_id}`);

            // Get guild configuration
            console.log(`🔍 [TRANSCRIPT] Fetching guild config for guild: ${ticket.guild_id}`);
            const guildConfig = await this.guildConfigDAO.getGuildConfig(ticket.guild_id);
            if (!guildConfig?.transcript_channel) {
                console.warn(`⚠️ [TRANSCRIPT] No transcript channel configured for guild ${ticket.guild_id}`);
                return false;
            }
            console.log(`✅ [TRANSCRIPT] Transcript channel configured: ${guildConfig.transcript_channel}`);

            // Fetch the ticket channel
            console.log(`🔍 [TRANSCRIPT] Fetching ticket channel: ${ticket.channel_id}`);
            const ticketChannel = await this.client.channels.fetch(ticket.channel_id) as TextChannel;
            if (!ticketChannel) {
                console.error(`❌ [TRANSCRIPT] Ticket channel ${ticket.channel_id} not found`);
                throw new Error(`Ticket channel ${ticket.channel_id} not found`);
            }
            console.log(`✅ [TRANSCRIPT] Ticket channel found: ${ticketChannel.name}`);

            // Fetch transcript channel
            console.log(`🔍 [TRANSCRIPT] Fetching transcript channel: ${guildConfig.transcript_channel}`);
            const transcriptChannel = await this.client.channels.fetch(guildConfig.transcript_channel) as TextChannel;
            if (!transcriptChannel) {
                console.error(`❌ [TRANSCRIPT] Transcript channel ${guildConfig.transcript_channel} not found`);
                throw new Error(`Transcript channel ${guildConfig.transcript_channel} not found`);
            }
            console.log(`✅ [TRANSCRIPT] Transcript channel found: ${transcriptChannel.name}`);

            // Collect all messages from the ticket channel
            console.log(`🔍 [TRANSCRIPT] Collecting messages from ticket channel`);
            const messages = await this.collectChannelMessages(ticketChannel);
            console.log(`✅ [TRANSCRIPT] Collected ${messages.length} messages from ticket channel`);
            
            // Generate transcript data
            console.log(`🔍 [TRANSCRIPT] Generating transcript data structure`);
            const transcriptData: TranscriptData = {
                ticketId: ticket.id!,
                ticketNumber: `#${ticket.ticket_number}`,
                guildId: ticket.guild_id,
                channelId: ticket.channel_id,
                createdBy: ticket.user_id,
                createdAt: ticket.created_at!,
                closedAt: new Date().toISOString(),
                messages: messages,
                participants: [...new Set(messages.map(m => m.author.id))]
            };
            console.log(`✅ [TRANSCRIPT] Transcript data created with ${transcriptData.participants.length} participants`);

            // Generate both TXT and HTML transcripts
            console.log(`🔍 [TRANSCRIPT] Generating TXT transcript`);
            const txtTranscript = await this.generateImprovedTXTTranscript(transcriptData, ticketChannel, transcriptChannel);
            console.log(`✅ [TRANSCRIPT] TXT transcript generated (${txtTranscript.length} characters)`);
            
            // Note: HTML transcript generation removed to avoid unused code
            // HTML transcripts were causing issues with Discord's URL validation
            console.log(`ℹ️ [TRANSCRIPT] Skipping HTML transcript generation (Discord URL restrictions)`);
            
            // Create only TXT attachment for clean messaging
            console.log(`🔍 [TRANSCRIPT] Creating TXT attachment`);
            const txtAttachment = new AttachmentBuilder(
                Buffer.from(txtTranscript, 'utf-8'),
                { name: `ticket-${ticket.ticket_number}-transcript.txt` }
            );
            console.log(`✅ [TRANSCRIPT] TXT attachment created`);

            // Create summary embed
            console.log(`🔍 [TRANSCRIPT] Creating summary embed`);
            const summaryEmbed = this.createTranscriptSummary(transcriptData);
            console.log(`✅ [TRANSCRIPT] Summary embed created`);

            // Note: HTML button removed due to Discord's URL validation restrictions
            // Data URLs (data:text/html;base64,) are not supported by ButtonBuilder.setURL()
            // The TXT transcript attachment provides the complete conversation history
            console.log(`ℹ️ [TRANSCRIPT] HTML transcript generated but not linked (Discord URL restrictions)`);

            // Send clean transcript message
            console.log(`🔍 [TRANSCRIPT] Sending transcript message to channel: ${transcriptChannel.name}`);
            await transcriptChannel.send({
                embeds: [summaryEmbed],
                files: [txtAttachment]
            });

            console.log(`🎉 [TRANSCRIPT] Transcript successfully generated and sent for ticket ${ticket.ticket_number}`);
            return true;

        } catch (error) {
            console.error(`💥 [TRANSCRIPT] Error generating transcript for ticket ${ticketId}:`, error);
            await this.errorLogger.logError(error as Error, {
                errorType: 'TranscriptError',
                additionalContext: { ticketId },
                sendToDiscord: true
            });
            console.error(`💥 [TRANSCRIPT] Error logged, returning false`);
            return false;
        }
    }

    /**
     * Collect all messages from a channel
     */
    private async collectChannelMessages(channel: TextChannel): Promise<TranscriptMessage[]> {
        const messages: TranscriptMessage[] = [];
        let lastMessageId: string | undefined;

        try {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const fetchedMessages = await channel.messages.fetch({
                    limit: 100,
                    before: lastMessageId
                });

                if (fetchedMessages.size === 0) break;

                for (const message of fetchedMessages.values()) {
                    messages.push(await this.formatMessage(message));
                }

                lastMessageId = fetchedMessages.last()?.id;
            }

            // Sort messages by timestamp (oldest first)
            return messages.reverse();

        } catch (error) {
            console.error('Error collecting channel messages:', error);
            return messages;
        }
    }

    /**
     * Format a Discord message for transcript
     */
    private async formatMessage(message: Message): Promise<TranscriptMessage> {
        const author = message.author;
        const member = message.member;

        return {
            id: message.id,
            author: {
                id: author.id,
                username: author.username,
                displayName: member?.displayName || author.displayName,
                avatar: author.displayAvatarURL({ size: 128 }),
                bot: author.bot
            },
            content: message.content,
            timestamp: message.createdAt.toISOString(),
            attachments: message.attachments.map(attachment => ({
                name: attachment.name || 'unknown',
                url: attachment.url,
                size: attachment.size
            })),
            embeds: message.embeds.map(embed => ({
                title: embed.title || undefined,
                description: embed.description || undefined,
                color: embed.color || undefined,
                fields: embed.fields.map(field => ({
                    name: field.name,
                    value: field.value,
                    inline: field.inline
                }))
            })),
            reactions: message.reactions.cache.map(reaction => ({
                emoji: reaction.emoji.toString(),
                count: reaction.count
            }))
        };
    }







    /**
     * Generate an improved plain text transcript with better formatting and server information
     * @param transcriptData - The transcript data
     * @param ticketChannel - The ticket channel
     * @param transcriptChannel - The transcript channel
     * @returns The improved plain text transcript
     */
    private async generateImprovedTXTTranscript(
        transcriptData: TranscriptData, 
        ticketChannel: TextChannel, 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        _transcriptChannel: TextChannel
    ): Promise<string> {
        let txtContent = '';
        
        // Get server and category information
        const guild = ticketChannel.guild;
        const category = ticketChannel.parent;
        const timezone = 'UTC+08:00'; // You can make this configurable
        
        // Header with improved formatting
        txtContent += '=== DISCORD TICKET TRANSCRIPT ===\n';
        txtContent += `Server: ${guild.name}\n`;
        txtContent += `Channel: ${ticketChannel.name}\n`;
        txtContent += `Category: ${category?.name || 'No Category'}\n`;
        txtContent += `Total Messages: ${transcriptData.messages.length}\n`;
        txtContent += `Generated: ${new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Singapore' }).replace(' ', ' ')} ${timezone}\n`;
        txtContent += `Generated by: Bot System\n`;
        txtContent += '=====================================\n\n';
        
        // Messages with improved formatting
        for (const message of transcriptData.messages) {
            const timestamp = new Date(message.timestamp).toLocaleString('sv-SE', { timeZone: 'Asia/Singapore' }).replace(' ', ' ');
            const author = message.author.displayName || message.author.username;
            const authorDisplay = author + (message.author.bot ? '' : ''); // Remove [BOT] suffix for cleaner look
            
            txtContent += `[${timestamp} ${timezone}] ${authorDisplay}: `;
            
            // Message content
            if (message.content) {
                // Clean Discord markdown for plain text but preserve structure
                const cleanContent = message.content
                    .replace(/\*\*(.*?)\*\*/g, '$1')  // Bold
                    .replace(/\*(.*?)\*/g, '$1')      // Italic
                    .replace(/__(.*?)__/g, '$1')      // Underline
                    .replace(/~~(.*?)~~/g, '$1')      // Strikethrough
                    .replace(/`(.*?)`/g, '$1')        // Inline code
                    .replace(/```[\s\S]*?```/g, '[CODE BLOCK]')  // Code blocks
                    .replace(/<@!?(\d+)>/g, (_match, id) => {
                        // Try to resolve user mentions to actual usernames
                        try {
                            const user = guild.members.cache.get(id);
                            return user ? `<@${id}>` : '@User';
                        } catch {
                            return '<@' + id + '>';
                        }
                    })
                    .replace(/<#(\d+)>/g, (_match, id) => {
                        try {
                            const channel = guild.channels.cache.get(id);
                            return channel ? `#${channel.name}` : '#channel';
                        } catch {
                            return '#channel';
                        }
                    })
                    .replace(/<@&(\d+)>/g, (_match, id) => {
                        try {
                            const role = guild.roles.cache.get(id);
                            return role ? `@${role.name}` : '@Role';
                        } catch {
                            return '@Role';
                        }
                    });
                
                txtContent += cleanContent;
            }
            
            txtContent += '\n';
            
            // Attachments with clickable Markdown links
            if (message.attachments && message.attachments.length > 0) {
                for (const attachment of message.attachments) {
                    const sizeKB = (attachment.size / 1024).toFixed(1);
                    const fileExtension = attachment.name.split('.').pop()?.toLowerCase() || '';
                    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
                    const fileIcon = isImage ? '🖼️' : '📎';
                    
                    // Use Markdown link format for clickable links
                    if (attachment.url) {
                        txtContent += `    ${fileIcon} [${attachment.name}](${attachment.url}) (${sizeKB} KB)\n`;
                    } else {
                        txtContent += `    ${fileIcon} ${attachment.name} (${sizeKB} KB)\n`;
                    }
                }
            }
            
            // Embeds with better formatting
            if (message.embeds && message.embeds.length > 0) {
                for (const embed of message.embeds) {
                    if (embed.title) {
                        txtContent += `    [EMBED] Title: ${embed.title}\n`;
                    }
                    if (embed.description) {
                        // Clean embed description but preserve line breaks
                        const cleanDescription = embed.description
                            .replace(/\*\*(.*?)\*\*/g, '$1')
                            .replace(/\*(.*?)\*/g, '$1')
                            .replace(/__(.*?)__/g, '$1')
                            .replace(/~~(.*?)~~/g, '$1')
                            .replace(/<@!?(\d+)>/g, (_match, id) => {
                                try {
                                    const user = guild.members.cache.get(id);
                                    return user ? `<@${id}>` : '@User';
                                } catch {
                                    return '<@' + id + '>';
                                }
                            });
                        
                        txtContent += `    [EMBED] Description: ${cleanDescription}\n`;
                    }
                    if (embed.fields && embed.fields.length > 0) {
                        for (const field of embed.fields) {
                            txtContent += `    [EMBED] ${field.name}: ${field.value}\n`;
                        }
                    }
                }
            }
            
            // Reactions
            if (message.reactions && message.reactions.length > 0) {
                const reactions = message.reactions.map(reaction => 
                    `${reaction.emoji}:${reaction.count}`
                ).join(', ');
                txtContent += `    [REACTIONS] ${reactions}\n`;
            }
            
            txtContent += '\n';
        }
        
        txtContent += '=== END OF TRANSCRIPT ===\n';
        
        return txtContent;
    }

    /**
     * Create transcript summary embed
     */
    private createTranscriptSummary(data: TranscriptData): EmbedBuilder {
        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`📋 Ticket ${data.ticketNumber} Transcript`)
            .setDescription('Ticket conversation has been archived.')
            .addFields(
                { name: '🎫 Ticket ID', value: data.ticketNumber, inline: true },
                { name: '👤 Created By', value: `<@${data.createdBy}>`, inline: true },
                { name: '📅 Created At', value: `<t:${Math.floor(new Date(data.createdAt).getTime() / 1000)}:F>`, inline: true },
                { name: '🔒 Closed At', value: `<t:${Math.floor(new Date(data.closedAt).getTime() / 1000)}:F>`, inline: true },
                { name: '💬 Messages', value: data.messages.length.toString(), inline: true },
                { name: '👥 Participants', value: data.participants.length.toString(), inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Ticket System' });

        return embed;
    }


}