import { EmbedBuilder, Guild } from 'discord.js';
import { TicketDAO } from '../database/TicketDAO';
import { ErrorLogger } from './ErrorLogger';

/**
 * Interface for ticket statistics
 */
interface TicketStats {
    total: number;
    open: number;
    closed: number;
    cleanedUp: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    averageResolutionTime: number; // in hours
    totalResolutionTime: number; // in hours
}

/**
 * Interface for user statistics
 */
interface UserStats {
    userId: string;
    ticketsCreated: number;
    ticketsAssigned: number;
    ticketsClosed: number;
    averageResolutionTime: number;
    totalResolutionTime: number;
}

/**
 * Interface for time-based statistics
 */
interface TimeBasedStats {
    period: string;
    ticketsCreated: number;
    ticketsClosed: number;
    averageResolutionTime: number;
}

/**
 * Interface for comprehensive guild statistics
 */
interface GuildStatistics {
    guildId: string;
    guildName?: string;
    overview: TicketStats;
    topUsers: UserStats[];
    recentActivity: TimeBasedStats[];
    supportStaffPerformance: UserStats[];
    busyHours: { hour: number; count: number }[];
    busyDays: { day: string; count: number }[];
    generatedAt: Date;
}

/**
 * Handles ticket statistics and analytics
 */
export class StatsHandler {
    private static instance: StatsHandler;
    private ticketDAO: TicketDAO;
    private errorLogger: ErrorLogger;

    private constructor() {
        this.ticketDAO = new TicketDAO();
        this.errorLogger = ErrorLogger.getInstance();
    }

    /**
     * Get singleton instance
     */
    static getInstance(): StatsHandler {
        if (!StatsHandler.instance) {
            StatsHandler.instance = new StatsHandler();
        }
        return StatsHandler.instance;
    }

    /**
     * Get comprehensive statistics for a guild
     */
    async getGuildStatistics(guildId: string, guild?: Guild): Promise<GuildStatistics> {
        try {
            const overview = await this.getTicketOverview(guildId);
            const topUsers = await this.getTopUsers(guildId, 10);
            const recentActivity = await this.getRecentActivity(guildId, 30); // Last 30 days
            const supportStaffPerformance = await this.getSupportStaffPerformance(guildId);
            const busyHours = await this.getBusyHours(guildId);
            const busyDays = await this.getBusyDays(guildId);

            return {
                guildId,
                guildName: guild?.name,
                overview,
                topUsers,
                recentActivity,
                supportStaffPerformance,
                busyHours,
                busyDays,
                generatedAt: new Date()
            };
        } catch (error) {
            console.error(`Error generating guild statistics for ${guildId}:`, error);
            await this.errorLogger.logError(error as Error, {
                guildId,
                additionalContext: { operation: 'generate_statistics' }
            });
            throw error;
        }
    }

    /**
     * Get ticket overview statistics
     */
    async getTicketOverview(guildId: string): Promise<TicketStats> {
        const tickets = await this.ticketDAO.getGuildTickets(guildId);
        
        const stats: TicketStats = {
            total: tickets.length,
            open: 0,
            closed: 0,
            cleanedUp: 0,
            byType: {},
            byStatus: {},
            averageResolutionTime: 0,
            totalResolutionTime: 0
        };

        let totalResolutionTimeMs = 0;
        let resolvedTicketsCount = 0;

        for (const ticket of tickets) {
            // Count by status
            stats.byStatus[ticket.status] = (stats.byStatus[ticket.status] || 0) + 1;
            
            switch (ticket.status) {
                case 'open':
                    stats.open++;
                    break;
                case 'closed':
                    stats.closed++;
                    break;
                case 'archived':
                    stats.cleanedUp++;
                    break;
            }

            // Count by type
            stats.byType[ticket.ticket_type] = (stats.byType[ticket.ticket_type] || 0) + 1;

            // Calculate resolution time for closed tickets
            if (ticket.status === 'closed' && ticket.closed_at && ticket.created_at) {
                const createdTime = new Date(ticket.created_at).getTime();
                const closedTime = new Date(ticket.closed_at).getTime();
                const resolutionTimeMs = closedTime - createdTime;
                
                totalResolutionTimeMs += resolutionTimeMs;
                resolvedTicketsCount++;
            }
        }

        // Calculate average resolution time in hours
        if (resolvedTicketsCount > 0) {
            stats.totalResolutionTime = totalResolutionTimeMs / (1000 * 60 * 60); // Convert to hours
            stats.averageResolutionTime = stats.totalResolutionTime / resolvedTicketsCount;
        }

        return stats;
    }

    /**
     * Get top users by ticket activity
     */
    async getTopUsers(guildId: string, limit: number = 10): Promise<UserStats[]> {
        const userStatsMap = new Map<string, UserStats>();

        // Get all tickets for the guild
        const tickets = await this.ticketDAO.getGuildTickets(guildId);

        for (const ticket of tickets) {
            // Track ticket creators
            if (!userStatsMap.has(ticket.user_id)) {
                userStatsMap.set(ticket.user_id, {
                    userId: ticket.user_id,
                    ticketsCreated: 0,
                    ticketsAssigned: 0,
                    ticketsClosed: 0,
                    averageResolutionTime: 0,
                    totalResolutionTime: 0
                });
            }

            const creatorStats = userStatsMap.get(ticket.user_id)!;
            creatorStats.ticketsCreated++;

            // Track assigned users
            if (ticket.assigned_to) {
                if (!userStatsMap.has(ticket.assigned_to)) {
                    userStatsMap.set(ticket.assigned_to, {
                        userId: ticket.assigned_to,
                        ticketsCreated: 0,
                        ticketsAssigned: 0,
                        ticketsClosed: 0,
                        averageResolutionTime: 0,
                        totalResolutionTime: 0
                    });
                }

                const assignedStats = userStatsMap.get(ticket.assigned_to)!;
                assignedStats.ticketsAssigned++;

                // Calculate resolution time for assigned tickets
                if (ticket.status === 'closed' && ticket.closed_at && ticket.created_at) {
                    const createdTime = new Date(ticket.created_at).getTime();
                    const closedTime = new Date(ticket.closed_at).getTime();
                    const resolutionTimeHours = (closedTime - createdTime) / (1000 * 60 * 60);
                    
                    assignedStats.totalResolutionTime += resolutionTimeHours;
                    assignedStats.ticketsClosed++;
                    assignedStats.averageResolutionTime = assignedStats.totalResolutionTime / assignedStats.ticketsClosed;
                }
            }
        }

        // Convert to array and sort by total activity
        return Array.from(userStatsMap.values())
            .sort((a, b) => {
                const aTotal = a.ticketsCreated + a.ticketsAssigned + a.ticketsClosed;
                const bTotal = b.ticketsCreated + b.ticketsAssigned + b.ticketsClosed;
                return bTotal - aTotal;
            })
            .slice(0, limit);
    }

    /**
     * Get recent activity statistics
     */
    async getRecentActivity(guildId: string, days: number = 30): Promise<TimeBasedStats[]> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const tickets = await this.ticketDAO.getTicketsByDateRange(guildId, startDate, endDate);
        const dailyStats = new Map<string, TimeBasedStats>();

        // Initialize all days in the range
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateKey = d.toISOString().split('T')[0];
            dailyStats.set(dateKey, {
                period: dateKey,
                ticketsCreated: 0,
                ticketsClosed: 0,
                averageResolutionTime: 0
            });
        }

        // Process tickets
        for (const ticket of tickets) {
            if (ticket.created_at) {
                const createdDate = new Date(ticket.created_at).toISOString().split('T')[0];
                const dayStats = dailyStats.get(createdDate);
                if (dayStats) {
                    dayStats.ticketsCreated++;
                }
            }

            if (ticket.closed_at) {
                const closedDate = new Date(ticket.closed_at).toISOString().split('T')[0];
                const dayStats = dailyStats.get(closedDate);
                if (dayStats) {
                    dayStats.ticketsClosed++;
                }
            }
        }

        return Array.from(dailyStats.values()).sort((a, b) => a.period.localeCompare(b.period));
    }

    /**
     * Get support staff performance statistics
     */
    async getSupportStaffPerformance(guildId: string): Promise<UserStats[]> {
        const tickets = await this.ticketDAO.getGuildTickets(guildId);
        const staffStatsMap = new Map<string, UserStats>();

        for (const ticket of tickets) {
            if (ticket.assigned_to) {
                if (!staffStatsMap.has(ticket.assigned_to)) {
                    staffStatsMap.set(ticket.assigned_to, {
                        userId: ticket.assigned_to,
                        ticketsCreated: 0,
                        ticketsAssigned: 0,
                        ticketsClosed: 0,
                        averageResolutionTime: 0,
                        totalResolutionTime: 0
                    });
                }

                const staffStats = staffStatsMap.get(ticket.assigned_to)!;
                staffStats.ticketsAssigned++;

                if (ticket.status === 'closed' && ticket.closed_at && ticket.created_at) {
                    const createdTime = new Date(ticket.created_at).getTime();
                    const closedTime = new Date(ticket.closed_at).getTime();
                    const resolutionTimeHours = (closedTime - createdTime) / (1000 * 60 * 60);
                    
                    staffStats.totalResolutionTime += resolutionTimeHours;
                    staffStats.ticketsClosed++;
                    staffStats.averageResolutionTime = staffStats.totalResolutionTime / staffStats.ticketsClosed;
                }
            }
        }

        return Array.from(staffStatsMap.values())
            .sort((a, b) => b.ticketsAssigned - a.ticketsAssigned);
    }

    /**
     * Get busy hours statistics
     */
    async getBusyHours(guildId: string): Promise<{ hour: number; count: number }[]> {
        const tickets = await this.ticketDAO.getGuildTickets(guildId);
        const hourCounts = new Array(24).fill(0);

        for (const ticket of tickets) {
            if (ticket.created_at) {
                const hour = new Date(ticket.created_at).getHours();
                hourCounts[hour]++;
            }
        }

        return hourCounts.map((count, hour) => ({ hour, count }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Get busy days statistics
     */
    async getBusyDays(guildId: string): Promise<{ day: string; count: number }[]> {
        const tickets = await this.ticketDAO.getGuildTickets(guildId);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts = new Array(7).fill(0);

        for (const ticket of tickets) {
            if (ticket.created_at) {
                const dayOfWeek = new Date(ticket.created_at).getDay();
                dayCounts[dayOfWeek]++;
            }
        }

        return dayCounts.map((count, index) => ({ day: dayNames[index], count }))
            .sort((a, b) => b.count - a.count);
    }

    /**
     * Generate statistics embed for Discord
     */
    async generateStatsEmbed(guildId: string, guild?: Guild): Promise<EmbedBuilder> {
        try {
            const stats = await this.getGuildStatistics(guildId, guild);
            const { overview, topUsers, busyHours, busyDays } = stats;

            const embed = new EmbedBuilder()
                .setTitle(`📊 Ticket Statistics - ${stats.guildName || 'Unknown Guild'}`)
                .setColor(0x0099ff)
                .setTimestamp(stats.generatedAt);

            // Overview section
            embed.addFields({
                name: '📈 Overview',
                value: [
                    `**Total Tickets:** ${overview.total}`,
                    `**Open:** ${overview.open} | **Closed:** ${overview.closed}`,
                    `**Average Resolution:** ${overview.averageResolutionTime.toFixed(1)} hours`,
                    `**Most Common Type:** ${this.getMostCommonType(overview.byType)}`
                ].join('\n'),
                inline: true
            });

            // Top ticket types
            const topTypes = Object.entries(overview.byType)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([type, count]) => `**${type}:** ${count}`)
                .join('\n') || 'No data';

            embed.addFields({
                name: '🎫 Top Ticket Types',
                value: topTypes,
                inline: true
            });

            // Top users
            const topUsersText = topUsers.slice(0, 3)
                .map((user, index) => {
                    const total = user.ticketsCreated + user.ticketsAssigned;
                    return `${index + 1}. <@${user.userId}> (${total} tickets)`;
                })
                .join('\n') || 'No data';

            embed.addFields({
                name: '👥 Most Active Users',
                value: topUsersText,
                inline: true
            });

            // Busiest hours
            const busiestHours = busyHours.slice(0, 3)
                .map(({ hour, count }) => `**${hour}:00:** ${count} tickets`)
                .join('\n') || 'No data';

            embed.addFields({
                name: '⏰ Busiest Hours',
                value: busiestHours,
                inline: true
            });

            // Busiest days
            const busiestDays = busyDays.slice(0, 3)
                .map(({ day, count }) => `**${day}:** ${count} tickets`)
                .join('\n') || 'No data';

            embed.addFields({
                name: '📅 Busiest Days',
                value: busiestDays,
                inline: true
            });

            // Recent activity summary
            const recentTickets = stats.recentActivity.reduce((sum, day) => sum + day.ticketsCreated, 0);
            const recentClosed = stats.recentActivity.reduce((sum, day) => sum + day.ticketsClosed, 0);

            embed.addFields({
                name: '📊 Last 30 Days',
                value: [
                    `**Created:** ${recentTickets}`,
                    `**Closed:** ${recentClosed}`,
                    `**Resolution Rate:** ${recentTickets > 0 ? ((recentClosed / recentTickets) * 100).toFixed(1) : 0}%`
                ].join('\n'),
                inline: true
            });

            return embed;

        } catch (error) {
            console.error('Error generating stats embed:', error);
            throw error;
        }
    }

    /**
     * Get the most common ticket type
     */
    private getMostCommonType(byType: Record<string, number>): string {
        const entries = Object.entries(byType);
        if (entries.length === 0) return 'None';
        
        const [type, count] = entries.reduce((max, current) => 
            current[1] > max[1] ? current : max
        );
        
        return `${type} (${count})`;
    }

    /**
     * Export statistics to JSON
     */
    async exportStatistics(guildId: string, guild?: Guild): Promise<string> {
        const stats = await this.getGuildStatistics(guildId, guild);
        return JSON.stringify(stats, null, 2);
    }

    /**
     * Get quick stats for dashboard
     */
    async getQuickStats(guildId: string): Promise<{
        totalTickets: number;
        openTickets: number;
        closedToday: number;
        averageResolutionHours: number;
    }> {
        const overview = await this.getTicketOverview(guildId);
        
        // Get tickets closed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayTickets = await this.ticketDAO.getTicketsByDateRange(guildId, today, tomorrow);
        const closedToday = todayTickets.filter(t => t.status === 'closed').length;

        return {
            totalTickets: overview.total,
            openTickets: overview.open,
            closedToday,
            averageResolutionHours: Math.round(overview.averageResolutionTime * 10) / 10
        };
    }
}