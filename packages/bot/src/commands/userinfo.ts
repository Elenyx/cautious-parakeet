import {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    MessageFlags,
    UserContextMenuCommandInteraction,
    EmbedBuilder,
    PermissionFlagsBits,
    GuildMember
} from 'discord.js';
import { ErrorLogger } from '../utils/ErrorLogger';
import { PermissionUtil } from '../utils/PermissionUtil';

/**
 * User Info context menu command
 * Right-click on a user and select "Apps" and then "User Info"
 * to view detailed information about the user
 */
export const data = new ContextMenuCommandBuilder()
    .setName('User Info')
    .setType(ApplicationCommandType.User)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages);

export async function execute(interaction: UserContextMenuCommandInteraction) {
    const errorLogger = ErrorLogger.getInstance();
    const permissionUtil = PermissionUtil.getInstance();

    try {
        // Check if user has permission to view user info
        const guild = interaction.guild!;
        const member = await guild.members.fetch(interaction.user.id);
        
        const hasPermission = permissionUtil.hasAdminPermissions(member) ||
                             permissionUtil.isSupportStaff(member) ||
                             member.permissions.has(PermissionFlagsBits.ManageMessages);

        if (!hasPermission) {
            await interaction.reply({
                content: '❌ You need Manage Messages permission or support staff role to view user information.',
                ephemeral: true
            });
            return;
        }

        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const targetUser = interaction.targetUser;
        const targetMember = interaction.targetMember as GuildMember | null;

        // Create detailed embed with user information
        const embed = new EmbedBuilder()
            .setTitle(`👤 User Information - ${targetUser.tag}`)
            .setColor(0x0099ff)
            .setTimestamp()
            .setFooter({ 
                text: `User ID: ${targetUser.id} • Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });

        // Basic user information
        embed.addFields(
            {
                name: '🆔 User ID',
                value: targetUser.id,
                inline: true
            },
            {
                name: '📅 Account Created',
                value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>\n<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`,
                inline: true
            },
            {
                name: '🤖 Bot Account',
                value: targetUser.bot ? '✅ Yes' : '❌ No',
                inline: true
            }
        );

        // Display name information
        embed.addFields(
            {
                name: '🏷️ Username',
                value: targetUser.username,
                inline: true
            },
            {
                name: '🌐 Global Name',
                value: targetUser.globalName || '*Not set*',
                inline: true
            },
            {
                name: '📝 Display Name',
                value: targetUser.displayName,
                inline: true
            }
        );

        // Avatar information
        embed.addFields(
            {
                name: '🖼️ Avatar',
                value: `[View Avatar](${targetUser.displayAvatarURL({ size: 4096 })})`,
                inline: true
            },
            {
                name: '🎨 Avatar Type',
                value: targetUser.avatar ? 'Custom' : 'Default',
                inline: true
            }
        );

        // Guild member information (if user is in the guild)
        if (targetMember) {
            const joinDate = targetMember.joinedAt;
            const premiumSince = targetMember.premiumSince;
            const timeoutUntil = targetMember.communicationDisabledUntil;

            embed.addFields(
                {
                    name: '🏠 Server Join Date',
                    value: joinDate ? 
                        `<t:${Math.floor(joinDate.getTime() / 1000)}:F>\n<t:${Math.floor(joinDate.getTime() / 1000)}:R>` : 
                        '*Unknown*',
                    inline: true
                },
                {
                    name: '👑 Server Booster',
                    value: premiumSince ? 
                        `✅ Since <t:${Math.floor(premiumSince.getTime() / 1000)}:F>` : 
                        '❌ No',
                    inline: true
                },
                {
                    name: '🔇 Timeout Status',
                    value: timeoutUntil ? 
                        `⏰ Until <t:${Math.floor(timeoutUntil.getTime() / 1000)}:F>` : 
                        '✅ Not timed out',
                    inline: true
                }
            );

            // Roles information
            const roles = targetMember.roles.cache
                .filter(role => role.id !== guild.id) // Exclude @everyone role
                .sort((a, b) => b.position - a.position);

            if (roles.size > 0) {
                const roleList = roles.map(role => `<@&${role.id}>`).slice(0, 10); // Limit to 10 roles
                const roleText = roleList.join('\n');
                const extraRoles = roles.size > 10 ? `\n*...and ${roles.size - 10} more roles*` : '';
                
                embed.addFields({
                    name: `🎭 Roles (${roles.size})`,
                    value: roleText + extraRoles,
                    inline: false
                });
            }

            // Permissions information
            const keyPermissions = [
                'Administrator',
                'ManageGuild',
                'ManageChannels',
                'ManageMessages',
                'ManageRoles',
                'KickMembers',
                'BanMembers',
                'ManageNicknames',
                'ModerateMembers'
            ];

            const userPermissions = keyPermissions.filter(permission => 
                targetMember.permissions.has(permission as any)
            );

            if (userPermissions.length > 0) {
                embed.addFields({
                    name: '🔑 Key Permissions',
                    value: userPermissions.map(perm => `• ${perm}`).join('\n'),
                    inline: true
                });
            }

            // Activity status
            const activities = targetMember.presence?.activities || [];
            if (activities.length > 0) {
                const activityList = activities.map(activity => {
                    let activityText = `**${activity.name}**`;
                    if (activity.details) activityText += `\n${activity.details}`;
                    if (activity.state) activityText += `\n${activity.state}`;
                    return activityText;
                }).slice(0, 3); // Limit to 3 activities

                embed.addFields({
                    name: '🎮 Activities',
                    value: activityList.join('\n\n'),
                    inline: true
                });
            }

            // Voice channel information
            if (targetMember.voice.channel) {
                embed.addFields({
                    name: '🔊 Voice Channel',
                    value: `${targetMember.voice.channel} (${targetMember.voice.channel.id})`,
                    inline: true
                });
            }

            // Nickname information
            if (targetMember.nickname) {
                embed.addFields({
                    name: '📛 Server Nickname',
                    value: targetMember.nickname,
                    inline: true
                });
            }
        } else {
            // User is not in the guild
            embed.addFields({
                name: '❌ Guild Status',
                value: 'User is not a member of this server',
                inline: false
            });
        }

        // Account age information
        const accountAge = Date.now() - targetUser.createdTimestamp;
        const accountAgeDays = Math.floor(accountAge / (1000 * 60 * 60 * 24));
        const accountAgeYears = Math.floor(accountAgeDays / 365);
        const accountAgeMonths = Math.floor((accountAgeDays % 365) / 30);

        let accountAgeText = '';
        if (accountAgeYears > 0) accountAgeText += `${accountAgeYears} year${accountAgeYears > 1 ? 's' : ''} `;
        if (accountAgeMonths > 0) accountAgeText += `${accountAgeMonths} month${accountAgeMonths > 1 ? 's' : ''} `;
        accountAgeText += `${accountAgeDays % 30} day${(accountAgeDays % 30) !== 1 ? 's' : ''}`;

        embed.addFields({
            name: '⏰ Account Age',
            value: accountAgeText,
            inline: true
        });

        // Badges and flags
        const flags = targetUser.flags?.toArray() || [];
        if (flags.length > 0) {
            const badgeEmojis: { [key: string]: string } = {
                'Staff': '👨‍💼',
                'Partner': '🤝',
                'Hypesquad': '🎉',
                'BugHunterLevel1': '🐛',
                'BugHunterLevel2': '🐛',
                'HypesquadOnlineHouse1': '⚡',
                'HypesquadOnlineHouse2': '💎',
                'HypesquadOnlineHouse3': '🌸',
                'PremiumEarlySupporter': '💎',
                'TeamPseudoUser': '👥',
                'VerifiedBot': '✅',
                'VerifiedDeveloper': '👨‍💻',
                'CertifiedModerator': '🛡️',
                'BotHTTPInteractions': '🤖',
                'ActiveDeveloper': '⚡'
            };

            const badgeList = flags.map(flag => 
                `${badgeEmojis[flag] || '🏆'} ${flag.replace(/([A-Z])/g, ' $1').trim()}`
            );

            embed.addFields({
                name: '🏆 Badges',
                value: badgeList.join('\n'),
                inline: false
            });
        }

        // Set user avatar as thumbnail
        embed.setThumbnail(targetUser.displayAvatarURL({ size: 256 }));

        // Add color based on user status or role
        if (targetMember) {
            const highestRole = targetMember.roles.highest;
            if (highestRole.color !== 0) {
                embed.setColor(highestRole.color);
            }
        }

        await interaction.editReply({
            content: 'Here\'s the detailed user information:',
            embeds: [embed]
        });

    } catch (error) {
        console.error('Error in user info command:', error);
        await errorLogger.logError(error as Error, {
            guildId: interaction.guildId!,
            errorType: 'Context Menu Command Error',
            additionalContext: { 
                command: 'userinfo',
                targetUserId: interaction.targetUser.id,
                userId: interaction.user.id
            }
        });

        const errorMessage = '❌ An error occurred while retrieving user information.';
        
        if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ content: errorMessage });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}
