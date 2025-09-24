import { Client } from 'discord.js';
import { GuildConfigDAO } from '../database/GuildConfigDAO';
import { TicketDAO } from '../database/TicketDAO';
import { ErrorLogger } from './ErrorLogger';
import { TranscriptUtil } from './TranscriptUtil';

/**
 * Interface for cleanup policy configuration
 */
interface CleanupPolicy {
    enabled: boolean;
    maxAge: number; // in days
    batchSize: number;
    preserveTranscripts: boolean;
}

/**
 * Interface for cleanup statistics
 */
interface CleanupStats {
    ticketsProcessed: number;
    channelsDeleted: number;
    logsDeleted: number;
    errorsEncountered: number;
    transcriptsGenerated: number;
}

/**
 * Handles automatic cleanup of old tickets, logs, and close requests
 */
export class CleanupHandler {
    private static instance: CleanupHandler;
    private guildConfigDAO: GuildConfigDAO;
    private ticketDAO: TicketDAO;
    private errorLogger: ErrorLogger;
    private transcriptUtil: TranscriptUtil;
    private cleanupInterval: ReturnType<typeof setInterval> | null = null;

    private constructor() {
        this.guildConfigDAO = new GuildConfigDAO();
        this.ticketDAO = new TicketDAO();
        this.errorLogger = ErrorLogger.getInstance();
        this.transcriptUtil = TranscriptUtil.getInstance();
    }

    /**
     * Get singleton instance
     */
    static getInstance(): CleanupHandler {
        if (!CleanupHandler.instance) {
            CleanupHandler.instance = new CleanupHandler();
        }
        return CleanupHandler.instance;
    }

    /**
     * Start automatic cleanup with specified interval
     */
    startAutomaticCleanup(intervalHours: number = 24): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }

        const intervalMs = intervalHours * 60 * 60 * 1000;
        this.cleanupInterval = setInterval(() => {
            this.runGlobalCleanup();
        }, intervalMs);

        console.log(`Automatic cleanup started with ${intervalHours} hour interval`);
    }

    /**
     * Stop automatic cleanup
     */
    stopAutomaticCleanup(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
            console.log('Automatic cleanup stopped');
        }
    }

    /**
     * Run cleanup for all guilds
     */
    async runGlobalCleanup(): Promise<void> {
        try {
            console.log('Starting global cleanup...');
            const guilds = await this.guildConfigDAO.getAllGuildConfigs();
            
            for (const guildConfig of guilds) {
                if (guildConfig.cleanup_enabled) {
                    await this.runGuildCleanup(guildConfig.guild_id);
                }
            }
            
            console.log('Global cleanup completed');
        } catch (error) {
            console.error('Error during global cleanup:', error);
            await this.errorLogger.logError(error as Error, {
                guildId: 'global',
                errorType: 'cleanup_error',
                additionalContext: { operation: 'global_cleanup' }
            });
        }
    }

    /**
     * Run cleanup for a specific guild
     */
    async runGuildCleanup(guildId: string, client?: Client): Promise<CleanupStats> {
        const stats: CleanupStats = {
            ticketsProcessed: 0,
            channelsDeleted: 0,
            logsDeleted: 0,
            errorsEncountered: 0,
            transcriptsGenerated: 0
        };

        try {
            const guildConfig = await this.guildConfigDAO.getGuildConfig(guildId);
            if (!guildConfig || !guildConfig.cleanup_enabled) {
                return stats;
            }

            console.log(`Starting cleanup for guild ${guildId}`);

            // Parse cleanup policies
            const ticketPolicy = this.parseCleanupPolicy(guildConfig.cleanup_tickets_days ?? null);
            const logPolicy = this.parseCleanupPolicy(guildConfig.cleanup_logs_days ?? null);

            // Clean up old tickets
            if (ticketPolicy.enabled && client) {
                const ticketStats = await this.cleanupOldTickets(guildId, ticketPolicy, client);
                stats.ticketsProcessed += ticketStats.ticketsProcessed;
                stats.channelsDeleted += ticketStats.channelsDeleted;
                stats.transcriptsGenerated += ticketStats.transcriptsGenerated;
                stats.errorsEncountered += ticketStats.errorsEncountered;
            }

            // Clean up old logs
            if (logPolicy.enabled) {
                const logStats = await this.cleanupOldLogs(guildId, logPolicy);
                stats.logsDeleted += logStats.logsDeleted;
                stats.errorsEncountered += logStats.errorsEncountered;
            }

            console.log(`Cleanup completed for guild ${guildId}:`, stats);
            return stats;

        } catch (error) {
            console.error(`Error during guild cleanup for ${guildId}:`, error);
            await this.errorLogger.logError(error as Error, {
                guildId,
                errorType: 'cleanup_error',
                additionalContext: { operation: 'guild_cleanup' }
            });
            stats.errorsEncountered++;
            return stats;
        }
    }

    /**
     * Clean up old tickets
     */
    private async cleanupOldTickets(
        guildId: string, 
        policy: CleanupPolicy, 
        client: Client
    ): Promise<CleanupStats> {
        const stats: CleanupStats = {
            ticketsProcessed: 0,
            channelsDeleted: 0,
            logsDeleted: 0,
            errorsEncountered: 0,
            transcriptsGenerated: 0
        };

        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - policy.maxAge);

            // Get old closed tickets
            const oldTickets = await this.ticketDAO.getOldClosedTickets(guildId, cutoffDate, policy.batchSize);

            for (const ticket of oldTickets) {
                try {
                    stats.ticketsProcessed++;

                    // Generate transcript if required and not already generated
                    if (policy.preserveTranscripts && !ticket.transcript_url) {
                        const transcriptGenerated = await this.transcriptUtil.generateTranscript(ticket.id!);
                        if (transcriptGenerated) {
                            stats.transcriptsGenerated++;
                        }
                    }

                    // Try to delete the Discord channel if it still exists
                    try {
                        const guild = await client.guilds.fetch(guildId);
                        const channel = await guild.channels.fetch(ticket.channel_id);
                        
                        if (channel) {
                            await channel.delete('Automatic cleanup - ticket expired');
                            stats.channelsDeleted++;
                        }
                    } catch (channelError) {
                        // Channel might already be deleted, which is fine
                        console.log(`Channel ${ticket.channel_id} not found or already deleted`);
                    }

                    // Mark ticket as cleaned up in database
                    await this.ticketDAO.updateTicket(ticket.id!, { 
                        status: 'archived'
                    });

                } catch (ticketError) {
                    console.error(`Error cleaning up ticket ${ticket.id}:`, ticketError);
                    stats.errorsEncountered++;
                    
                    await this.errorLogger.logTicketError(ticketError as Error, {
                        guildId,
                        ticketId: ticket.id,
                        action: 'cleanup_ticket'
                    });
                }
            }

        } catch (error) {
            console.error('Error in cleanupOldTickets:', error);
            stats.errorsEncountered++;
            throw error;
        }

        return stats;
    }

    /**
     * Clean up old error logs
     */
    private async cleanupOldLogs(guildId: string, policy: CleanupPolicy): Promise<CleanupStats> {
        const stats: CleanupStats = {
            ticketsProcessed: 0,
            channelsDeleted: 0,
            logsDeleted: 0,
            errorsEncountered: 0,
            transcriptsGenerated: 0
        };

        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - policy.maxAge);

            // Clean up old error logs (method not implemented yet)
            // TODO: Implement cleanupOldLogs method in ErrorLogger
            stats.logsDeleted = 0;

            // Clean up old ticket messages
            const deletedMessages = await this.ticketDAO.cleanupOldMessages(guildId, cutoffDate, policy.batchSize);
            stats.logsDeleted += deletedMessages;

        } catch (error) {
            console.error('Error in cleanupOldLogs:', error);
            stats.errorsEncountered++;
            throw error;
        }

        return stats;
    }

    /**
     * Parse cleanup policy from configuration
     */
    private parseCleanupPolicy(configValue: number | null): CleanupPolicy {
        const defaultPolicy: CleanupPolicy = {
            enabled: false,
            maxAge: 30,
            batchSize: 50,
            preserveTranscripts: true
        };

        if (!configValue || configValue <= 0) {
            return defaultPolicy;
        }

        return {
            enabled: true,
            maxAge: configValue,
            batchSize: 50,
            preserveTranscripts: true
        };
    }

    /**
     * Manual cleanup for a specific guild (admin command)
     */
    async manualCleanup(guildId: string, client: Client, options?: {
        ticketDays?: number;
        logDays?: number;
        preserveTranscripts?: boolean;
        dryRun?: boolean;
    }): Promise<CleanupStats> {
        const stats: CleanupStats = {
            ticketsProcessed: 0,
            channelsDeleted: 0,
            logsDeleted: 0,
            errorsEncountered: 0,
            transcriptsGenerated: 0
        };

        try {
            console.log(`Starting manual cleanup for guild ${guildId}`, options);

            if (options?.ticketDays && options.ticketDays > 0) {
                const ticketPolicy: CleanupPolicy = {
                    enabled: true,
                    maxAge: options.ticketDays,
                    batchSize: 100,
                    preserveTranscripts: options?.preserveTranscripts ?? true
                };

                if (options?.dryRun) {
                    // Dry run - just count what would be cleaned
                    const cutoffDate = new Date();
                    cutoffDate.setDate(cutoffDate.getDate() - ticketPolicy.maxAge);
                    const oldTickets = await this.ticketDAO.getOldClosedTickets(guildId, cutoffDate, 1000);
                    stats.ticketsProcessed = oldTickets.length;
                } else {
                    const ticketStats = await this.cleanupOldTickets(guildId, ticketPolicy, client);
                    Object.assign(stats, ticketStats);
                }
            }

            if (options?.logDays && options.logDays > 0) {
                const logPolicy: CleanupPolicy = {
                    enabled: true,
                    maxAge: options.logDays,
                    batchSize: 100,
                    preserveTranscripts: false
                };

                if (!options?.dryRun) {
                    const logStats = await this.cleanupOldLogs(guildId, logPolicy);
                    stats.logsDeleted += logStats.logsDeleted;
                    stats.errorsEncountered += logStats.errorsEncountered;
                }
            }

            console.log(`Manual cleanup completed for guild ${guildId}:`, stats);
            return stats;

        } catch (error) {
            console.error(`Error during manual cleanup for ${guildId}:`, error);
            await this.errorLogger.logError(error as Error, {
                guildId,
                additionalContext: { operation: 'manual_cleanup' }
            });
            stats.errorsEncountered++;
            return stats;
        }
    }

    /**
     * Get cleanup statistics for a guild
     */
    async getCleanupStats(guildId: string): Promise<{
        totalTickets: number;
        closedTickets: number;
        cleanedUpTickets: number;
        oldestTicket: Date | null;
        newestTicket: Date | null;
    }> {
        return await this.ticketDAO.getCleanupStats(guildId);
    }
}