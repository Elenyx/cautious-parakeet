import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType,
    CategoryChannel,
    TextChannel,
    Role
} from 'discord.js';
import { PostgreSQLGuildConfigDAO } from '../database/PostgreSQLGuildConfigDAO';
import { PermissionUtil } from '../utils/PermissionUtil';
import { ErrorLogger } from '../utils/ErrorLogger';

/**
 * Setup command for configuring the ticket system
 */
export const data = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure the ticket system for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand
            .setName('category')
            .setDescription('Set the category where ticket channels will be created')
            .addChannelOption(option =>
                option
                    .setName('category')
                    .setDescription('The category channel for tickets')
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('panel')
            .setDescription('Set the channel where the ticket panel will be displayed')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('The channel for the ticket panel')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('transcript')
            .setDescription('Set the channel where ticket transcripts will be logged')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('The channel for ticket transcripts')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('errorlog')
            .setDescription('Set the channel where bot errors will be logged')
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('The channel for error logs')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('support')
            .setDescription('Add or remove support roles that can manage tickets')
            .addStringOption(option =>
                option
                    .setName('action')
                    .setDescription('Add or remove support role')
                    .addChoices(
                        { name: 'Add Role', value: 'add' },
                        { name: 'Remove Role', value: 'remove' },
                        { name: 'List Roles', value: 'list' },
                        { name: 'Clear All', value: 'clear' }
                    )
                    .setRequired(true)
            )
            .addRoleOption(option =>
                option
                    .setName('role')
                    .setDescription('The support role to add or remove')
                    .setRequired(false)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('cleanup')
            .setDescription('Configure automatic cleanup policies')
            .addIntegerOption(option =>
                option
                    .setName('ticket_days')
                    .setDescription('Days to keep closed tickets (0 = never delete)')
                    .setMinValue(0)
                    .setMaxValue(365)
                    .setRequired(false)
            )
            .addIntegerOption(option =>
                option
                    .setName('log_days')
                    .setDescription('Days to keep error logs (0 = never delete)')
                    .setMinValue(0)
                    .setMaxValue(365)
                    .setRequired(false)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('view')
            .setDescription('View current ticket system configuration')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('reset')
            .setDescription('Reset all ticket system configuration')
            .addBooleanOption(option =>
                option
                    .setName('confirm')
                    .setDescription('Confirm that you want to reset all configuration')
                    .setRequired(true)
            )
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const guildConfigDAO = new PostgreSQLGuildConfigDAO();
    const permissionUtil = PermissionUtil.getInstance();
    const errorLogger = ErrorLogger.getInstance();

    try {
        // Check if user has admin permissions
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({
                content: '❌ You need Administrator permissions to use this command.',
                ephemeral: true
            });
            return;
        }

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'category':
                await handleCategorySetup(interaction, guildConfigDAO, permissionUtil);
                break;
            case 'panel':
                await handlePanelSetup(interaction, guildConfigDAO);
                break;
            case 'transcript':
                await handleTranscriptSetup(interaction, guildConfigDAO);
                break;
            case 'errorlog':
                await handleErrorLogSetup(interaction, guildConfigDAO);
                break;
            case 'support':
                await handleSupportRoleSetup(interaction, guildConfigDAO, permissionUtil);
                break;
            case 'cleanup':
                await handleCleanupSetup(interaction, guildConfigDAO);
                break;
            case 'view':
                await handleViewConfig(interaction, guildConfigDAO);
                break;
            case 'reset':
                await handleResetConfig(interaction, guildConfigDAO);
                break;
        }

    } catch (error) {
        console.error('Error in setup command:', error);
        await errorLogger.logCommandError(error as Error, {
            guildId: interaction.guildId || undefined,
            userId: interaction.user.id,
            commandName: 'setup'
        });

        const errorMessage = '❌ An error occurred while processing the setup command.';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

/**
 * Handle category setup
 */
async function handleCategorySetup(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO,
    permissionUtil: PermissionUtil
) {
    const category = interaction.options.getChannel('category') as CategoryChannel;
    const guildId = interaction.guildId!;

    // Validate category permissions
    const validation = await permissionUtil.validateCategoryPermissions(category.id, interaction.guild!);
    if (!validation.valid) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('❌ Category Validation Failed')
            .setDescription('The selected category has permission issues:')
            .addFields({
                name: 'Issues Found',
                value: validation.issues.map(issue => `• ${issue}`).join('\n'),
                inline: false
            })
            .addFields({
                name: 'Required Permissions',
                value: '• View Channel\n• Manage Channels\n• Manage Roles',
                inline: false
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }

    // Update configuration
    await guildConfigDAO.upsertGuildConfig({ guild_id: guildId, category_id: category.id });

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ Category Configured')
        .setDescription(`Ticket category has been set to ${category}`)
        .addFields({
            name: 'Category Info',
            value: `**Name:** ${category.name}\n**ID:** ${category.id}\n**Channels:** ${category.children.cache.size}/50`,
            inline: false
        });

    await interaction.reply({ embeds: [embed] });
}

/**
 * Handle panel channel setup
 */
async function handlePanelSetup(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO
) {
    const channel = interaction.options.getChannel('channel') as TextChannel;
    const guildId = interaction.guildId!;

    // Check if bot can send messages in the channel
    const botPermissions = channel.permissionsFor(interaction.guild!.members.me!);
    if (!botPermissions?.has(['ViewChannel', 'SendMessages', 'EmbedLinks'])) {
        await interaction.reply({
            content: '❌ I don\'t have permission to send messages in that channel. Please ensure I have View Channel, Send Messages, and Embed Links permissions.',
            ephemeral: true
        });
        return;
    }

    // Update configuration
    await guildConfigDAO.upsertGuildConfig({ guild_id: guildId, panel_channel_id: channel.id });

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ Panel Channel Configured')
        .setDescription(`Ticket panel channel has been set to ${channel}`)
        .addFields({
            name: 'Next Steps',
            value: 'Use `/ticket deploy` to deploy the ticket panel to this channel.',
            inline: false
        });

    await interaction.reply({ embeds: [embed] });
}

/**
 * Handle transcript channel setup
 */
async function handleTranscriptSetup(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO
) {
    const channel = interaction.options.getChannel('channel') as TextChannel;
    const guildId = interaction.guildId!;

    // Check if bot can send messages in the channel
    const botPermissions = channel.permissionsFor(interaction.guild!.members.me!);
    if (!botPermissions?.has(['ViewChannel', 'SendMessages', 'EmbedLinks', 'AttachFiles'])) {
        await interaction.reply({
            content: '❌ I don\'t have permission to send messages and files in that channel. Please ensure I have View Channel, Send Messages, Embed Links, and Attach Files permissions.',
            ephemeral: true
        });
        return;
    }

    // Update configuration
    await guildConfigDAO.upsertGuildConfig({ guild_id: guildId, transcript_channel_id: channel.id });

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ Transcript Channel Configured')
        .setDescription(`Ticket transcripts will be logged to ${channel}`)
        .addFields({
            name: 'What happens next?',
            value: 'When tickets are closed, their conversation transcripts will be automatically saved to this channel.',
            inline: false
        });

    await interaction.reply({ embeds: [embed] });
}

/**
 * Handle error log channel setup
 */
async function handleErrorLogSetup(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO
) {
    const channel = interaction.options.getChannel('channel') as TextChannel;
    const guildId = interaction.guildId!;

    // Check if bot can send messages in the channel
    const botPermissions = channel.permissionsFor(interaction.guild!.members.me!);
    if (!botPermissions?.has(['ViewChannel', 'SendMessages', 'EmbedLinks'])) {
        await interaction.reply({
            content: '❌ I don\'t have permission to send messages in that channel. Please ensure I have View Channel, Send Messages, and Embed Links permissions.',
            ephemeral: true
        });
        return;
    }

    // Update configuration
    await guildConfigDAO.upsertGuildConfig({ guild_id: guildId, error_log_channel_id: channel.id });

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ Error Log Channel Configured')
        .setDescription(`Bot errors will be logged to ${channel}`)
        .addFields({
            name: 'What gets logged?',
            value: '• Command errors\n• Ticket system errors\n• Database errors\n• Permission issues',
            inline: false
        });

    await interaction.reply({ embeds: [embed] });
}

/**
 * Handle support role setup
 */
async function handleSupportRoleSetup(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO,
    permissionUtil: PermissionUtil
) {
    const action = interaction.options.getString('action', true);
    const role = interaction.options.getRole('role') as Role | null;
    const guildId = interaction.guildId!;

    const currentConfig = await guildConfigDAO.getGuildConfig(guildId);
    let supportRoleIds: string[] = [];
    
    if (currentConfig?.support_role_ids) {
        supportRoleIds = currentConfig.support_role_ids;
    }

    switch (action) {
        case 'add': {
            if (!role) {
                await interaction.reply({
                    content: '❌ Please specify a role to add.',
                    ephemeral: true
                });
                return;
            }

            // Validate role
            const validation = await permissionUtil.validateSupportRole(role.id, interaction.guild!);
            if (!validation.valid) {
                const embed = new EmbedBuilder()
                    .setColor(0xff0000)
                    .setTitle('❌ Role Validation Failed')
                    .setDescription('The selected role has issues:')
                    .addFields({
                        name: 'Issues Found',
                        value: validation.issues.map(issue => `• ${issue}`).join('\n'),
                        inline: false
                    });

                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
            }

            if (supportRoleIds.includes(role.id)) {
                await interaction.reply({
                    content: '❌ This role is already configured as a support role.',
                    ephemeral: true
                });
                return;
            }

            supportRoleIds.push(role.id);
            await guildConfigDAO.upsertGuildConfig({ 
                guild_id: guildId,
                support_role_ids: supportRoleIds 
            });

            await interaction.reply({
                content: `✅ Added ${role} as a support role.`,
                ephemeral: false
            });
            break;
        }

        case 'remove': {
            if (!role) {
                await interaction.reply({
                    content: '❌ Please specify a role to remove.',
                    ephemeral: true
                });
                return;
            }

            const index = supportRoleIds.indexOf(role.id);
            if (index === -1) {
                await interaction.reply({
                    content: '❌ This role is not configured as a support role.',
                    ephemeral: true
                });
                return;
            }

            supportRoleIds.splice(index, 1);
            await guildConfigDAO.upsertGuildConfig({ 
                guild_id: guildId,
                support_role_ids: supportRoleIds 
            });

            await interaction.reply({
                content: `✅ Removed ${role} from support roles.`,
                ephemeral: false
            });
            break;
        }

        case 'list': {
            if (supportRoleIds.length === 0) {
                await interaction.reply({
                    content: '📋 No support roles configured.',
                    ephemeral: true
                });
                return;
            }

            const roleList = supportRoleIds
                .map(id => `<@&${id}>`)
                .join('\n');

            const listEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('📋 Support Roles')
                .setDescription(roleList)
                .addFields({
                    name: 'Total Roles',
                    value: supportRoleIds.length.toString(),
                    inline: true
                });

            await interaction.reply({ embeds: [listEmbed], ephemeral: true });
            break;
        }

        case 'clear': {
            if (supportRoleIds.length === 0) {
                await interaction.reply({
                    content: '❌ No support roles to clear.',
                    ephemeral: true
                });
                return;
            }

            await guildConfigDAO.upsertGuildConfig({ 
                guild_id: guildId,
                support_role_ids: [] 
            });

            await interaction.reply({
                content: `✅ Cleared all ${supportRoleIds.length} support roles.`,
                ephemeral: false
            });
            break;
        }
    }
}

/**
 * Handle cleanup policies setup
 */
async function handleCleanupSetup(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO
) {
    const ticketDays = interaction.options.getInteger('ticket_days');
    const logDays = interaction.options.getInteger('log_days');
    const guildId = interaction.guildId!;

    if (ticketDays === null && logDays === null) {
        await interaction.reply({
            content: '❌ Please specify at least one cleanup policy.',
            ephemeral: true
        });
        return;
    }

    const updates: { cleanup_tickets_days?: number; cleanup_logs_days?: number } = {};
    const description: string[] = [];

    if (ticketDays !== null) {
        updates.cleanup_tickets_days = ticketDays;
        description.push(`**Tickets:** ${ticketDays === 0 ? 'Never delete' : `Delete after ${ticketDays} days`}`);
    }

    if (logDays !== null) {
        updates.cleanup_logs_days = logDays;
        description.push(`**Logs:** ${logDays === 0 ? 'Never delete' : `Delete after ${logDays} days`}`);
    }

    await guildConfigDAO.upsertGuildConfig({ guild_id: guildId, ...updates });

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ Cleanup Policies Updated')
        .setDescription(description.join('\n'))
        .addFields({
            name: 'Note',
            value: 'Cleanup runs automatically every 24 hours. Set to 0 to disable automatic deletion.',
            inline: false
        });

    await interaction.reply({ embeds: [embed] });
}

/**
 * Handle view configuration
 */
async function handleViewConfig(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO
) {
    const guildId = interaction.guildId!;
    const config = await guildConfigDAO.getGuildConfig(guildId);

    if (!config) {
        await interaction.reply({
            content: '📋 No ticket system configuration found. Use `/setup` commands to configure the system.',
            ephemeral: true
        });
        return;
    }

    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('📋 Ticket System Configuration')
        .setDescription('Current configuration for this server:');

    // Category
    if (config.category_id) {
        embed.addFields({
            name: '📁 Ticket Category',
            value: `<#${config.category_id}>`,
            inline: true
        });
    }

    // Panel Channel
    if (config.panel_channel_id) {
        embed.addFields({
            name: '🎛️ Panel Channel',
            value: `<#${config.panel_channel_id}>`,
            inline: true
        });
    }

    // Transcript Channel
    if (config.transcript_channel_id) {
        embed.addFields({
            name: '📄 Transcript Channel',
            value: `<#${config.transcript_channel_id}>`,
            inline: true
        });
    }

    // Error Log Channel
    if (config.error_log_channel_id) {
        embed.addFields({
            name: '🚨 Error Log Channel',
            value: `<#${config.error_log_channel_id}>`,
            inline: true
        });
    }

    // Support Roles
    if (config.support_role_ids && config.support_role_ids.length > 0) {
        embed.addFields({
            name: '👥 Support Roles',
            value: config.support_role_ids.map(id => `<@&${id}>`).join('\n'),
            inline: false
        });
    }

    // Ticket Counter
    embed.addFields({
        name: '🎫 Ticket Counter',
        value: config.ticket_counter.toString(),
        inline: true
    });

    // Cleanup Policies
    const cleanupInfo: string[] = [];
    if (config.cleanup_tickets_days !== undefined) {
        cleanupInfo.push(`Tickets: ${config.cleanup_tickets_days === 0 ? 'Never' : `${config.cleanup_tickets_days} days`}`);
    }
    if (config.cleanup_logs_days !== undefined) {
        cleanupInfo.push(`Logs: ${config.cleanup_logs_days === 0 ? 'Never' : `${config.cleanup_logs_days} days`}`);
    }
    if (cleanupInfo.length > 0) {
        embed.addFields({
            name: '🧹 Cleanup Policies',
            value: cleanupInfo.join('\n'),
            inline: false
        });
    }

    embed.setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

/**
 * Handle reset configuration
 */
async function handleResetConfig(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO
) {
    const confirm = interaction.options.getBoolean('confirm', true);
    const guildId = interaction.guildId!;

    if (!confirm) {
        await interaction.reply({
            content: '❌ Configuration reset cancelled. Set confirm to true to reset all configuration.',
            ephemeral: true
        });
        return;
    }

    const deleted = await guildConfigDAO.deleteGuildConfig(guildId);

    if (deleted) {
        const embed = new EmbedBuilder()
            .setColor(0xff9900)
            .setTitle('🔄 Configuration Reset')
            .setDescription('All ticket system configuration has been reset.')
            .addFields({
                name: 'What was reset?',
                value: '• Ticket category\n• Panel channel\n• Transcript channel\n• Error log channel\n• Support roles\n• Cleanup policies\n• Ticket counter',
                inline: false
            })
            .addFields({
                name: 'Next Steps',
                value: 'Use `/setup` commands to reconfigure the ticket system.',
                inline: false
            });

        await interaction.reply({ embeds: [embed] });
    } else {
        await interaction.reply({
            content: '❌ No configuration found to reset.',
            ephemeral: true
        });
    }
}