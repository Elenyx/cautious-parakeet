import { DatabaseManager } from './DatabaseManager';
import { ErrorLogger } from '../utils/ErrorLogger';

// Database row types
interface TicketRow {
    id: number;
    guild_id: string;
    channel_id: string;
    user_id: string;
    ticket_number: number;
    ticket_type: string;
    status: 'open' | 'closed' | 'archived';
    assigned_to?: string;
    transcript_url?: string;
    created_at: string;
    closed_at?: string;
    closed_by?: string;
    close_reason?: string;
}

interface CloseRequestRow {
    id: number;
    ticket_id: number;
    requested_by: string;
    reason?: string;
    status: 'pending' | 'approved' | 'denied';
    created_at: string;
    processed_at?: string;
    processed_by?: string;
}

interface TicketMessageRow {
    id: number;
    ticket_id: number;
    message_id: string;
    user_id: string;
    username: string;
    content?: string;
    attachments?: string; // JSON string
    created_at: string;
}

interface StatsRow {
    total_tickets: number;
    open_tickets: number;
    closed_tickets: number;
    avg_resolution_hours: number;
}

/**
 * Interface for Ticket data
 */
export interface Ticket {
    id?: number;
    guild_id: string;
    channel_id: string;
    user_id: string;
    ticket_number: number;
    ticket_type: string;
    status: 'open' | 'closed' | 'archived';
    assigned_to?: string;
    transcript_url?: string;
    created_at?: string;
    closed_at?: string;
    closed_by?: string;
    close_reason?: string;
}

/**
 * Interface for Ticket Message data
 */
export interface TicketMessage {
    id?: number;
    ticket_id: number;
    message_id: string;
    user_id: string;
    username: string;
    content?: string;
    attachments: string[]; // Array of attachment URLs
    created_at?: string;
}

/**
 * Interface for Close Request data
 */
export interface CloseRequest {
    id?: number;
    ticket_id: number;
    requested_by: string;
    reason?: string;
    status: 'pending' | 'approved' | 'denied';
    created_at?: string;
    processed_at?: string;
    processed_by?: string;
}

/**
 * Data Access Object for Ticket operations
 */
export class TicketDAO {
    private dbManager: DatabaseManager;
    private errorLogger: ErrorLogger;

    constructor() {
        this.dbManager = DatabaseManager.getInstance();
        this.errorLogger = ErrorLogger.getInstance();
    }

    /**
     * Create a new ticket
     */
    public async createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'status'>): Promise<number | null> {
        try {
            const result = await this.dbManager.query(`
                INSERT INTO tickets (
                    guild_id, channel_id, user_id, ticket_number, ticket_type, status
                ) VALUES ($1, $2, $3, $4, $5, 'open')
                RETURNING id
            `, [
                ticket.guild_id,
                ticket.channel_id,
                ticket.user_id,
                ticket.ticket_number,
                ticket.ticket_type
            ]);

            return result.rows[0]?.id || null;
        } catch (error) {
            console.error('Error creating ticket:', error);
            return null;
        }
    }

    /**
     * Get ticket by ID
     */
    public async getTicket(ticketId: number): Promise<Ticket | null> {
        try {
            const result = await this.dbManager.query(
                'SELECT * FROM tickets WHERE id = $1',
                [ticketId]
            );

            if (result.rows.length === 0) {
                return null;
            }

            return this.mapRowToTicket(result.rows[0]);
        } catch (error) {
            console.error('Error fetching ticket:', error);
            return null;
        }
    }

    /**
     * Get ticket by channel ID
     */
    public async getTicketByChannel(channelId: string): Promise<Ticket | null> {
        try {
            const result = await this.dbManager.query(
                'SELECT * FROM tickets WHERE channel_id = $1',
                [channelId]
            );

            if (result.rows.length === 0) {
                return null;
            }

            return this.mapRowToTicket(result.rows[0]);
        } catch (error) {
            console.error('Error fetching ticket by channel:', error);
            return null;
        }
    }

    /**
     * Get user's open tickets in a guild
     */
    public async getUserOpenTickets(guildId: string, userId: string): Promise<Ticket[]> {
        try {
            // Log the query attempt for debugging
            console.log(`[DEBUG] Attempting to get open tickets for user ${userId} in guild ${guildId}`);
            
            const result = await this.dbManager.query(
                'SELECT * FROM tickets WHERE guild_id = $1 AND user_id = $2 AND status = $3',
                [guildId, userId, 'open']
            );

            console.log(`[DEBUG] Query successful. Found ${result.rows.length} open tickets`);
            
            return result.rows.map((row: TicketRow) => this.mapRowToTicket(row));
        } catch (error: unknown) {
            // Enhanced error logging with comprehensive context
            const errorMessage = error instanceof Error ? error.message : String(error);
            const stackTrace = error instanceof Error ? error.stack : undefined;
            
            console.error('❌ Error fetching user open tickets:', {
                error: errorMessage,
                guildId,
                userId,
                query: 'SELECT * FROM tickets WHERE guild_id = $1 AND user_id = $2 AND status = $3',
                parameters: [guildId, userId, 'open'],
                stack: stackTrace
            });

            // Log to ErrorLogger with detailed context
            await this.errorLogger.logDatabaseError(error as Error, {
                guildId,
                operation: 'getUserOpenTickets',
                table: 'tickets'
            });

            // Also log as ticket error for comprehensive tracking
            await this.errorLogger.logTicketError(error as Error, {
                guildId,
                userId,
                action: 'check_existing_tickets'
            });

            // Return empty array to prevent blocking ticket creation
            // This ensures users can still create tickets even if the check fails
            return [];
        }
    }

    /**
     * Update ticket status
     */
    public async updateTicketStatus(ticketId: number, status: Ticket['status']): Promise<boolean> {
        try {
            const result = await this.dbManager.query(
                'UPDATE tickets SET status = $1 WHERE id = $2',
                [status, ticketId]
            );

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error updating ticket status:', error);
            return false;
        }
    }

    /**
     * Close a ticket
     */
    public async closeTicket(ticketId: number, closedBy: string, reason?: string): Promise<boolean> {
        try {
            const result = await this.dbManager.query(`
                UPDATE tickets 
                SET status = 'closed', closed_at = CURRENT_TIMESTAMP, closed_by = $1, close_reason = $2
                WHERE id = $3
            `, [closedBy, reason || null, ticketId]);

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error closing ticket:', error);
            return false;
        }
    }

    /**
     * Add a message to a ticket
     */
    public async addMessage(message: Omit<TicketMessage, 'id' | 'created_at'>): Promise<boolean> {
        try {
            const attachmentsJson = JSON.stringify(message.attachments || []);
            
            const result = await this.dbManager.query(`
                INSERT INTO ticket_messages (
                    ticket_id, message_id, user_id, username, content, attachments
                ) VALUES ($1, $2, $3, $4, $5, $6)
            `, [
                message.ticket_id,
                message.message_id,
                message.user_id,
                message.username,
                message.content || null,
                attachmentsJson
            ]);

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error adding message:', error);
            return false;
        }
    }

    /**
     * Get all messages for a ticket
     */
    public async getTicketMessages(ticketId: number): Promise<TicketMessage[]> {
        try {
            const result = await this.dbManager.query(
                'SELECT * FROM ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC',
                [ticketId]
            );

            return result.rows.map((row: TicketMessageRow) => ({
                id: row.id,
                ticket_id: row.ticket_id,
                message_id: row.message_id,
                user_id: row.user_id,
                username: row.username,
                content: row.content,
                attachments: row.attachments ? JSON.parse(row.attachments) : [],
                created_at: row.created_at
            }));
        } catch (error) {
            console.error('Error fetching ticket messages:', error);
            return [];
        }
    }

    /**
     * Create a close request
     */
    public async createCloseRequest(request: Omit<CloseRequest, 'id' | 'created_at' | 'status'>): Promise<number | null> {
        try {
            const result = await this.dbManager.query(`
                INSERT INTO close_requests (ticket_id, requested_by, reason, status)
                VALUES ($1, $2, $3, 'pending')
                RETURNING id
            `, [request.ticket_id, request.requested_by, request.reason || null]);

            return result.rows[0]?.id || null;
        } catch (error) {
            console.error('Error creating close request:', error);
            return null;
        }
    }

    /**
     * Get pending close request for a ticket
     */
    public async getPendingCloseRequest(ticketId: number): Promise<CloseRequest | null> {
        try {
            const result = await this.dbManager.query(
                'SELECT * FROM close_requests WHERE ticket_id = $1 AND status = $2',
                [ticketId, 'pending']
            );

            if (result.rows.length === 0) {
                return null;
            }

            return this.mapRowToCloseRequest(result.rows[0]);
        } catch (error) {
            console.error('Error fetching pending close request:', error);
            return null;
        }
    }

    /**
     * Process a close request
     */
    public async processCloseRequest(requestId: number, status: CloseRequest['status'], processedBy: string): Promise<boolean> {
        try {
            const result = await this.dbManager.query(`
                UPDATE close_requests 
                SET status = $1, processed_at = CURRENT_TIMESTAMP, processed_by = $2
                WHERE id = $3
            `, [status, processedBy, requestId]);

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error processing close request:', error);
            return false;
        }
    }

    /**
     * Get all tickets for a guild
     */
    public async getGuildTickets(guildId: string): Promise<Ticket[]> {
        try {
            const result = await this.dbManager.query(
                'SELECT * FROM tickets WHERE guild_id = $1 ORDER BY created_at DESC',
                [guildId]
            );

            return result.rows.map((row: TicketRow) => this.mapRowToTicket(row));
        } catch (error: unknown) {
            console.error('Error fetching guild tickets:', error);
            return [];
        }
    }

    /**
     * Get tickets by date range
     */
    public async getTicketsByDateRange(guildId: string, startDate: Date, endDate: Date): Promise<Ticket[]> {
        try {
            const result = await this.dbManager.query(`
                SELECT * FROM tickets 
                WHERE guild_id = $1 AND created_at >= $2 AND created_at <= $3
                ORDER BY created_at DESC
            `, [guildId, startDate.toISOString(), endDate.toISOString()]);

            return result.rows.map((row: TicketRow) => this.mapRowToTicket(row));
        } catch (error: unknown) {
            console.error('Error fetching tickets by date range:', error);
            return [];
        }
    }

	/**
	 * Get tickets closed within a date range (based on closed_at)
	 */
	public async getTicketsClosedByDateRange(guildId: string, startDate: Date, endDate: Date): Promise<Ticket[]> {
		try {
			const result = await this.dbManager.query(`
				SELECT * FROM tickets 
				WHERE guild_id = $1 AND status = 'closed' AND closed_at IS NOT NULL
				AND closed_at >= $2 AND closed_at < $3
				ORDER BY closed_at DESC
			`, [guildId, startDate.toISOString(), endDate.toISOString()]);

			return result.rows.map((row: TicketRow) => this.mapRowToTicket(row));
		} catch (error: unknown) {
			console.error('Error fetching tickets closed by date range:', error);
			return [];
		}
	}

    /**
     * Assign a ticket to a user
     */
    public async assignTicket(ticketId: number, assignedTo: string): Promise<boolean> {
        try {
            const result = await this.dbManager.query(
                'UPDATE tickets SET assigned_to = $1 WHERE id = $2',
                [assignedTo, ticketId]
            );

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error assigning ticket:', error);
            return false;
        }
    }

    /**
     * Get guild statistics
     */
    public async getGuildStats(guildId: string, days: number = 30): Promise<StatsRow | null> {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);

            const result = await this.dbManager.query(`
                SELECT 
                    COUNT(*) as total_tickets,
                    COUNT(CASE WHEN status = 'open' THEN 1 END) as open_tickets,
                    COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
                    COALESCE(AVG(EXTRACT(EPOCH FROM (closed_at - created_at)) / 3600), 0) as avg_resolution_hours
                FROM tickets 
                WHERE guild_id = $1 AND created_at >= $2
            `, [guildId, cutoffDate.toISOString()]);

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];
            return {
                total_tickets: parseInt(row.total_tickets),
                open_tickets: parseInt(row.open_tickets),
                closed_tickets: parseInt(row.closed_tickets),
                avg_resolution_hours: parseFloat(row.avg_resolution_hours)
            };
        } catch (error) {
            console.error('Error fetching guild stats:', error);
            return null;
        }
    }

    /**
     * Get cleanup statistics
     */
    public async getCleanupStats(guildId: string): Promise<{
        totalTickets: number;
        closedTickets: number;
        cleanedUpTickets: number;
        oldestTicket: Date | null;
        newestTicket: Date | null;
    }> {
        try {
            const result = await this.dbManager.query(`
                SELECT 
                    COUNT(*) as total_tickets,
                    COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_tickets,
                    COUNT(CASE WHEN status = 'archived' THEN 1 END) as cleaned_up_tickets,
                    MIN(created_at) as oldest_ticket,
                    MAX(created_at) as newest_ticket
                FROM tickets 
                WHERE guild_id = $1
            `, [guildId]);

            const row = result.rows[0];
            return {
                totalTickets: parseInt(row.total_tickets) || 0,
                closedTickets: parseInt(row.closed_tickets) || 0,
                cleanedUpTickets: parseInt(row.cleaned_up_tickets) || 0,
                oldestTicket: row.oldest_ticket ? new Date(row.oldest_ticket) : null,
                newestTicket: row.newest_ticket ? new Date(row.newest_ticket) : null
            };
        } catch (error) {
            console.error('Error fetching cleanup stats:', error);
            return {
                totalTickets: 0,
                closedTickets: 0,
                cleanedUpTickets: 0,
                oldestTicket: null,
                newestTicket: null
            };
        }
    }

    /**
     * Get old closed tickets for cleanup
     */
    public async getOldClosedTickets(guildId: string, cutoffDate: Date, limit: number = 100): Promise<Ticket[]> {
        try {
            const result = await this.dbManager.query(`
                SELECT * FROM tickets 
                WHERE guild_id = $1 AND status = 'closed' AND closed_at < $2
                ORDER BY closed_at ASC
                LIMIT $3
            `, [guildId, cutoffDate.toISOString(), limit]);

            return result.rows.map((row: TicketRow) => this.mapRowToTicket(row));
        } catch (error) {
            console.error('Error fetching old closed tickets:', error);
            return [];
        }
    }

    /**
     * Update ticket with partial data
     */
    public async updateTicket(ticketId: number, updates: Partial<Ticket>): Promise<boolean> {
        try {
            const fields: string[] = [];
            const values: unknown[] = [];
            let paramIndex = 1;

            // Build dynamic update query
            Object.entries(updates).forEach(([key, value]) => {
                if (value !== undefined && key !== 'id') {
                    fields.push(`${key} = $${paramIndex}`);
                    values.push(value);
                    paramIndex++;
                }
            });

            if (fields.length === 0) {
                return true; // No updates to make
            }

            values.push(ticketId);

            const result = await this.dbManager.query(`
                UPDATE tickets 
                SET ${fields.join(', ')}
                WHERE id = $${paramIndex}
            `, values);

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error updating ticket:', error);
            return false;
        }
    }

    /**
     * Clean up old messages
     */
    public async cleanupOldMessages(guildId: string, cutoffDate: Date, limit: number = 1000): Promise<number> {
        try {
            const result = await this.dbManager.query(`
                DELETE FROM ticket_messages 
                WHERE ticket_id IN (
                    SELECT id FROM tickets WHERE guild_id = $1
                ) AND created_at < $2
                LIMIT $3
            `, [guildId, cutoffDate.toISOString(), limit]);

            return result.rowCount || 0;
        } catch (error) {
            console.error('Error cleaning up old messages:', error);
            return 0;
        }
    }

    /**
     * Map database row to Ticket object
     */
    private mapRowToTicket(row: TicketRow): Ticket {
        return {
            id: row.id,
            guild_id: row.guild_id,
            channel_id: row.channel_id,
            user_id: row.user_id,
            ticket_number: row.ticket_number,
            ticket_type: row.ticket_type,
            status: row.status,
            assigned_to: row.assigned_to,
            transcript_url: row.transcript_url,
            created_at: row.created_at,
            closed_at: row.closed_at,
            closed_by: row.closed_by,
            close_reason: row.close_reason
        };
    }

    /**
     * Map database row to CloseRequest object
     */
    private mapRowToCloseRequest(row: CloseRequestRow): CloseRequest {
        return {
            id: row.id,
            ticket_id: row.ticket_id,
            requested_by: row.requested_by,
            reason: row.reason,
            status: row.status,
            created_at: row.created_at,
            processed_at: row.processed_at,
            processed_by: row.processed_by
        };
    }
}