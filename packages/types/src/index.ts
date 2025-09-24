export interface GuildConfig {
    guild_id: string;
    category_id?: string | null;
    panel_channel_id?: string | null;
    transcript_channel_id?: string | null;
    error_log_channel_id?: string | null;
    support_role_ids: string[];
    ticket_counter: number;
    cleanup_tickets_days?: number;
    cleanup_logs_days?: number;
    cleanup_enabled: boolean;
    cleanup_after_hours: number;
    auto_close_inactive: boolean;
    inactive_hours: number;
    created_at?: string;
    updated_at?: string;
}