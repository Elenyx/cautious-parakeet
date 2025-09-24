import { 
    Guild, 
    GuildMember, 
    PermissionsBitField, 
    TextChannel,
    CategoryChannel,
    ChannelType,
    OverwriteResolvable
} from 'discord.js';
import { GuildConfigDAO } from '../database/GuildConfigDAO';

/**
 * Permission utility for checking and managing Discord permissions
 */
export class PermissionUtil {
    private static instance: PermissionUtil;
    private guildConfigDAO: GuildConfigDAO;

    private constructor() {
        this.guildConfigDAO = new GuildConfigDAO();
    }

    /**
     * Get singleton instance of PermissionUtil
     */
    public static getInstance(): PermissionUtil {
        if (!PermissionUtil.instance) {
            PermissionUtil.instance = new PermissionUtil();
        }
        return PermissionUtil.instance;
    }

    /**
     * Check if a member has administrator permissions
     */
    public hasAdminPermissions(member: GuildMember): boolean {
        return member.permissions.has(PermissionsBitField.Flags.Administrator);
    }

    /**
     * Check if a member has manage channels permissions
     */
    public hasManageChannelsPermissions(member: GuildMember): boolean {
        return member.permissions.has(PermissionsBitField.Flags.ManageChannels) ||
               this.hasAdminPermissions(member);
    }

    /**
     * Check if a member has manage roles permissions
     */
    public hasManageRolesPermissions(member: GuildMember): boolean {
        return member.permissions.has(PermissionsBitField.Flags.ManageRoles) ||
               this.hasAdminPermissions(member);
    }

    /**
     * Check if a member is support staff for the guild
     */
    public async isSupportStaff(member: GuildMember): Promise<boolean> {
        const guildConfig = await this.guildConfigDAO.getGuildConfig(member.guild.id);
        if (!guildConfig?.support_role_ids) return false;

        const supportRoleIds = guildConfig.support_role_ids;
        return member.roles.cache.some(role => supportRoleIds.includes(role.id)) ||
               this.hasAdminPermissions(member);
    }

    /**
     * Check if bot has required permissions in a guild
     */
    public async checkBotPermissions(guild: Guild): Promise<{
        hasRequired: boolean;
        missing: string[];
        warnings: string[];
    }> {
        const botMember = guild.members.me;
        if (!botMember) {
            return {
                hasRequired: false,
                missing: ['Bot not found in guild'],
                warnings: []
            };
        }

        const requiredPermissions = [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageChannels,
            PermissionsBitField.Flags.ManageRoles,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.AttachFiles,
            PermissionsBitField.Flags.EmbedLinks,
            PermissionsBitField.Flags.UseExternalEmojis
        ];

        const recommendedPermissions = [
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.AddReactions,
            PermissionsBitField.Flags.UseApplicationCommands
        ];

        const missing: string[] = [];
        const warnings: string[] = [];

        // Check required permissions
        for (const permission of requiredPermissions) {
            if (!botMember.permissions.has(permission)) {
                missing.push(this.getPermissionName(permission));
            }
        }

        // Check recommended permissions
        for (const permission of recommendedPermissions) {
            if (!botMember.permissions.has(permission)) {
                warnings.push(`Recommended: ${this.getPermissionName(permission)}`);
            }
        }

        return {
            hasRequired: missing.length === 0,
            missing,
            warnings
        };
    }

    /**
     * Check if bot can manage a specific channel
     */
    public canManageChannel(channel: TextChannel | CategoryChannel): boolean {
        const botMember = channel.guild.members.me;
        if (!botMember) return false;

        return channel.permissionsFor(botMember)?.has([
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.ManageChannels,
            PermissionsBitField.Flags.ManageRoles
        ]) ?? false;
    }

    /**
     * Create permission overwrites for a ticket channel
     */
    public createTicketPermissionOverwrites(
        guild: Guild,
        userId: string,
        supportRoleIds: string[] = []
    ): OverwriteResolvable[] {
        const overwrites: OverwriteResolvable[] = [
            // Deny @everyone
            {
                id: guild.roles.everyone.id,
                deny: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory
                ]
            },
            // Allow ticket creator
            {
                id: userId,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                    PermissionsBitField.Flags.AttachFiles,
                    PermissionsBitField.Flags.EmbedLinks,
                    PermissionsBitField.Flags.UseExternalEmojis,
                    PermissionsBitField.Flags.AddReactions
                ]
            }
        ];

        // Add support roles
        for (const roleId of supportRoleIds) {
            overwrites.push({
                id: roleId,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                    PermissionsBitField.Flags.AttachFiles,
                    PermissionsBitField.Flags.EmbedLinks,
                    PermissionsBitField.Flags.UseExternalEmojis,
                    PermissionsBitField.Flags.AddReactions,
                    PermissionsBitField.Flags.ManageMessages,
                    PermissionsBitField.Flags.ManageChannels
                ]
            });
        }

        // Ensure bot has full permissions
        const botMember = guild.members.me;
        if (botMember) {
            overwrites.push({
                id: botMember.id,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                    PermissionsBitField.Flags.AttachFiles,
                    PermissionsBitField.Flags.EmbedLinks,
                    PermissionsBitField.Flags.UseExternalEmojis,
                    PermissionsBitField.Flags.AddReactions,
                    PermissionsBitField.Flags.ManageMessages,
                    PermissionsBitField.Flags.ManageChannels,
                    PermissionsBitField.Flags.ManageRoles
                ]
            });
        }

        return overwrites;
    }

    /**
     * Validate category permissions for ticket creation
     */
    public async validateCategoryPermissions(categoryId: string, guild: Guild): Promise<{
        valid: boolean;
        issues: string[];
    }> {
        try {
            const category = await guild.channels.fetch(categoryId) as CategoryChannel;
            if (!category) {
                return {
                    valid: false,
                    issues: ['Category channel not found']
                };
            }

            if (category.type !== ChannelType.GuildCategory) {
                return {
                    valid: false,
                    issues: ['Channel is not a category']
                };
            }

            const botMember = guild.members.me;
            if (!botMember) {
                return {
                    valid: false,
                    issues: ['Bot member not found']
                };
            }

            const permissions = category.permissionsFor(botMember);
            const issues: string[] = [];

            if (!permissions?.has(PermissionsBitField.Flags.ViewChannel)) {
                issues.push('Bot cannot view the category');
            }

            if (!permissions?.has(PermissionsBitField.Flags.ManageChannels)) {
                issues.push('Bot cannot manage channels in the category');
            }

            if (!permissions?.has(PermissionsBitField.Flags.ManageRoles)) {
                issues.push('Bot cannot manage permissions in the category');
            }

            // Check if category has space for more channels
            const childChannels = category.children.cache.size;
            if (childChannels >= 50) {
                issues.push('Category is at maximum channel limit (50)');
            }

            return {
                valid: issues.length === 0,
                issues
            };

        } catch (error) {
            return {
                valid: false,
                issues: [`Error validating category: ${error}`]
            };
        }
    }

    /**
     * Check if a role exists and bot can assign it
     */
    public async validateSupportRole(roleId: string, guild: Guild): Promise<{
        valid: boolean;
        issues: string[];
    }> {
        try {
            const role = await guild.roles.fetch(roleId);
            if (!role) {
                return {
                    valid: false,
                    issues: ['Role not found']
                };
            }

            const botMember = guild.members.me;
            if (!botMember) {
                return {
                    valid: false,
                    issues: ['Bot member not found']
                };
            }

            const issues: string[] = [];

            // Check if bot's highest role is higher than the support role
            const botHighestRole = botMember.roles.highest;
            if (botHighestRole.position <= role.position) {
                issues.push('Bot role is not higher than support role in hierarchy');
            }

            // Check if role is @everyone
            if (role.id === guild.roles.everyone.id) {
                issues.push('Cannot use @everyone as support role');
            }

            return {
                valid: issues.length === 0,
                issues
            };

        } catch (error) {
            return {
                valid: false,
                issues: [`Error validating role: ${error}`]
            };
        }
    }

    /**
     * Get human-readable permission name
     */
    private getPermissionName(permission: bigint): string {
        const permissionNames: { [key: string]: string } = {
            [PermissionsBitField.Flags.ViewChannel.toString()]: 'View Channel',
            [PermissionsBitField.Flags.SendMessages.toString()]: 'Send Messages',
            [PermissionsBitField.Flags.ManageChannels.toString()]: 'Manage Channels',
            [PermissionsBitField.Flags.ManageRoles.toString()]: 'Manage Roles',
            [PermissionsBitField.Flags.ReadMessageHistory.toString()]: 'Read Message History',
            [PermissionsBitField.Flags.AttachFiles.toString()]: 'Attach Files',
            [PermissionsBitField.Flags.EmbedLinks.toString()]: 'Embed Links',
            [PermissionsBitField.Flags.UseExternalEmojis.toString()]: 'Use External Emojis',
            [PermissionsBitField.Flags.ManageMessages.toString()]: 'Manage Messages',
            [PermissionsBitField.Flags.AddReactions.toString()]: 'Add Reactions',
            [PermissionsBitField.Flags.UseApplicationCommands.toString()]: 'Use Application Commands',
            [PermissionsBitField.Flags.Administrator.toString()]: 'Administrator'
        };

        return permissionNames[permission.toString()] || 'Unknown Permission';
    }

    /**
     * Format permissions list for display
     */
    public formatPermissionsList(permissions: string[]): string {
        if (permissions.length === 0) return 'None';
        return permissions.map(p => `• ${p}`).join('\n');
    }
}