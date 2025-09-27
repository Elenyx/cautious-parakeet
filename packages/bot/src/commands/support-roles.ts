import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Role
} from 'discord.js';
import { GuildConfigDAO } from '../database/GuildConfigDAO';
import { PermissionUtil } from '../utils/PermissionUtil';
import { ErrorLogger } from '../utils/ErrorLogger';

/**
 * Support roles management command for administrators
 */
export const data = new SlashCommandBuilder()
    .setName('support-roles')
    .setDescription('Manage support staff roles for the ticket system (Administrator only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('List all configured support staff roles')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('add')
            .setDescription('Add a role as support staff')
            .addRoleOption(option =>
                option
                    .setName('role')
                    .setDescription('The role to add as support staff')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('remove')
            .setDescription('Remove a role from support staff')
            .addRoleOption(option =>
                option
                    .setName('role')
                    .setDescription('The role to remove from support staff')
                    .setRequired(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('clear')
            .setDescription('Remove all support staff roles')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('members')
            .setDescription('List all members with support staff roles')
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const errorLogger = ErrorLogger.getInstance();
    const permissionUtil = PermissionUtil.getInstance();
    const guildConfigDAO = new GuildConfigDAO();

    try {
        // Check if user has admin permissions
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({
                content: '❌ You need Administrator permissions to manage support roles.',
                ephemeral: true
            });
            return;
        }

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'list':
                await handleList(interaction, guildConfigDAO);
                break;
            case 'add':
                await handleAdd(interaction, guildConfigDAO, permissionUtil);
                break;
            case 'remove':
                await handleRemove(interaction, guildConfigDAO);
                break;
            case 'clear':
                await handleClear(interaction, guildConfigDAO);
                break;
            case 'members':
                await handleMembers(interaction, permissionUtil);
                break;
            default:
                await interaction.reply({
                    content: '❌ Unknown subcommand.',
                    ephemeral: true
                });
        }

    } catch (error) {
        console.error('Error in support-roles command:', error);
        await errorLogger.logCommandError(error as Error, {
            guildId: interaction.guildId || undefined,
            userId: interaction.user.id,
            commandName: 'support-roles'
        });

        const errorMessage = '❌ An error occurred while managing support roles.';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

/**
 * List all configured support staff roles
 */
async function handleList(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: GuildConfigDAO
) {
    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guildId!;
    const config = await guildConfigDAO.getGuildConfig(guildId);

    const embed = new EmbedBuilder()
        .setTitle('🛠️ Support Staff Roles')
        .setColor(0x0099ff)
        .setTimestamp();

    if (!config?.support_role_ids || config.support_role_ids.length === 0) {
        embed.setDescription('❌ **No support staff roles configured**\n\nUse `/support-roles add` to add support staff roles.');
    } else {
        const roles = config.support_role_ids.map(roleId => `<@&${roleId}>`).join('\n');
        embed.setDescription(`✅ **${config.support_role_ids.length} support staff role(s) configured:**\n\n${roles}`);
        
        embed.addFields({
            name: '📋 Available Commands',
            value: [
                '• `/support-roles add <role>` - Add a support role',
                '• `/support-roles remove <role>` - Remove a support role',
                '• `/support-roles clear` - Remove all support roles',
                '• `/support-roles members` - List support staff members'
            ].join('\n'),
            inline: false
        });
    }

    await interaction.editReply({ embeds: [embed] });
}

/**
 * Add a role as support staff
 */
async function handleAdd(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: GuildConfigDAO,
    permissionUtil: PermissionUtil
) {
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.options.getRole('role', true) as Role;
    const guildId = interaction.guildId!;

    // Validate the role
    const validation = await permissionUtil.validateSupportRole(role.id, interaction.guild!);
    if (!validation.valid) {
        await interaction.editReply({
            content: `❌ **Cannot add role ${role.name}:**\n\n${validation.issues.map(issue => `• ${issue}`).join('\n')}`
        });
        return;
    }

    // Check if role is already a support role
    const isAlreadySupport = await permissionUtil.isSupportRole(role.id, guildId);
    if (isAlreadySupport) {
        await interaction.editReply({
            content: `❌ **${role.name} is already configured as a support staff role.**`
        });
        return;
    }

    // Add the role
    const config = await guildConfigDAO.getGuildConfig(guildId);
    const currentRoles = config?.support_role_ids || [];
    const updatedRoles = [...currentRoles, role.id];

    await guildConfigDAO.updateGuildConfig(guildId, {
        support_role_ids: updatedRoles
    });

    const embed = new EmbedBuilder()
        .setTitle('✅ Support Role Added')
        .setDescription(`**${role.name}** has been added as a support staff role.`)
        .setColor(0x00ff00)
        .setTimestamp()
        .addFields({
            name: '🎯 What this means:',
            value: [
                '• Members with this role can view ticket statistics',
                '• They can access ticket channels',
                '• They can use support staff commands',
                '• They can view user and message information'
            ].join('\n'),
            inline: false
        });

    await interaction.editReply({ embeds: [embed] });
}

/**
 * Remove a role from support staff
 */
async function handleRemove(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: GuildConfigDAO
) {
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.options.getRole('role', true) as Role;
    const guildId = interaction.guildId!;

    // Check if role is currently a support role
    const config = await guildConfigDAO.getGuildConfig(guildId);
    if (!config?.support_role_ids || !config.support_role_ids.includes(role.id)) {
        await interaction.editReply({
            content: `❌ **${role.name} is not currently configured as a support staff role.**`
        });
        return;
    }

    // Remove the role
    const updatedRoles = config.support_role_ids.filter(id => id !== role.id);
    await guildConfigDAO.updateGuildConfig(guildId, {
        support_role_ids: updatedRoles
    });

    const embed = new EmbedBuilder()
        .setTitle('❌ Support Role Removed')
        .setDescription(`**${role.name}** has been removed from support staff roles.`)
        .setColor(0xff0000)
        .setTimestamp()
        .addFields({
            name: '📊 Remaining Support Roles',
            value: updatedRoles.length > 0 
                ? updatedRoles.map(roleId => `<@&${roleId}>`).join('\n')
                : 'None',
            inline: false
        });

    await interaction.editReply({ embeds: [embed] });
}

/**
 * Clear all support staff roles
 */
async function handleClear(
    interaction: ChatInputCommandInteraction,
    guildConfigDAO: GuildConfigDAO
) {
    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guildId!;
    const config = await guildConfigDAO.getGuildConfig(guildId);

    if (!config?.support_role_ids || config.support_role_ids.length === 0) {
        await interaction.editReply({
            content: '❌ **No support staff roles are currently configured.**'
        });
        return;
    }

    // Create confirmation buttons
    const confirmButton = new ButtonBuilder()
        .setCustomId('confirm_clear_support_roles')
        .setLabel('Yes, Clear All')
        .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
        .setCustomId('cancel_clear_support_roles')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(confirmButton, cancelButton);

    const embed = new EmbedBuilder()
        .setTitle('⚠️ Clear All Support Roles')
        .setDescription(`Are you sure you want to remove **all ${config.support_role_ids.length} support staff roles**?\n\nThis action cannot be undone.`)
        .setColor(0xffaa00)
        .setTimestamp()
        .addFields({
            name: '📋 Current Support Roles',
            value: config.support_role_ids.map(roleId => `<@&${roleId}>`).join('\n'),
            inline: false
        });

    await interaction.editReply({ 
        embeds: [embed], 
        components: [row] 
    });
}

/**
 * List all members with support staff roles
 */
async function handleMembers(
    interaction: ChatInputCommandInteraction,
    permissionUtil: PermissionUtil
) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild!;
    const supportStaffMembers = await permissionUtil.getSupportStaffMembers(guild);

    const embed = new EmbedBuilder()
        .setTitle('👥 Support Staff Members')
        .setColor(0x0099ff)
        .setTimestamp();

    if (supportStaffMembers.length === 0) {
        embed.setDescription('❌ **No support staff members found.**\n\nMake sure support roles are configured and assigned to members.');
    } else {
        const memberList = supportStaffMembers
            .map(member => `• ${member.user.tag} (${member.user.id})`)
            .join('\n');

        embed.setDescription(`✅ **${supportStaffMembers.length} support staff member(s) found:**\n\n${memberList}`);
        
        embed.addFields({
            name: '📊 Summary',
            value: [
                `• Total members: ${supportStaffMembers.length}`,
                `• Administrators: ${supportStaffMembers.filter(m => m.permissions.has(PermissionFlagsBits.Administrator)).length}`,
                `• Support staff only: ${supportStaffMembers.filter(m => !m.permissions.has(PermissionFlagsBits.Administrator)).length}`
            ].join('\n'),
            inline: false
        });
    }

    await interaction.editReply({ embeds: [embed] });
}
