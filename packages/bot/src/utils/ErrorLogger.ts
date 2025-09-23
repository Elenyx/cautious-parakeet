import { PostgreSQLGuildConfigDAO } from '../database/PostgreSQLGuildConfigDAO';
import { Client, TextChannel, EmbedBuilder, Interaction } from 'discord.js';

/**
 * Interface for error log entries
 */
export interface ErrorLog {
    id?: number;
    guild_id?: string;
    error_type: string;
    error_message: string;
    stack_trace?: string;
    context?: Record<string, unknown>;
    created_at?: string;
}

/**
 * Error logging utility for the bot
 */
export class ErrorLogger {
    private static instance: ErrorLogger;
    private guildConfigDAO: PostgreSQLGuildConfigDAO;
    private client: Client | null = null;

    private constructor() {
        this.guildConfigDAO = new PostgreSQLGuildConfigDAO();
    }

    /**
     * Get singleton instance of ErrorLogger
     */
    public static getInstance(): ErrorLogger {
        if (!ErrorLogger.instance) {
            ErrorLogger.instance = new ErrorLogger();
        }
        return ErrorLogger.instance;
    }

    /**
     * Set Discord client for error reporting
     */
    public setClient(client: Client): void {
        this.client = client;
    }

    /**
     * Log an error to the database and optionally to Discord
     */
    public async logError(error: Error | string, context?: {
        guildId?: string;
        errorType?: string;
        additionalContext?: Record<string, unknown>;
        sendToDiscord?: boolean;
    }): Promise<void> {
        try {
            const errorMessage = error instanceof Error ? error.message : error;
            const stackTrace = error instanceof Error ? error.stack : undefined;
            const errorType = context?.errorType || (error instanceof Error ? error.constructor.name : 'UnknownError');

            // Log to console
            console.error(`[${errorType}] ${errorMessage}`);
            if (stackTrace) {
                console.error(stackTrace);
            }
            if (context?.additionalContext) {
                console.error('Context:', context.additionalContext);
            }

            // Send to Discord if enabled and guild ID provided
            if (context?.sendToDiscord !== false && context?.guildId) {
                await this.sendErrorToDiscord(context.guildId, {
                    error_type: errorType,
                    error_message: errorMessage,
                    stack_trace: stackTrace,
                    context: context?.additionalContext
                });
            }
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }
    }

    /**
     * Send error message to Discord error log channel
     */
    private async sendErrorToDiscord(guildId: string, errorLog: Omit<ErrorLog, 'id' | 'guild_id' | 'created_at'>): Promise<void> {
        try {
            if (!this.client) return;

            const guildConfig = await this.guildConfigDAO.getGuildConfig(guildId);
            if (!guildConfig?.error_log_channel_id) return;

            const channel = await this.client.channels.fetch(guildConfig.error_log_channel_id) as TextChannel;
            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🚨 Error Logged')
                .addFields(
                    { name: 'Error Type', value: errorLog.error_type, inline: true },
                    { name: 'Message', value: errorLog.error_message.substring(0, 1024), inline: false }
                )
                .setTimestamp();

            if (errorLog.stack_trace) {
                embed.addFields({
                    name: 'Stack Trace',
                    value: `\`\`\`\n${errorLog.stack_trace.substring(0, 1000)}\n\`\`\``,
                    inline: false
                });
            }

            if (errorLog.context) {
                embed.addFields({
                    name: 'Context',
                    value: `\`\`\`json\n${JSON.stringify(errorLog.context, null, 2).substring(0, 1000)}\n\`\`\``,
                    inline: false
                });
            }

            await channel.send({ embeds: [embed] });
        } catch (discordError) {
            console.error('Failed to send error to Discord:', discordError);
        }
    }

    /**
     * Log command-specific errors
     */
    public async logCommandError(error: Error, context: {
        guildId?: string;
        userId?: string;
        commandName?: string;
        interaction?: Interaction;
    }): Promise<void> {
        await this.logError(error, {
            guildId: context.guildId,
            errorType: 'CommandError',
            additionalContext: {
                userId: context.userId,
                commandName: context.commandName,
                interactionType: context.interaction?.type
            }
        });
    }

    /**
     * Log ticket-specific errors
     */
    public async logTicketError(error: Error, context: {
        guildId?: string;
        userId?: string;
        ticketId?: number;
        channelId?: string;
        action?: string;
    }): Promise<void> {
        await this.logError(error, {
            guildId: context.guildId,
            errorType: 'TicketError',
            additionalContext: {
                userId: context.userId,
                ticketId: context.ticketId,
                channelId: context.channelId,
                action: context.action
            }
        });
    }

    /**
     * Log database-specific errors
     */
    public async logDatabaseError(error: Error, context: {
        guildId?: string;
        operation?: string;
        table?: string;
    }): Promise<void> {
        await this.logError(error, {
            guildId: context.guildId,
            errorType: 'DatabaseError',
            additionalContext: {
                operation: context.operation,
                table: context.table
            }
        });
    }
}