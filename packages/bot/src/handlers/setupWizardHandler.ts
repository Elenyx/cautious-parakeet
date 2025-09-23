import { 
    ButtonInteraction, 
    ChannelSelectMenuInteraction,
    RoleSelectMenuInteraction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
    CategoryChannel,
    TextChannel,
    PermissionFlagsBits,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ChannelSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    MessageFlags,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ContainerBuilder
} from 'discord.js';
import { PostgreSQLGuildConfigDAO } from '../database/PostgreSQLGuildConfigDAO';
import { PermissionUtil } from '../utils/PermissionUtil';
import { 
    showSetupWizard, 
    showCategorySetup, 
    showPanelSetup, 
    showTranscriptSetup, 
    showSupportRolesSetup,
    showAdvancedSetup 
} from '../commands/setup-wizard';

/**
 * Main handler for all setup wizard interactions
 */
export async function handleSetupWizardInteraction(interaction: ButtonInteraction | ChannelSelectMenuInteraction | RoleSelectMenuInteraction | ModalSubmitInteraction | StringSelectMenuInteraction): Promise<boolean> {
    // Check if this is a setup wizard interaction
    if (interaction.isButton() && (interaction.customId.startsWith('setup_') || interaction.customId === 'back_to_wizard' || interaction.customId === 'deploy_panel')) {
        await handleSetupWizardButton(interaction);
        return true;
    }
    
    if (interaction.isChannelSelectMenu() && interaction.customId.startsWith('setup_')) {
        await handleSetupChannelSelect(interaction);
        return true;
    }
    
    if (interaction.isRoleSelectMenu() && (interaction.customId.startsWith('setup_') || interaction.customId === 'support_roles_select')) {
        await handleSetupRoleSelect(interaction);
        return true;
    }
    
    if (interaction.isModalSubmit() && interaction.customId === 'cleanup_modal') {
        await handleCleanupModal(interaction);
        return true;
    }
    
    return false;
}

/**
 * Handle setup wizard button interactions
 */
export async function handleSetupWizardButton(interaction: ButtonInteraction) {
    // Check admin permissions
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({
            content: '❌ You need Administrator permissions to use the setup wizard.',
            ephemeral: true
        });
        return;
    }

    const customId = interaction.customId;

    switch (customId) {
        case 'setup_category':
            await showCategorySetup(interaction);
            break;
        case 'setup_panel':
            await showPanelSetup(interaction);
            break;
        case 'setup_transcript':
            await showTranscriptSetup(interaction);
            break;
        case 'setup_support_roles':
            await showSupportRolesSetup(interaction);
            break;
        case 'setup_advanced':
            await showAdvancedSetup(interaction);
            break;
        case 'setup_error_log':
            await showErrorLogSetup(interaction);
            break;
        case 'setup_cleanup':
            await showCleanupModal(interaction);
            break;
        case 'deploy_panel':
            await handlePanelDeployment(interaction);
            break;
        case 'back_to_wizard':
            await showSetupWizard(interaction);
            break;
        default:
            await interaction.reply({
                content: '❌ Unknown setup action.',
                ephemeral: true
            });
    }
}

/**
 * Handle channel select menu interactions
 */
export async function handleSetupChannelSelect(interaction: ChannelSelectMenuInteraction) {
    // Check admin permissions
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({
            content: '❌ You need Administrator permissions to use the setup wizard.',
            ephemeral: true
        });
        return;
    }

    const guildConfigDAO = new PostgreSQLGuildConfigDAO();
    const guildId = interaction.guildId!;
    const selectedChannel = interaction.channels.first()!;
    const customId = interaction.customId;

    try {
        switch (customId) {
            case 'category_select':
                await handleCategorySelection(interaction, guildConfigDAO, selectedChannel as CategoryChannel, guildId);
                break;
            case 'panel_channel_select':
                await handlePanelChannelSelection(interaction, guildConfigDAO, selectedChannel as TextChannel, guildId);
                break;
            case 'transcript_channel_select':
                await handleTranscriptChannelSelection(interaction, guildConfigDAO, selectedChannel as TextChannel, guildId);
                break;
            case 'error_log_channel_select':
                await handleErrorLogChannelSelection(interaction, guildConfigDAO, selectedChannel as TextChannel, guildId);
                break;
        }
    } catch (error) {
        console.error('Error handling channel selection:', error);
        await interaction.reply({
            content: '❌ An error occurred while updating the configuration.',
            ephemeral: true
        });
    }
}

/**
 * Handle role select menu interactions
 */
export async function handleSetupRoleSelect(interaction: RoleSelectMenuInteraction) {
    // Check admin permissions
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        await interaction.reply({
            content: '❌ You need Administrator permissions to use the setup wizard.',
            ephemeral: true
        });
        return;
    }

    if (interaction.customId === 'support_roles_select') {
        await handleSupportRolesSelection(interaction);
    }
}

/**
 * Handle category selection
 */
async function handleCategorySelection(
    interaction: ChannelSelectMenuInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO,
    category: CategoryChannel,
    guildId: string
) {
    const permissionUtil = PermissionUtil.getInstance();

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

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

/**
 * Handle panel channel selection
 */
async function handlePanelChannelSelection(
    interaction: ChannelSelectMenuInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO,
    channel: TextChannel,
    guildId: string
) {
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
            value: 'Complete the category setup if not done, then deploy the panel!',
            inline: false
        });

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

/**
 * Handle transcript channel selection
 */
async function handleTranscriptChannelSelection(
    interaction: ChannelSelectMenuInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO,
    channel: TextChannel,
    guildId: string
) {
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
    await guildConfigDAO.upsertGuildConfig({ guild_id: guildId, transcript_channel_id: channel.id });

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ Transcript Channel Configured')
        .setDescription(`Transcript channel has been set to ${channel}`)
        .addFields({
            name: 'Info',
            value: 'Ticket transcripts will be logged here when tickets are closed.',
            inline: false
        });

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

/**
 * Handle error log channel selection
 */
async function handleErrorLogChannelSelection(
    interaction: ChannelSelectMenuInteraction,
    guildConfigDAO: PostgreSQLGuildConfigDAO,
    channel: TextChannel,
    guildId: string
) {
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
        .setDescription(`Error log channel has been set to ${channel}`)
        .addFields({
            name: 'Info',
            value: 'Bot errors and important events will be logged here.',
            inline: false
        });

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

/**
 * Handle support roles selection
 */
async function handleSupportRolesSelection(interaction: RoleSelectMenuInteraction) {
    const guildConfigDAO = new PostgreSQLGuildConfigDAO();
    const guildId = interaction.guildId!;
    const selectedRoles = interaction.roles;

    // Update configuration with selected role IDs
    const roleIds = selectedRoles.map(role => role.id);
    await guildConfigDAO.upsertGuildConfig({ guild_id: guildId, support_role_ids: roleIds });

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ Support Roles Configured')
        .setDescription('Support roles have been updated successfully!')
        .addFields({
            name: 'Selected Roles',
            value: selectedRoles.map(role => `• ${role}`).join('\n'),
            inline: false
        })
        .addFields({
            name: 'Permissions',
            value: 'These roles can now manage tickets and access ticket channels.',
            inline: false
        });

    await interaction.reply({ embeds: [embed], ephemeral: true });
}

/**
 * Show error log channel setup
 */
async function showErrorLogSetup(interaction: ButtonInteraction) {
    const components = [
        new ContainerBuilder()
            .setAccentColor(0x5865F2)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**🚨 Configure Error Log Channel**"),
                new TextDisplayBuilder().setContent("Select a channel where bot errors and important events will be logged. This is optional but recommended for monitoring."),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            ),
        new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('error_log_channel_select')
                    .setPlaceholder('Select a text channel...')
                    .addChannelTypes(ChannelType.GuildText)
                    .setMaxValues(1)
            ),
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_to_advanced')
                    .setLabel('← Back to Advanced')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];

    await interaction.update({
        components: components,
        flags: MessageFlags.IsComponentsV2
    });
}

/**
 * Show cleanup configuration modal
 */
async function showCleanupModal(interaction: ButtonInteraction) {
    const modal = new ModalBuilder()
        .setCustomId('cleanup_modal')
        .setTitle('Configure Cleanup Policies');

    const ticketDaysInput = new TextInputBuilder()
        .setCustomId('ticket_days')
        .setLabel('Days to keep closed tickets (0 = never)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('7')
        .setRequired(false)
        .setMaxLength(3);

    const logDaysInput = new TextInputBuilder()
        .setCustomId('log_days')
        .setLabel('Days to keep error logs (0 = never delete)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('30')
        .setRequired(false)
        .setMaxLength(3);

    const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(ticketDaysInput);
    const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(logDaysInput);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
}

/**
 * Handle panel deployment
 */
async function handlePanelDeployment(interaction: ButtonInteraction) {
    const guildConfigDAO = new PostgreSQLGuildConfigDAO();
    const guildId = interaction.guildId!;
    
    // Get configuration
    const config = await guildConfigDAO.getGuildConfig(guildId);
    
    if (!config || !config.category_id || !config.panel_channel_id) {
        await interaction.reply({
            content: '❌ Please complete the category and panel channel setup first.',
            ephemeral: true
        });
        return;
    }

    // Get the panel channel
    const panelChannel = interaction.guild!.channels.cache.get(config.panel_channel_id) as TextChannel;
    
    if (!panelChannel) {
        await interaction.reply({
            content: '❌ The configured panel channel no longer exists. Please reconfigure it.',
            ephemeral: true
        });
        return;
    }

    // Deploy the panel (reuse the existing ticket panel logic)
    try {
        // Import the panel components from the ticket command
        const { deployTicketPanel } = await import('../utils/panelDeployer');
        await deployTicketPanel(panelChannel);

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('🚀 Ticket Panel Deployed Successfully!')
            .setDescription(`The ticket panel has been deployed to ${panelChannel}`)
            .addFields({
                name: 'What\'s Next?',
                value: '• Users can now create tickets using the panel\n• Configure support roles if not done\n• Test the system by creating a ticket\n• Set up advanced features as needed',
                inline: false
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });

    } catch (error) {
        console.error('Error deploying panel:', error);
        await interaction.reply({
            content: '❌ Failed to deploy the ticket panel. Please check my permissions and try again.',
            ephemeral: true
        });
    }
}

/**
 * Handle cleanup modal submission
 */
export async function handleCleanupModal(interaction: ModalSubmitInteraction) {
    const guildConfigDAO = new PostgreSQLGuildConfigDAO();
    const guildId = interaction.guildId!;
    
    const ticketDays = interaction.fields.getTextInputValue('ticket_days');
    const logDays = interaction.fields.getTextInputValue('log_days');
    
    const updates: { cleanup_tickets_days?: number; cleanup_logs_days?: number } = {};
    const description: string[] = [];

    if (ticketDays) {
        const days = parseInt(ticketDays);
        if (!isNaN(days) && days >= 0 && days <= 365) {
            updates.cleanup_tickets_days = days;
            description.push(`**Tickets:** ${days === 0 ? 'Never delete' : `Delete after ${days} days`}`);
        }
    }

    if (logDays) {
        const days = parseInt(logDays);
        if (!isNaN(days) && days >= 0 && days <= 365) {
            updates.cleanup_logs_days = days;
            description.push(`**Logs:** ${days === 0 ? 'Never delete' : `Delete after ${days} days`}`);
        }
    }

    if (Object.keys(updates).length === 0) {
        await interaction.reply({
            content: '❌ Please provide valid cleanup values (0-365 days).',
            ephemeral: true
        });
        return;
    }

    await guildConfigDAO.upsertGuildConfig({ guild_id: guildId, ...updates });

    const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('✅ Cleanup Policies Updated')
        .setDescription(description.join('\n'))
        .addFields({
            name: 'Note',
            value: 'Cleanup runs automatically every 24 hours.',
            inline: false
        });

    await interaction.reply({ embeds: [embed], ephemeral: true });
}