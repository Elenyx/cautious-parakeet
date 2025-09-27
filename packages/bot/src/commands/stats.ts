import { 
    ChatInputCommandInteraction, 
    PermissionFlagsBits,
    EmbedBuilder,
    AttachmentBuilder,
    SlashCommandSubcommandBuilder,
    SlashCommandUserOption
} from 'discord.js';
import { StatsHandler } from '../utils/StatsHandler';
import { PermissionUtil } from '../utils/PermissionUtil';
import { ErrorLogger } from '../utils/ErrorLogger';
import { LocalizedCommandBuilder } from '../utils/LocalizedCommandBuilder.js';
import { LanguageService } from '../utils/LanguageService.js';
// Buffer is available globally in Node.js

/**
 * Stats command to display ticket statistics and analytics
 */
// Create localized command data - will be dynamically updated based on guild language
export const data = new LocalizedCommandBuilder('stats')
    .setLocalizedInfo('en') // Default to English for initial registration
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addLocalizedSubcommand('overview', 'en')
    .addLocalizedSubcommand('detailed', 'en')
    .addLocalizedSubcommand('export', 'en')
    .addLocalizedSubcommand('user', 'en', (subcommand) => {
        return subcommand.addUserOption((option: SlashCommandUserOption) =>
            option
                .setName('user')
                .setDescription('User to view statistics for')
                .setRequired(true)
        );
    })
    .addLocalizedSubcommand('realtime', 'en')
    .build();

export async function execute(interaction: ChatInputCommandInteraction) {
    const errorLogger = ErrorLogger.getInstance();
    const statsHandler = StatsHandler.getInstance();
    const permissionUtil = PermissionUtil.getInstance();
    const languageService = LanguageService.getInstance();

    try {
        // Get the current language for this guild
        const currentLanguage = await languageService.getGuildLanguage(interaction.guildId!);

        // Get the guild member
        const guild = interaction.guild!;
        const member = await guild.members.fetch(interaction.user.id);
        
        // Check if user has permission to view stats
        const hasPermission = await permissionUtil.hasSupportStaffPermissions(member);

        if (!hasPermission) {
            const errorMessage = languageService.getError('supportStaffRequired', currentLanguage);
            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
            return;
        }

        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'overview':
                await handleOverview(interaction, statsHandler);
                break;
            case 'detailed':
                await handleDetailed(interaction, statsHandler);
                break;
            case 'export':
                // Export requires Administrator permissions
                if (!permissionUtil.hasAdminPermissions(member)) {
                    const errorMessage = languageService.getError('adminRequired', currentLanguage);
                    await interaction.reply({
                        content: errorMessage,
                        ephemeral: true
                    });
                    return;
                }
                await handleExport(interaction, statsHandler);
                break;
            case 'user':
                // User stats require Administrator permissions
                if (!permissionUtil.hasAdminPermissions(member)) {
                    const errorMessage = languageService.getError('adminRequired', currentLanguage);
                    await interaction.reply({
                        content: errorMessage,
                        ephemeral: true
                    });
                    return;
                }
                await handleUserStats(interaction, statsHandler);
                break;
            case 'realtime':
                await handleRealtimeStats(interaction, statsHandler);
                break;
            default:
                const unknownSubcommandError = languageService.getError('unknownSubcommand', currentLanguage);
                await interaction.reply({
                    content: unknownSubcommandError,
                    ephemeral: true
                });
        }

    } catch (error) {
        console.error('Error in stats command:', error);
        await errorLogger.logError(error as Error, {
            guildId: interaction.guildId!,
            errorType: 'CommandError',
            additionalContext: {
                userId: interaction.user.id,
                command: 'stats',
                subcommand: interaction.options.getSubcommand()
            }
        });

        const currentLanguage = await languageService.getGuildLanguage(interaction.guildId!);
        const errorMessage = languageService.getError('statsError', currentLanguage);
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

/**
 * Handle overview subcommand
 */
async function handleOverview(
    interaction: ChatInputCommandInteraction,
    statsHandler: StatsHandler
) {
    await interaction.deferReply();

    try {
        const [quickStats, trendingStats] = await Promise.all([
            statsHandler.getQuickStats(interaction.guildId!),
            statsHandler.getTrendingStats(interaction.guildId!, 7)
        ]);
        
        // Format trend indicators
        const formatTrend = (trend: number) => {
            if (trend > 0) return `📈 +${trend}%`;
            if (trend < 0) return `📉 ${trend}%`;
            return `➡️ 0%`;
        };
        
        const embed = new EmbedBuilder()
            .setTitle('📊 Quick Statistics Overview')
            .setColor(0x0099ff)
            .setTimestamp()
            .addFields(
                {
                    name: '🎫 Total Tickets',
                    value: quickStats.totalTickets.toString(),
                    inline: true
                },
                {
                    name: '🔓 Open Tickets',
                    value: quickStats.openTickets.toString(),
                    inline: true
                },
                {
                    name: '✅ Closed Today',
                    value: quickStats.closedToday.toString(),
                    inline: true
                },
                {
                    name: '⏱️ Avg Resolution Time',
                    value: `${quickStats.averageResolutionHours} hours`,
                    inline: true
                },
                {
                    name: '📈 Resolution Rate',
                    value: quickStats.totalTickets > 0 
                        ? `${(((quickStats.totalTickets - quickStats.openTickets) / quickStats.totalTickets) * 100).toFixed(1)}%`
                        : '0%',
                    inline: true
                },
                {
                    name: '🎯 Status',
                    value: quickStats.openTickets === 0 ? '🟢 All Clear' : 
                           quickStats.openTickets < 5 ? '🟡 Normal' : '🔴 High Load',
                    inline: true
                },
                {
                    name: '📊 7-Day Trends',
                    value: [
                        `**Tickets Created:** ${formatTrend(trendingStats.ticketsCreatedTrend)}`,
                        `**Tickets Closed:** ${formatTrend(trendingStats.ticketsClosedTrend)}`,
                        `**Resolution Time:** ${formatTrend(trendingStats.resolutionTimeTrend)}`
                    ].join('\n'),
                    inline: false
                }
            )
            .setFooter({ text: 'Use /stats detailed for more comprehensive statistics' });

        await interaction.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('Error in overview stats:', error);
        await interaction.editReply({
            content: '❌ Failed to retrieve overview statistics.'
        });
    }
}

/**
 * Handle detailed subcommand
 */
async function handleDetailed(
    interaction: ChatInputCommandInteraction,
    statsHandler: StatsHandler
) {
    await interaction.deferReply();

    try {
        const embed = await statsHandler.generateStatsEmbed(
            interaction.guildId!,
            interaction.guild!
        );

        await interaction.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('Error in detailed stats:', error);
        await interaction.editReply({
            content: '❌ Failed to retrieve detailed statistics.'
        });
    }
}

/**
 * Handle export subcommand
 */
async function handleExport(
    interaction: ChatInputCommandInteraction,
    statsHandler: StatsHandler
) {
    await interaction.deferReply({ ephemeral: true });

    try {
        const jsonData = await statsHandler.exportStatistics(
            interaction.guildId!,
            interaction.guild!
        );

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `ticket-stats-${interaction.guild!.name}-${timestamp}.json`;
        
        const attachment = new AttachmentBuilder(
            Buffer.from(jsonData, 'utf-8'),
            { name: filename }
        );

        const embed = new EmbedBuilder()
            .setTitle('📊 Statistics Export')
            .setDescription('Your ticket statistics have been exported to a JSON file.')
            .setColor(0x00ff00)
            .setTimestamp()
            .addFields(
                {
                    name: '📁 File Name',
                    value: filename,
                    inline: true
                },
                {
                    name: '📊 Data Included',
                    value: [
                        '• Overview statistics',
                        '• User activity data',
                        '• Time-based analytics',
                        '• Support staff performance',
                        '• Busy hours and days'
                    ].join('\n'),
                    inline: false
                }
            );

        await interaction.editReply({
            embeds: [embed],
            files: [attachment]
        });

    } catch (error) {
        console.error('Error exporting stats:', error);
        await interaction.editReply({
            content: '❌ Failed to export statistics.'
        });
    }
}

/**
 * Handle user stats subcommand
 */
async function handleUserStats(
    interaction: ChatInputCommandInteraction,
    statsHandler: StatsHandler
) {
    await interaction.deferReply();

    try {
        const targetUser = interaction.options.getUser('user', true);
        const topUsers = await statsHandler.getTopUsers(interaction.guildId!, 100);
        const userStats = topUsers.find(u => u.userId === targetUser.id);

        if (!userStats) {
            await interaction.editReply({
                content: `❌ No ticket activity found for ${targetUser.displayName}.`
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`📊 User Statistics - ${targetUser.displayName}`)
            .setThumbnail(targetUser.displayAvatarURL())
            .setColor(0x0099ff)
            .setTimestamp()
            .addFields(
                {
                    name: '🎫 Tickets Created',
                    value: userStats.ticketsCreated.toString(),
                    inline: true
                },
                {
                    name: '📋 Tickets Assigned',
                    value: userStats.ticketsAssigned.toString(),
                    inline: true
                },
                {
                    name: '✅ Tickets Closed',
                    value: userStats.ticketsClosed.toString(),
                    inline: true
                },
                {
                    name: '⏱️ Average Resolution Time',
                    value: userStats.averageResolutionTime > 0 
                        ? `${userStats.averageResolutionTime.toFixed(1)} hours`
                        : 'N/A',
                    inline: true
                },
                {
                    name: '🕒 Total Resolution Time',
                    value: userStats.totalResolutionTime > 0 
                        ? `${userStats.totalResolutionTime.toFixed(1)} hours`
                        : 'N/A',
                    inline: true
                },
                {
                    name: '📈 Activity Score',
                    value: (userStats.ticketsCreated + userStats.ticketsAssigned + userStats.ticketsClosed).toString(),
                    inline: true
                }
            );

        // Add performance rating
        let performanceRating = '⭐';
        if (userStats.ticketsAssigned > 0) {
            const resolutionRate = userStats.ticketsClosed / userStats.ticketsAssigned;
            if (resolutionRate >= 0.9) performanceRating = '⭐⭐⭐⭐⭐';
            else if (resolutionRate >= 0.7) performanceRating = '⭐⭐⭐⭐';
            else if (resolutionRate >= 0.5) performanceRating = '⭐⭐⭐';
            else if (resolutionRate >= 0.3) performanceRating = '⭐⭐';
        }

        embed.addFields({
            name: '🌟 Performance Rating',
            value: performanceRating,
            inline: true
        });

        await interaction.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('Error in user stats:', error);
        await interaction.editReply({
            content: '❌ Failed to retrieve user statistics.'
        });
    }
}

/**
 * Handle realtime stats subcommand
 */
async function handleRealtimeStats(
    interaction: ChatInputCommandInteraction,
    statsHandler: StatsHandler
) {
    await interaction.deferReply();

    try {
        const quickStats = await statsHandler.getQuickStats(interaction.guildId!);
        
        // Get current time for real-time context
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        
        const embed = new EmbedBuilder()
            .setTitle('⚡ Real-Time Statistics')
            .setColor(0x00ff00)
            .setTimestamp()
            .addFields(
                {
                    name: '🎫 Current Status',
                    value: [
                        `**Open Tickets:** ${quickStats.openTickets}`,
                        `**Closed Today:** ${quickStats.closedToday}`,
                        `**Total Tickets:** ${quickStats.totalTickets}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '⏱️ Performance',
                    value: [
                        `**Avg Resolution:** ${quickStats.averageResolutionHours}h`,
                        `**Current Hour:** ${currentHour}:00`,
                        `**Current Day:** ${currentDay}`
                    ].join('\n'),
                    inline: true
                },
                {
                    name: '📊 Status Indicator',
                    value: quickStats.openTickets === 0 ? '🟢 All Clear - No open tickets' : 
                           quickStats.openTickets < 5 ? '🟡 Normal Load' : 
                           quickStats.openTickets < 10 ? '🟠 High Load' : '🔴 Critical Load',
                    inline: true
                }
            )
            .setFooter({ 
                text: 'Real-time data • Use /stats detailed for comprehensive analytics' 
            });

        await interaction.editReply({ embeds: [embed] });

    } catch (error) {
        console.error('Error in realtime stats:', error);
        await interaction.editReply({
            content: '❌ Failed to retrieve real-time statistics.'
        });
    }
}