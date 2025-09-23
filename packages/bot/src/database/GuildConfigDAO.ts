import { DatabaseManager } from './DatabaseManager';
import Database from 'better-sqlite3';

/**
 * Database row interface for guild_configs table
 */
interface GuildConfigRow {
    guild_id: string;
    category_id?: string;
    panel_channel_id?: string;
    transcript_channel_id?: string;
    error_log_channel_id?: string;
    support_role_ids?: string; // JSON string
    ticket_counter: number;
    cleanup_enabled: number; // SQLite boolean as number
    cleanup_after_hours: number;
    cleanup_tickets_days?: number;
    cleanup_logs_days?: number;
    auto_close_inactive: number; // SQLite boolean as number
    inactive_hours: number;
    created_at?: string;
    updated_at?: string;
}

/**
 * Guild configuration interface
 */
export interface GuildConfig {
    guild_id: string;
    category_id?: string;
    panel_channel_id?: string;
    transcript_channel_id?: string;
    error_log_channel_id?: string;
    support_role_ids: string[]; // Array of role IDs
    ticket_counter: number;
    cleanup_enabled: boolean;
    cleanup_after_hours: number;
    cleanup_tickets_days?: number;
    cleanup_logs_days?: number;
    auto_close_inactive: boolean;
    inactive_hours: number;
    created_at?: string;
    updated_at?: string;
}

/**
 * Data Access Object for Guild Configuration operations
 */
export class GuildConfigDAO {
    private db: Database.Database;
    private getConfigStmt!: Database.Statement;
    private upsertConfigStmt!: Database.Statement;
    private updateCounterStmt!: Database.Statement;
    private deleteConfigStmt!: Database.Statement;

    constructor() {
        this.db = DatabaseManager.getInstance().getDatabase();
        this.prepareStatements();
    }

    /**
     * Prepare SQL statements for better performance
     */
    private prepareStatements(): void {
        this.getConfigStmt = this.db.prepare(`
            SELECT * FROM guild_configs WHERE guild_id = ?
        `);

        this.upsertConfigStmt = this.db.prepare(`
            INSERT INTO guild_configs (
                guild_id, category_id, panel_channel_id, transcript_channel_id,
                error_log_channel_id, support_role_ids, ticket_counter,
                cleanup_enabled, cleanup_after_hours, auto_close_inactive,
                inactive_hours, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(guild_id) DO UPDATE SET
                category_id = excluded.category_id,
                panel_channel_id = excluded.panel_channel_id,
                transcript_channel_id = excluded.transcript_channel_id,
                error_log_channel_id = excluded.error_log_channel_id,
                support_role_ids = excluded.support_role_ids,
                ticket_counter = excluded.ticket_counter,
                cleanup_enabled = excluded.cleanup_enabled,
                cleanup_after_hours = excluded.cleanup_after_hours,
                auto_close_inactive = excluded.auto_close_inactive,
                inactive_hours = excluded.inactive_hours,
                updated_at = CURRENT_TIMESTAMP
        `);

        this.updateCounterStmt = this.db.prepare(`
            UPDATE guild_configs 
            SET ticket_counter = ticket_counter + 1, updated_at = CURRENT_TIMESTAMP
            WHERE guild_id = ?
        `);

        this.deleteConfigStmt = this.db.prepare(`
            DELETE FROM guild_configs WHERE guild_id = ?
        `);
    }

    /**
     * Get guild configuration by guild ID
     */
    public getGuildConfig(guildId: string): GuildConfig | null {
        try {
            const row = this.getConfigStmt.get(guildId) as GuildConfigRow;
            if (!row) return null;

            return {
                guild_id: row.guild_id,
                category_id: row.category_id,
                panel_channel_id: row.panel_channel_id,
                transcript_channel_id: row.transcript_channel_id,
                error_log_channel_id: row.error_log_channel_id,
                support_role_ids: row.support_role_ids ? JSON.parse(row.support_role_ids) : [],
                ticket_counter: row.ticket_counter,
                cleanup_enabled: Boolean(row.cleanup_enabled),
                cleanup_after_hours: row.cleanup_after_hours,
                cleanup_tickets_days: row.cleanup_tickets_days,
                cleanup_logs_days: row.cleanup_logs_days,
                auto_close_inactive: Boolean(row.auto_close_inactive),
                inactive_hours: row.inactive_hours,
                created_at: row.created_at,
                updated_at: row.updated_at
            };
        } catch (error) {
            console.error('Error getting guild config:', error);
            return null;
        }
    }

    /**
     * Create or update guild configuration
     */
    public upsertGuildConfig(config: Partial<GuildConfig> & { guild_id: string }): boolean {
        try {
            const supportRoleIds = JSON.stringify(config.support_role_ids || []);
            
            this.upsertConfigStmt.run(
                config.guild_id,
                config.category_id || null,
                config.panel_channel_id || null,
                config.transcript_channel_id || null,
                config.error_log_channel_id || null,
                supportRoleIds,
                config.ticket_counter || 0,
                config.cleanup_enabled ? 1 : 0,
                config.cleanup_after_hours || 24,
                config.auto_close_inactive ? 1 : 0,
                config.inactive_hours || 72
            );

            return true;
        } catch (error) {
            console.error('Error upserting guild config:', error);
            return false;
        }
    }

    /**
     * Increment ticket counter and return new value
     */
    public incrementTicketCounter(guildId: string): number {
        try {
            this.updateCounterStmt.run(guildId);
            const config = this.getGuildConfig(guildId);
            return config?.ticket_counter || 1;
        } catch (error) {
            console.error('Error incrementing ticket counter:', error);
            return 1;
        }
    }

    /**
     * Delete guild configuration
     */
    public deleteGuildConfig(guildId: string): boolean {
        try {
            const result = this.deleteConfigStmt.run(guildId);
            return result.changes > 0;
        } catch (error) {
            console.error('Error deleting guild config:', error);
            return false;
        }
    }

    /**
     * Check if guild is properly configured
     */
    public isGuildConfigured(guildId: string): boolean {
        const config = this.getGuildConfig(guildId);
        return !!(config && 
                 config.category_id && 
                 config.panel_channel_id && 
                 config.transcript_channel_id && 
                 config.support_role_ids.length > 0);
    }

    /**
     * Get all configured guilds
     */
    public getAllConfiguredGuilds(): GuildConfig[] {
        try {
            const stmt = this.db.prepare('SELECT * FROM guild_configs');
            const rows = stmt.all() as GuildConfigRow[];
            
            return rows.map(row => ({
                guild_id: row.guild_id,
                category_id: row.category_id,
                panel_channel_id: row.panel_channel_id,
                transcript_channel_id: row.transcript_channel_id,
                error_log_channel_id: row.error_log_channel_id,
                support_role_ids: row.support_role_ids ? JSON.parse(row.support_role_ids) : [],
                ticket_counter: row.ticket_counter,
                cleanup_enabled: Boolean(row.cleanup_enabled),
                cleanup_after_hours: row.cleanup_after_hours,
                cleanup_tickets_days: row.cleanup_tickets_days,
                cleanup_logs_days: row.cleanup_logs_days,
                auto_close_inactive: Boolean(row.auto_close_inactive),
                inactive_hours: row.inactive_hours,
                created_at: row.created_at,
                updated_at: row.updated_at
            }));
        } catch (error) {
            console.error('Error getting all guild configs:', error);
            return [];
        }
    }

    /**
     * Alias for getAllConfiguredGuilds - used by CleanupHandler
     */
    public getAllGuildConfigs(): GuildConfig[] {
        return this.getAllConfiguredGuilds();
    }
}