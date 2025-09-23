import { 
    ButtonInteraction, 
    ChannelType, 
    TextChannel,
    TextDisplayBuilder,
    ButtonBuilder,
    ButtonStyle,
    MessageFlags,
    CategoryChannel,
    GuildMember,
    ContainerBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize
} from "discord.js";
import { PostgreSQLGuildConfigDAO } from '../database/PostgreSQLGuildConfigDAO';
import { PostgreSQLTicketDAO } from '../database/PostgreSQLTicketDAO';
import { PermissionUtil } from '../utils/PermissionUtil';
import { ErrorLogger } from '../utils/ErrorLogger';
import { TranscriptUtil } from '../utils/TranscriptUtil';

// Ticket types configuration
const ticketTypes = [
    {
        id: 'support',
        label: 'General Support',
        description: 'Get help with general questions and issues',
        emoji: '💬'
    },
    {
        id: 'report',
        label: 'Report Issue',
        description: 'Report bugs, problems, or violations',
        emoji: '🚨'
    },
    {
        id: 'appeal',
        label: 'Appeal',
        description: 'Appeal a moderation action or decision',
        emoji: '⚖️'
    },
    {
        id: 'billing',
        label: 'Billing',
        description: 'Get help with billing and payment issues',
        emoji: '💳'
    }
];

export class TicketHandler {
    private static guildConfigDAO = new PostgreSQLGuildConfigDAO();
    private static ticketDAO = new PostgreSQLTicketDAO();
    private static permissionUtil = PermissionUtil.getInstance();
    private static errorLogger = ErrorLogger.getInstance();
    private static transcriptUtil = TranscriptUtil.getInstance();

    /**
     * Handle ticket creation from button interactions
     */
    static async handleTicketCreation(interaction: ButtonInteraction) {
        if (!interaction.customId.startsWith("ticket_create_")) {
            return false;
        }

        const ticketTypeId = interaction.customId.replace("ticket_create_", "");
        const ticketType = ticketTypes.find(type => type.id === ticketTypeId);
        
        if (!ticketType) {
            await interaction.reply({
                content: "❌ Invalid ticket type. Please try again.",
                ephemeral: true
            });
            return true;
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            const guildId = interaction.guildId!;
            const userId = interaction.user.id;

            // Get guild configuration
            const guildConfig = await this.guildConfigDAO.getGuildConfig(guildId);
            if (!guildConfig) {
                await interaction.editReply({
                    content: "❌ Ticket system is not configured for this server. Please contact an administrator."
                });
                return true;
            }

            if (!guildConfig.category_id) {
                await interaction.editReply({
                    content: "❌ No ticket category configured. Please contact an administrator to set up the ticket system."
                });
                return true;
            }

            // Check if user already has an open ticket
            console.log(`[TICKET_CHECK] Starting open ticket check for user ${userId} in guild ${guildId}`);
            
            try {
                const existingTickets = await this.ticketDAO.getUserOpenTickets(guildId, userId);
                
                console.log(`[TICKET_CHECK] Retrieved ${existingTickets.length} existing tickets for user ${userId}`);
                
                if (existingTickets.length > 0) {
                    const ticketChannel = existingTickets[0];
                    
                    // Log detailed information about the existing ticket
                    console.log(`[TICKET_CHECK] Found existing ticket:`, {
                        ticketId: ticketChannel.id,
                        channelId: ticketChannel.channel_id,
                        status: ticketChannel.status,
                        createdAt: ticketChannel.created_at,
                        ticketNumber: ticketChannel.ticket_number
                    });
                    
                    // Verify the channel actually exists in Discord
                    try {
                        const discordChannel = await interaction.guild!.channels.fetch(ticketChannel.channel_id);
                        if (!discordChannel) {
                            // Channel doesn't exist in Discord but exists in database
                            console.error(`[TICKET_CHECK] ❌ CRITICAL: Database shows open ticket but Discord channel ${ticketChannel.channel_id} doesn't exist!`);
                            
                            await this.errorLogger.logTicketError(new Error('Database-Discord channel mismatch: Channel exists in database but not in Discord'), {
                                guildId,
                                userId,
                                action: 'verify_existing_ticket',
                                channelId: ticketChannel.channel_id,
                                ticketId: ticketChannel.id
                            });
                            
                            // Update the ticket status to closed since the channel doesn't exist
                            if (ticketChannel.id) {
                                await this.ticketDAO.updateTicketStatus(ticketChannel.id, 'closed');
                                console.log(`[TICKET_CHECK] Updated orphaned ticket ${ticketChannel.id} status to closed`);
                            }
                            
                            // Allow ticket creation to proceed since the channel doesn't actually exist
                        } else {
                            console.log(`[TICKET_CHECK] ✅ Verified Discord channel ${ticketChannel.channel_id} exists`);
                            
                            await interaction.editReply({
                                content: `❌ You already have an open ticket: <#${ticketChannel.channel_id}>`
                            });
                            return true;
                        }
                    } catch (channelFetchError) {
                        console.error(`[TICKET_CHECK] Error fetching Discord channel ${ticketChannel.channel_id}:`, channelFetchError);
                        
                        await this.errorLogger.logTicketError(channelFetchError as Error, {
                            guildId,
                            userId,
                            action: 'fetch_existing_ticket_channel',
                            channelId: ticketChannel.channel_id,
                            ticketId: ticketChannel.id
                        });
                        
                        // If we can't fetch the channel, it likely doesn't exist
                        // Update ticket status and allow creation to proceed
                        if (ticketChannel.id) {
                            await this.ticketDAO.updateTicketStatus(ticketChannel.id, 'closed');
                            console.log(`[TICKET_CHECK] Updated unfetchable ticket ${ticketChannel.id} status to closed`);
                        }
                    }
                } else {
                    console.log(`[TICKET_CHECK] ✅ No existing open tickets found for user ${userId}`);
                }
            } catch (ticketCheckError) {
                console.error(`[TICKET_CHECK] ❌ Error checking existing tickets:`, ticketCheckError);
                
                await this.errorLogger.logTicketError(ticketCheckError as Error, {
                    guildId,
                    userId,
                    action: 'check_existing_tickets_failed'
                });
                
                // Log this as a database error as well
                await this.errorLogger.logDatabaseError(ticketCheckError as Error, {
                    guildId,
                    operation: 'getUserOpenTickets_in_handler',
                    table: 'tickets'
                });
                
                // Continue with ticket creation even if check fails
                console.log(`[TICKET_CHECK] Proceeding with ticket creation despite check failure`);
            }

            // Validate category permissions
            const category = await interaction.guild!.channels.fetch(guildConfig.category_id) as CategoryChannel;
            if (!category) {
                await interaction.editReply({
                    content: "❌ Ticket category not found. Please contact an administrator."
                });
                return true;
            }

            const categoryValidation = await this.permissionUtil.validateCategoryPermissions(category.id, interaction.guild!);
            if (!categoryValidation.valid) {
                await this.errorLogger.logTicketError(new Error('Category permission validation failed'), {
                    guildId,
                    userId,
                    action: 'create_ticket',
                    channelId: category.id
                });

                await interaction.editReply({
                    content: "❌ Bot doesn't have proper permissions in the ticket category. Please contact an administrator."
                });
                return true;
            }

            // Get support role IDs
            let supportRoleIds: string[] = [];
            if (guildConfig.support_role_ids) {
                supportRoleIds = guildConfig.support_role_ids;
            }

            // Increment ticket counter and get new ticket number
            const ticketNumber = await this.guildConfigDAO.incrementTicketCounter(guildId);

            // Create permission overwrites
            const permissionOverwrites = this.permissionUtil.createTicketPermissionOverwrites(
                interaction.guild!,
                userId,
                supportRoleIds
            );

            // Create the ticket channel
            const ticketChannel = await interaction.guild!.channels.create({
                name: `${ticketType.id}-${ticketNumber.toString().padStart(4, '0')}`,
                type: ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites,
                topic: `${ticketType.label} ticket created by ${interaction.user.tag} | Ticket #${ticketNumber}`
            }) as TextChannel;

            if (!ticketChannel) {
                throw new Error("Failed to create ticket channel");
            }

            // Save ticket to database
            const ticketId = await this.ticketDAO.createTicket({
                guild_id: guildId,
                channel_id: ticketChannel.id,
                user_id: userId,
                ticket_type: ticketType.id,
                ticket_number: ticketNumber
            });

            // Log ticket creation message
            await this.ticketDAO.addMessage({
                ticket_id: ticketId!,
                message_id: `system-${Date.now()}`,
                user_id: interaction.client.user!.id,
                username: interaction.client.user!.username,
                content: `Ticket created by ${interaction.user.tag}`,
                attachments: []
            });

            // Create Components V2 welcome message
            const welcomeTitle = new TextDisplayBuilder()
                .setContent(`# 🎫 ${ticketType.label} Ticket #${ticketNumber}\n**Created by:** ${interaction.user.tag}\n**Ticket Type:** ${ticketType.description}`);

            // Create welcome container with text and close button
            const welcomeContainer = new ContainerBuilder()
                .setAccentColor(0x00ff00) // Green accent for welcome
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent('**Hello!** Thank you for creating a support ticket.'),
                    new TextDisplayBuilder().setContent('Please describe your issue in detail below. A staff member will assist you shortly.'),
                    new TextDisplayBuilder().setContent('**Note:** Use the close button below when your issue is resolved.')
                )
                .addActionRowComponents(
                    actionRow => actionRow.setComponents(
                        new ButtonBuilder()
                            .setCustomId(`ticket_close_${ticketId}`)
                            .setLabel('Close Ticket')
                            .setStyle(ButtonStyle.Danger)
                    )
                );

            // Create user mention component for Components V2
            const userMention = new TextDisplayBuilder()
                .setContent(`${interaction.user}`);

            // Send welcome message to ticket channel
            await ticketChannel.send({
                components: [userMention, welcomeTitle, welcomeContainer],
                flags: MessageFlags.IsComponentsV2
            });

            // Send notification to support staff if configured
            if (supportRoleIds.length > 0) {
                const staffPing = supportRoleIds.map(id => `<@&${id}>`).join(' ');
                
                // Create staff notification using Components V2
                const staffNotificationTitle = new TextDisplayBuilder()
                    .setContent(`# 🎫 New Ticket Created\n**Ticket #${ticketNumber}** has been created and requires attention.`);

                // Create staff notification details using individual TextDisplayBuilder components
                const staffNotificationTypeInfo = new TextDisplayBuilder()
                    .setContent(`**Type:** ${ticketType.label} ${ticketType.emoji}`);
                
                const staffNotificationUserInfo = new TextDisplayBuilder()
                    .setContent(`**User:** ${interaction.user}`);
                
                const staffNotificationChannelInfo = new TextDisplayBuilder()
                    .setContent(`**Channel:** ${ticketChannel}`);

                const staffNotificationContainer = new ContainerBuilder()
                    .setAccentColor(0x0099ff)
                    .addTextDisplayComponents(
                        staffNotificationTitle,
                        staffNotificationTypeInfo,
                        staffNotificationUserInfo,
                        staffNotificationChannelInfo
                    );

                // Send staff ping with Components V2 notification
                const staffPingMessage = new TextDisplayBuilder()
                    .setContent(staffPing);

                await ticketChannel.send({
                    components: [staffPingMessage, staffNotificationContainer],
                    flags: MessageFlags.IsComponentsV2
                });
            }

            // Reply to the user
            await interaction.editReply({
                content: `✅ ${ticketType.label} ticket created successfully! ${ticketChannel}`
            });

            return true;
        } catch (error) {
            console.error('Error creating ticket:', error);
            await this.errorLogger.logTicketError(error as Error, {
                guildId: interaction.guildId || undefined,
                userId: interaction.user.id,
                action: 'create_ticket'
            });

            await interaction.editReply({
                content: "❌ There was an error creating your ticket. Please try again later or contact an administrator."
            });
            return true;
        }
    }

    /**
     * Disable chat permissions for the ticket owner while preserving staff permissions
     */
    private static async disableChatPermissions(channel: TextChannel, ticketOwnerId: string): Promise<boolean> {
        try {
            const guild = channel.guild;
            
            // Get the ticket owner user
            const ticketOwner = await guild.members.fetch(ticketOwnerId).catch(() => null);
            if (!ticketOwner) {
                console.warn(`Could not fetch ticket owner ${ticketOwnerId} for permission update`);
                return false;
            }
            
            // Set permission overrides to deny sending messages for the ticket owner only
            // Allow ViewChannel and ReadMessageHistory but deny SendMessages and related permissions
            await channel.permissionOverwrites.edit(ticketOwner, {
                ViewChannel: true,
                ReadMessageHistory: true,
                SendMessages: false,
                SendMessagesInThreads: false,
                CreatePublicThreads: false,
                CreatePrivateThreads: false,
                AddReactions: false
            });

            // Staff roles and administrators retain their permissions as they were set during ticket creation
            // No need to modify their permissions here
            
            return true;
        } catch (error) {
            console.error('Error disabling chat permissions:', error);
            return false;
        }
    }

    /**
     * Handle ticket closing from button interactions
     */
    static async handleTicketClose(interaction: ButtonInteraction) {
        if (!interaction.customId.startsWith("ticket_close_")) {
            return false;
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            const ticketIdStr = interaction.customId.replace("ticket_close_", "");
            const ticketId = parseInt(ticketIdStr);

            if (isNaN(ticketId)) {
                await interaction.editReply({
                    content: "❌ Invalid ticket ID."
                });
                return true;
            }

            const guildId = interaction.guildId!;
            const userId = interaction.user.id;
            const channel = interaction.channel as TextChannel;

            // Get ticket from database
            const ticket = await this.ticketDAO.getTicket(ticketId);
            if (!ticket) {
                await interaction.editReply({
                    content: "❌ Ticket not found in database."
                });
                return true;
            }

            if (ticket.status === 'closed') {
                await interaction.editReply({
                    content: "❌ This ticket is already closed."
                });
                return true;
            }

            // Check permissions - only ticket creator or support staff can close
            const member = interaction.member;
            const isTicketCreator = ticket.user_id === userId;
            const isSupportStaff = member ? await this.permissionUtil.isSupportStaff(member as GuildMember) : false;

            if (!isTicketCreator && !isSupportStaff) {
                await interaction.editReply({
                    content: "❌ You don't have permission to close this ticket."
                });
                return true;
            }

            // Get guild configuration for transcript channel
            const guildConfig = await this.guildConfigDAO.getGuildConfig(guildId);
            
            // Generate transcript before closing
            const transcriptGenerated = await this.transcriptUtil.generateTranscript(ticketId);

            // Update ticket status in database
            await this.ticketDAO.closeTicket(ticketId, userId);

            // Disable chat permissions for the ticket owner
            const chatDisabled = await this.disableChatPermissions(channel, ticket.user_id);
            
            // Log ticket closure
            await this.ticketDAO.addMessage({
                ticket_id: ticketId,
                message_id: `system-${Date.now()}`,
                user_id: userId,
                username: interaction.user.username,
                content: `Ticket closed by ${interaction.user.tag}`,
                attachments: []
            });

            // Create transcript confirmation message
            let transcriptMessage = "";
            if (transcriptGenerated && guildConfig?.transcript_channel_id) {
                transcriptMessage = `✅ Transcript has been generated and saved in <#${guildConfig.transcript_channel_id}>`;
            } else if (guildConfig?.transcript_channel_id) {
                transcriptMessage = `⚠️ Transcript could not be generated, but would normally be saved in <#${guildConfig.transcript_channel_id}>`;
            } else {
                transcriptMessage = "⚠️ No transcript channel configured - transcript could not be saved";
            }

            // Create closing message using Components V2
            const closingContainer = new ContainerBuilder()
                .setAccentColor(0xFF0000)
                .addTextDisplayComponents(
                    new TextDisplayBuilder().setContent(`# 🔒 Ticket Closed\nThis ticket has been closed by ${interaction.user}.`),
                    new TextDisplayBuilder().setContent(`**Ticket #${ticket.ticket_number}** - ${ticket.ticket_type}`),
                    new TextDisplayBuilder().setContent(transcriptMessage),
                    new TextDisplayBuilder().setContent(`**Created:** <t:${Math.floor(new Date(ticket.created_at!).getTime() / 1000)}:F>`),
                    new TextDisplayBuilder().setContent(`**Creator:** <@${ticket.user_id}>`),
                    new TextDisplayBuilder().setContent(chatDisabled ? "🔇 **Chat has been disabled** - You can view the conversation but cannot send new messages." : "⚠️ Chat permissions could not be updated."),
                    new TextDisplayBuilder().setContent("If you need further assistance, please create a new ticket.")
                );

            // Add admin-only channel deletion button if user has admin permissions
            const isAdmin = member ? this.permissionUtil.hasAdminPermissions(member as GuildMember) : false;
            if (isAdmin || isSupportStaff) {
                closingContainer.addSeparatorComponents(
                    new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true)
                ).addActionRowComponents(
                    actionRow => actionRow.setComponents(
                        new ButtonBuilder()
                            .setCustomId(`delete_channel_${ticketId}`)
                            .setLabel("🗑️ Delete Channel")
                            .setStyle(ButtonStyle.Danger)
                    )
                ).addTextDisplayComponents(
                    new TextDisplayBuilder().setContent("⚠️ **Staff Only:** Use the button above to permanently delete this channel.")
                );
            }

            await interaction.editReply({
                content: "✅ Ticket has been closed successfully."
            });

            await channel.send({
                components: [closingContainer],
                flags: MessageFlags.IsComponentsV2
            });

            return true;
        } catch (error) {
            console.error('Error closing ticket:', error);
            await this.errorLogger.logTicketError(error as Error, {
                guildId: interaction.guildId || undefined,
                userId: interaction.user.id,
                action: 'close_ticket'
            });

            await interaction.editReply({
                content: "❌ There was an error closing the ticket. Please contact an administrator."
            });
            return true;
        }
    }

    /**
     * Handle ticket assignment (support staff only)
     */
    static async handleTicketAssign(interaction: ButtonInteraction) {
        if (!interaction.customId.startsWith("ticket_assign_")) {
            return false;
        }

        try {
            const member = interaction.member;
            if (!member || !(await this.permissionUtil.isSupportStaff(member as GuildMember))) {
                await interaction.reply({
                    content: "❌ You don't have permission to assign tickets.",
                    ephemeral: true
                });
                return true;
            }

            const ticketIdStr = interaction.customId.replace("ticket_assign_", "");
            const ticketId = parseInt(ticketIdStr);

            if (isNaN(ticketId)) {
                await interaction.reply({
                    content: "❌ Invalid ticket ID.",
                    ephemeral: true
                });
                return true;
            }

            // Update ticket assignment
            await this.ticketDAO.updateTicket(ticketId, { assigned_to: interaction.user.id });

            // Log assignment
            await this.ticketDAO.addMessage({
                ticket_id: ticketId,
                message_id: `system-${Date.now()}`,
                user_id: interaction.user.id,
                username: interaction.user.username,
                content: `Ticket assigned to ${interaction.user.tag}`,
                attachments: []
            });

            await interaction.reply({
                content: `✅ Ticket has been assigned to ${interaction.user}.`,
                ephemeral: false
            });

            return true;
        } catch (error) {
            console.error('Error assigning ticket:', error);
            await this.errorLogger.logTicketError(error as Error, {
                guildId: interaction.guildId || undefined,
                userId: interaction.user.id,
                action: 'assign_ticket'
            });

            await interaction.reply({
                content: "❌ There was an error assigning the ticket.",
                ephemeral: true
            });
            return true;
        }
    }

    /**
     * Handle channel deletion (admin/staff only)
     */
    static async handleChannelDelete(interaction: ButtonInteraction) {
        if (!interaction.customId.startsWith("delete_channel_")) {
            return false;
        }

        try {
            await interaction.deferReply({ ephemeral: true });

            const ticketIdStr = interaction.customId.replace("delete_channel_", "");
            const ticketId = parseInt(ticketIdStr);

            if (isNaN(ticketId)) {
                await interaction.editReply({
                    content: "❌ Invalid ticket ID."
                });
                return true;
            }

            const guildId = interaction.guildId!;
            const userId = interaction.user.id;
            const channel = interaction.channel as TextChannel;
            const member = interaction.member;

            // Check if user is support staff or admin
            const isSupportStaff = member ? await this.permissionUtil.isSupportStaff(member as GuildMember) : false;

            if (!isSupportStaff) {
                await interaction.editReply({
                    content: "❌ You don't have permission to delete this channel. Only administrators and support staff can delete ticket channels."
                });
                return true;
            }

            // Get ticket from database to verify it exists and is closed
            const ticket = await this.ticketDAO.getTicket(ticketId);
            if (!ticket) {
                await interaction.editReply({
                    content: "❌ Ticket not found in database."
                });
                return true;
            }

            if (ticket.status !== 'closed') {
                await interaction.editReply({
                    content: "❌ This ticket must be closed before the channel can be deleted."
                });
                return true;
            }

            // Log the channel deletion
            await this.ticketDAO.addMessage({
                ticket_id: ticketId,
                message_id: `system-${Date.now()}`,
                user_id: userId,
                username: interaction.user.username,
                content: `Channel deletion initiated by ${interaction.user.tag}`,
                attachments: []
            });

            await interaction.editReply({
                content: "✅ Channel will be deleted in 5 seconds..."
            });

            // Delete the channel after a short delay
            setTimeout(async () => {
                try {
                    await channel.delete(`Ticket channel deleted by ${interaction.user.tag}`);
                } catch (error) {
                    console.error('Error deleting ticket channel:', error);
                    await this.errorLogger.logTicketError(error as Error, {
                        guildId,
                        userId,
                        ticketId,
                        channelId: channel.id,
                        action: 'delete_channel'
                    });
                }
            }, 5000);

            return true;
        } catch (error) {
            console.error('Error deleting channel:', error);
            await this.errorLogger.logTicketError(error as Error, {
                guildId: interaction.guildId || undefined,
                userId: interaction.user.id,
                action: 'delete_channel'
            });

            await interaction.editReply({
                content: "❌ There was an error deleting the channel. Please contact an administrator."
            });
            return true;
        }
    }

    /**
     * Get ticket types for display
     */
    static getTicketTypes() {
        return ticketTypes;
    }

    /**
     * Main handler for all ticket-related interactions
     */
    static async handleInteraction(interaction: ButtonInteraction): Promise<boolean> {
        if (interaction.customId.startsWith("ticket_create_")) {
            return await this.handleTicketCreation(interaction);
        }
        
        if (interaction.customId.startsWith("ticket_close_")) {
            return await this.handleTicketClose(interaction);
        }

        if (interaction.customId.startsWith("ticket_assign_")) {
            return await this.handleTicketAssign(interaction);
        }

        if (interaction.customId.startsWith("delete_channel_")) {
            return await this.handleChannelDelete(interaction);
        }

        return false;
    }
}