import { GuildConfig } from "../types";
import { DatabaseManager } from './DatabaseManager';

/**
 * PostgreSQL row interface for guild_configs table
 */
interface PostgreSQLGuildConfigRow {
    guild_id: string;
    category_id?: string;
    panel_channel_id?: string;
    transcript_channel?: string;
    error_log_channel_id?: string;
    support_role_ids?: string; // JSON string
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
 * Data Access Object for guild configurations
 */
export class GuildConfigDAO {
    private dbManager: DatabaseManager;

    /**
     * Constructs a new GuildConfigDAO instance
     */
    constructor() {
        this.dbManager = DatabaseManager.getInstance();
    }

    /**
     * Get guild configuration by guild ID
     */
    public async getGuildConfig(guildId: string): Promise<GuildConfig | null> {
        try {
            const result = await this.dbManager.query(
                'SELECT * FROM guild_configs WHERE guild_id = $1',
                [guildId]
            );

            if (result.rows.length === 0) {
                return null;
            }

            const row = result.rows[0];
            return this.mapRowToConfig(row);
        } catch (error) {
            console.error('Error fetching guild config:', error);
            throw error;
        }
    }

    /**
     * Create or update guild configuration
     */
    public async upsertGuildConfig(config: Partial<GuildConfig> & { guild_id: string }): Promise<GuildConfig> {
        try {
            // Handle support_role_ids specially - always update if provided, even if empty array
            const supportRoleIds = config.support_role_ids !== undefined ? JSON.stringify(config.support_role_ids) : null;
            
            const result = await this.dbManager.query(`
                INSERT INTO guild_configs (
                    guild_id, category_id, panel_channel_id, transcript_channel,
                    error_log_channel_id, support_role_ids, ticket_counter,
                    cleanup_enabled, cleanup_after_hours, auto_close_inactive,
                    inactive_hours
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                ON CONFLICT(guild_id) DO UPDATE SET
                    category_id = COALESCE(EXCLUDED.category_id, guild_configs.category_id),
                    panel_channel_id = COALESCE(EXCLUDED.panel_channel_id, guild_configs.panel_channel_id),
                    transcript_channel = COALESCE(EXCLUDED.transcript_channel, guild_configs.transcript_channel),
                    error_log_channel_id = COALESCE(EXCLUDED.error_log_channel_id, guild_configs.error_log_channel_id),
                    support_role_ids = CASE 
                        WHEN EXCLUDED.support_role_ids IS NOT NULL THEN EXCLUDED.support_role_ids 
                        ELSE guild_configs.support_role_ids 
                    END,
                    ticket_counter = COALESCE(EXCLUDED.ticket_counter, guild_configs.ticket_counter),
                    cleanup_enabled = COALESCE(EXCLUDED.cleanup_enabled, guild_configs.cleanup_enabled),
                    cleanup_after_hours = COALESCE(EXCLUDED.cleanup_after_hours, guild_configs.cleanup_after_hours),
                    auto_close_inactive = COALESCE(EXCLUDED.auto_close_inactive, guild_configs.auto_close_inactive),
                    inactive_hours = COALESCE(EXCLUDED.inactive_hours, guild_configs.inactive_hours),
                    updated_at = CURRENT_TIMESTAMP
                RETURNING *
            `, [
                config.guild_id,
                config.category_id || null,
                config.panel_channel_id || null,
                config.transcript_channel || null,
                config.error_log_channel_id || null,
                supportRoleIds,
                config.ticket_counter || 0,
                config.cleanup_enabled || false,
                config.cleanup_after_hours || 24,
                config.auto_close_inactive || false,
                config.inactive_hours || 72
            ]);

            return this.mapRowToConfig(result.rows[0]);
        } catch (error) {
            console.error('Error upserting guild config:', error);
            throw error;
        }
    }

    /**
     * Increment ticket counter and return new value
     */
    public async incrementTicketCounter(guildId: string): Promise<number> {
        try {
            const result = await this.dbManager.query(`
                UPDATE guild_configs 
                SET ticket_counter = ticket_counter + 1, updated_at = CURRENT_TIMESTAMP
                WHERE guild_id = $1
                RETURNING ticket_counter
            `, [guildId]);

            if (result.rows.length === 0) {
                throw new Error(`Guild config not found for guild: ${guildId}`);
            }

            return result.rows[0].ticket_counter;
        } catch (error) {
            console.error('Error incrementing ticket counter:', error);
            throw error;
        }
    }

    /**
     * Delete guild configuration
     */
    public async deleteGuildConfig(guildId: string): Promise<boolean> {
        try {
            const result = await this.dbManager.query(
                'DELETE FROM guild_configs WHERE guild_id = $1',
                [guildId]
            );

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            console.error('Error deleting guild config:', error);
            throw error;
        }
    }

    /**
     * Get all guild configurations
     */
    public async getAllGuildConfigs(): Promise<GuildConfig[]> {
        try {
            const result = await this.dbManager.query('SELECT * FROM guild_configs ORDER BY created_at DESC');
            return result.rows.map((row: PostgreSQLGuildConfigRow) => this.mapRowToConfig(row));
        } catch (error) {
            console.error('Error fetching all guild configs:', error);
            throw error;
        }
    }

    /**
     * Update specific fields of guild configuration
     */
    public async updateGuildConfig(guildId: string, updates: Partial<Omit<GuildConfig, 'guild_id'>>): Promise<GuildConfig | null> {
        try {
            const fields: string[] = [];
            const values: unknown[] = [];
            let paramIndex = 1;

            // Build dynamic update query
            Object.entries(updates).forEach(([key, value]) => {
                if (value !== undefined) {
                    if (key === 'support_role_ids') {
                        fields.push(`${key} = $${paramIndex}`);
                        values.push(JSON.stringify(value));
                    } else {
                        fields.push(`${key} = $${paramIndex}`);
                        values.push(value);
                    }
                    paramIndex++;
                }
            });

            if (fields.length === 0) {
                return await this.getGuildConfig(guildId);
            }

            fields.push('updated_at = CURRENT_TIMESTAMP');
            values.push(guildId);

            const result = await this.dbManager.query(`
                UPDATE guild_configs 
                SET ${fields.join(', ')}
                WHERE guild_id = $${paramIndex}
                RETURNING *
            `, values);

            if (result.rows.length === 0) {
                return null;
            }

            return this.mapRowToConfig(result.rows[0]);
        } catch (error) {
            console.error('Error updating guild config:', error);
            throw error;
        }
    }

    /**
     * Map database row to GuildConfig object
     */
    private mapRowToConfig(row: PostgreSQLGuildConfigRow): GuildConfig {
        return {
            guild_id: row.guild_id,
            category_id: row.category_id,
            panel_channel_id: row.panel_channel_id,
            transcript_channel: row.transcript_channel,
            error_log_channel_id: row.error_log_channel_id,
            support_role_ids: row.support_role_ids ? JSON.parse(row.support_role_ids) : [],
            ticket_counter: row.ticket_counter,
            cleanup_enabled: row.cleanup_enabled,
            cleanup_after_hours: row.cleanup_after_hours,
            auto_close_inactive: row.auto_close_inactive,
            inactive_hours: row.inactive_hours,
            created_at: row.created_at,
            updated_at: row.updated_at
        };
    }
}