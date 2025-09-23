-- Initial schema migration for TicketMesh
-- Converts SQLite schema to PostgreSQL

-- Guild Configuration table
CREATE TABLE IF NOT EXISTS guild_configs (
    guild_id VARCHAR(255) PRIMARY KEY,
    category_id VARCHAR(255),
    panel_channel_id VARCHAR(255),
    transcript_channel_id VARCHAR(255),
    error_log_channel_id VARCHAR(255),
    support_role_ids TEXT, -- JSON array of role IDs
    ticket_counter INTEGER DEFAULT 0,
    cleanup_enabled BOOLEAN DEFAULT FALSE,
    cleanup_after_hours INTEGER DEFAULT 24,
    auto_close_inactive BOOLEAN DEFAULT FALSE,
    inactive_hours INTEGER DEFAULT 72,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    channel_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    ticket_number INTEGER NOT NULL,
    ticket_type VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'open', -- open, closed, archived
    assigned_to VARCHAR(255), -- User ID of assigned support staff
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    closed_by VARCHAR(255),
    close_reason TEXT,
    FOREIGN KEY (guild_id) REFERENCES guild_configs(guild_id) ON DELETE CASCADE
);

-- Ticket Messages table for transcript generation
CREATE TABLE IF NOT EXISTS ticket_messages (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    message_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    content TEXT,
    attachments TEXT, -- JSON array of attachment URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Close Requests table
CREATE TABLE IF NOT EXISTS close_requests (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    requested_by VARCHAR(255) NOT NULL,
    reason TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, denied
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    processed_by VARCHAR(255),
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- Error Logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id SERIAL PRIMARY KEY,
    guild_id VARCHAR(255),
    error_type VARCHAR(255) NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    context TEXT, -- JSON object with additional context
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Statistics table
CREATE TABLE IF NOT EXISTS ticket_stats (
    id SERIAL PRIMARY KEY,
    guild_id VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    tickets_created INTEGER DEFAULT 0,
    tickets_closed INTEGER DEFAULT 0,
    avg_response_time INTEGER DEFAULT 0, -- in minutes
    avg_resolution_time INTEGER DEFAULT 0, -- in minutes
    UNIQUE(guild_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tickets_guild_id ON tickets(guild_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_close_requests_ticket_id ON close_requests(ticket_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_guild_id ON error_logs(guild_id);
CREATE INDEX IF NOT EXISTS idx_ticket_stats_guild_date ON ticket_stats(guild_id, date);

-- Create updated_at trigger for guild_configs
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_guild_configs_updated_at 
    BEFORE UPDATE ON guild_configs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();