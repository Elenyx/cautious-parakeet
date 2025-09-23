import { DatabaseManager } from './DatabaseManager';
import Database from 'better-sqlite3';

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

interface CleanupStatsRow {
    total_tickets: number;
    closed_tickets: number;
    cleaned_up_tickets: number;
    oldest_ticket?: string;
    newest_ticket?: string;
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
    private db: Database.Database;
    private createTicketStmt!: Database.Statement;
    private getTicketStmt!: Database.Statement;
    private getTicketByChannelStmt!: Database.Statement;
    private getUserOpenTicketsStmt!: Database.Statement;
    private updateTicketStatusStmt!: Database.Statement;
    private closeTicketStmt!: Database.Statement;
    private addMessageStmt!: Database.Statement;
    private getTicketMessagesStmt!: Database.Statement;
    private createCloseRequestStmt!: Database.Statement;
    private getCloseRequestStmt!: Database.Statement;
    private processCloseRequestStmt!: Database.Statement;

    constructor() {
        this.db = DatabaseManager.getInstance().getDatabase();
        this.prepareStatements();
    }

    /**
     * Prepare SQL statements for better performance
     */
    private prepareStatements(): void {
        this.createTicketStmt = this.db.prepare(`
            INSERT INTO tickets (guild_id, channel_id, user_id, ticket_number, ticket_type)
            VALUES (?, ?, ?, ?, ?)
        `);

        this.getTicketStmt = this.db.prepare(`
            SELECT * FROM tickets WHERE id = ?
        `);

        this.getTicketByChannelStmt = this.db.prepare(`
            SELECT * FROM tickets WHERE channel_id = ?
        `);

        this.getUserOpenTicketsStmt = this.db.prepare(`
            SELECT * FROM tickets 
            WHERE guild_id = ? AND user_id = ? AND status = 'open'
        `);

        this.updateTicketStatusStmt = this.db.prepare(`
            UPDATE tickets 
            SET status = ?
            WHERE id = ?
        `);

        this.closeTicketStmt = this.db.prepare(`
            UPDATE tickets 
            SET status = 'closed', closed_at = CURRENT_TIMESTAMP, closed_by = ?, close_reason = ?
            WHERE id = ?
        `);

        this.addMessageStmt = this.db.prepare(`
            INSERT INTO ticket_messages (ticket_id, message_id, user_id, username, content, attachments)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        this.getTicketMessagesStmt = this.db.prepare(`
            SELECT * FROM ticket_messages 
            WHERE ticket_id = ? 
            ORDER BY created_at ASC
        `);

        this.createCloseRequestStmt = this.db.prepare(`
            INSERT INTO close_requests (ticket_id, requested_by, reason)
            VALUES (?, ?, ?)
        `);

        this.getCloseRequestStmt = this.db.prepare(`
            SELECT * FROM close_requests 
            WHERE ticket_id = ? AND status = 'pending'
            ORDER BY created_at DESC
            LIMIT 1
        `);

        this.processCloseRequestStmt = this.db.prepare(`
            UPDATE close_requests 
            SET status = ?, processed_at = CURRENT_TIMESTAMP, processed_by = ?
            WHERE id = ?
        `);
    }

    /**
     * Create a new ticket
     */
    public createTicket(ticket: Omit<Ticket, 'id' | 'created_at' | 'status'>): number | null {
        try {
            const result = this.createTicketStmt.run(
                ticket.guild_id,
                ticket.channel_id,
                ticket.user_id,
                ticket.ticket_number,
                ticket.ticket_type
            );
            return result.lastInsertRowid as number;
        } catch (error) {
            console.error('Error creating ticket:', error);
            return null;
        }
    }

    /**
     * Get ticket by ID
     */
    public getTicket(ticketId: number): Ticket | null {
        try {
            const row = this.getTicketStmt.get(ticketId) as TicketRow;
            return row ? this.mapRowToTicket(row) : null;
        } catch (error) {
            console.error('Error getting ticket:', error);
            return null;
        }
    }

    /**
     * Get ticket by channel ID
     */
    public getTicketByChannel(channelId: string): Ticket | null {
        try {
            const row = this.getTicketByChannelStmt.get(channelId) as TicketRow;
            return row ? this.mapRowToTicket(row) : null;
        } catch (error) {
            console.error('Error getting ticket by channel:', error);
            return null;
        }
    }

    /**
     * Get user's open tickets in a guild
     */
    public getUserOpenTickets(guildId: string, userId: string): Ticket[] {
        try {
            const rows = this.getUserOpenTicketsStmt.all(guildId, userId) as TicketRow[];
            return rows.map(row => this.mapRowToTicket(row));
        } catch (error) {
            console.error('Error getting user open tickets:', error);
            return [];
        }
    }

    /**
     * Update ticket status
     */
    public updateTicketStatus(ticketId: number, status: Ticket['status']): boolean {
        try {
            const result = this.updateTicketStatusStmt.run(status, ticketId);
            return result.changes > 0;
        } catch (error) {
            console.error('Error updating ticket status:', error);
            return false;
        }
    }

    /**
     * Close a ticket
     */
    public closeTicket(ticketId: number, closedBy: string, reason?: string): boolean {
        try {
            const result = this.closeTicketStmt.run(closedBy, reason || null, ticketId);
            return result.changes > 0;
        } catch (error) {
            console.error('Error closing ticket:', error);
            return false;
        }
    }

    /**
     * Add a message to ticket transcript
     */
    public addMessage(message: Omit<TicketMessage, 'id' | 'created_at'>): boolean {
        try {
            const attachmentsJson = JSON.stringify(message.attachments);
            this.addMessageStmt.run(
                message.ticket_id,
                message.message_id,
                message.user_id,
                message.username,
                message.content || null,
                attachmentsJson
            );
            return true;
        } catch (error) {
            console.error('Error adding ticket message:', error);
            return false;
        }
    }

    /**
     * Get all messages for a ticket
     */
    public getTicketMessages(ticketId: number): TicketMessage[] {
        try {
            const rows = this.getTicketMessagesStmt.all(ticketId) as TicketMessageRow[];
            return rows.map(row => ({
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
            console.error('Error getting ticket messages:', error);
            return [];
        }
    }

    /**
     * Create a close request
     */
    public createCloseRequest(request: Omit<CloseRequest, 'id' | 'created_at' | 'status'>): number | null {
        try {
            const result = this.createCloseRequestStmt.run(
                request.ticket_id,
                request.requested_by,
                request.reason || null
            );
            return result.lastInsertRowid as number;
        } catch (error) {
            console.error('Error creating close request:', error);
            return null;
        }
    }

    /**
     * Get pending close request for a ticket
     */
    public getPendingCloseRequest(ticketId: number): CloseRequest | null {
        try {
            const row = this.getCloseRequestStmt.get(ticketId) as CloseRequestRow;
            return row ? this.mapRowToCloseRequest(row) : null;
        } catch (error) {
            console.error('Error getting close request:', error);
            return null;
        }
    }

    /**
     * Process a close request
     */
    public processCloseRequest(requestId: number, status: CloseRequest['status'], processedBy: string): boolean {
        try {
            const result = this.processCloseRequestStmt.run(status, processedBy, requestId);
            return result.changes > 0;
        } catch (error) {
            console.error('Error processing close request:', error);
            return false;
        }
    }

    /**
     * Get all tickets for a guild
     */
    public getGuildTickets(guildId: string): Ticket[] {
        try {
            const rows = this.db.prepare(`
                SELECT * FROM tickets 
                WHERE guild_id = ? 
                ORDER BY created_at DESC
            `).all(guildId) as TicketRow[];
            
            return rows.map(row => this.mapRowToTicket(row));
        } catch (error) {
            console.error('Error getting guild tickets:', error);
            return [];
        }
    }

    /**
     * Get tickets by date range
     */
    public getTicketsByDateRange(guildId: string, startDate: Date, endDate: Date): Ticket[] {
        try {
            const rows = this.db.prepare(`
                SELECT * FROM tickets 
                WHERE guild_id = ? 
                AND created_at >= ? 
                AND created_at <= ?
                ORDER BY created_at DESC
            `).all(guildId, startDate.toISOString(), endDate.toISOString()) as TicketRow[];
            
            return rows.map(row => this.mapRowToTicket(row));
        } catch (error) {
            console.error('Error getting tickets by date range:', error);
            return [];
        }
    }

    /**
     * Assign a ticket to a user
     */
    public assignTicket(ticketId: number, assignedTo: string): boolean {
        try {
            const result = this.db.prepare(`
                UPDATE tickets 
                SET assigned_to = ? 
                WHERE id = ?
            `).run(assignedTo, ticketId);
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error assigning ticket:', error);
            return false;
        }
    }

    /**
     * Get guild statistics
     */
    public getGuildStats(guildId: string, days: number = 30): StatsRow | null {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const stats = this.db.prepare(`
                SELECT 
                    COUNT(*) as total_tickets,
                    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_tickets,
                    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_tickets,
                    AVG(CASE 
                        WHEN status = 'closed' AND closed_at IS NOT NULL 
                        THEN (julianday(closed_at) - julianday(created_at)) * 24 
                        ELSE NULL 
                    END) as avg_resolution_hours
                FROM tickets 
                WHERE guild_id = ? AND created_at >= ?
            `).get(guildId, startDate.toISOString());

            return stats as StatsRow;
        } catch (error) {
            console.error('Error getting guild stats:', error);
            return null;
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

    /**
     * Get cleanup statistics for a guild
     */
    public getCleanupStats(guildId: string): {
        totalTickets: number;
        closedTickets: number;
        cleanedUpTickets: number;
        oldestTicket: Date | null;
        newestTicket: Date | null;
    } {
        try {
            const statsQuery = this.db.prepare(`
                SELECT 
                    COUNT(*) as total_tickets,
                    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_tickets,
                    SUM(CASE WHEN status = 'archived' THEN 1 ELSE 0 END) as cleaned_up_tickets,
                    MIN(created_at) as oldest_ticket,
                    MAX(created_at) as newest_ticket
                FROM tickets 
                WHERE guild_id = ?
            `);

            const result = statsQuery.get(guildId) as CleanupStatsRow;
            
            return {
                totalTickets: result.total_tickets || 0,
                closedTickets: result.closed_tickets || 0,
                cleanedUpTickets: result.cleaned_up_tickets || 0,
                oldestTicket: result.oldest_ticket ? new Date(result.oldest_ticket) : null,
                newestTicket: result.newest_ticket ? new Date(result.newest_ticket) : null
            };
        } catch (error) {
            console.error('Error getting cleanup stats:', error);
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
    public getOldClosedTickets(guildId: string, cutoffDate: Date, limit: number = 100): Ticket[] {
        try {
            const stmt = this.db.prepare(`
                SELECT * FROM tickets 
                WHERE guild_id = ? 
                AND status IN ('closed', 'archived') 
                AND closed_at < ? 
                ORDER BY closed_at ASC 
                LIMIT ?
            `);
            
            const rows = stmt.all(guildId, cutoffDate.toISOString(), limit) as TicketRow[];
            return rows.map(row => this.mapRowToTicket(row));
        } catch (error) {
            console.error('Error getting old closed tickets:', error);
            return [];
        }
    }

    /**
     * Update ticket with partial data
     */
    public updateTicket(ticketId: number, updates: Partial<Ticket>): boolean {
        try {
            const fields = [];
            const values = [];
            
            if (updates.status !== undefined) {
                fields.push('status = ?');
                values.push(updates.status);
            }
            if (updates.assigned_to !== undefined) {
                fields.push('assigned_to = ?');
                values.push(updates.assigned_to);
            }
            if (updates.transcript_url !== undefined) {
                fields.push('transcript_url = ?');
                values.push(updates.transcript_url);
            }
            if (updates.closed_at !== undefined) {
                fields.push('closed_at = ?');
                values.push(updates.closed_at);
            }
            if (updates.closed_by !== undefined) {
                fields.push('closed_by = ?');
                values.push(updates.closed_by);
            }
            if (updates.close_reason !== undefined) {
                fields.push('close_reason = ?');
                values.push(updates.close_reason);
            }
            
            if (fields.length === 0) return false;
            
            values.push(ticketId);
            
            const stmt = this.db.prepare(`
                UPDATE tickets 
                SET ${fields.join(', ')} 
                WHERE id = ?
            `);
            
            const result = stmt.run(...values);
            return result.changes > 0;
        } catch (error) {
            console.error('Error updating ticket:', error);
            return false;
        }
    }

    /**
     * Clean up old ticket messages
     */
    public cleanupOldMessages(guildId: string, cutoffDate: Date, limit: number = 1000): number {
        try {
            const stmt = this.db.prepare(`
                DELETE FROM ticket_messages 
                WHERE ticket_id IN (
                    SELECT id FROM tickets 
                    WHERE guild_id = ? 
                    AND created_at < ?
                ) 
                LIMIT ?
            `);
            
            const result = stmt.run(guildId, cutoffDate.toISOString(), limit);
            return result.changes;
        } catch (error) {
            console.error('Error cleaning up old messages:', error);
            return 0;
        }
    }
}