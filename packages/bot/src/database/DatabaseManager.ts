import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

/**
 * Database Manager class for handling SQLite database operations
 * Provides connection management and table initialization
 */
export class DatabaseManager {
    private static instance: DatabaseManager;
    private db: Database.Database;

    private constructor() {
        // Ensure database directory exists
        const dbDir = path.join(process.cwd(), 'data');
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // Initialize database connection
        const dbPath = path.join(dbDir, 'ticketmesh.db');
        this.db = new Database(dbPath);
        
        // Enable foreign keys and WAL mode for better performance
        this.db.pragma('foreign_keys = ON');
        this.db.pragma('journal_mode = WAL');
        
        this.initializeTables();
    }

    /**
     * Get singleton instance of DatabaseManager
     */
    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    /**
     * Initialize the database (creates singleton instance)
     */
    public static initialize(): void {
        DatabaseManager.getInstance();
    }

    /**
     * Get the database connection
     */
    public getDatabase(): Database.Database {
        return this.db;
    }

    /**
     * Initialize all required database tables
     */
    private initializeTables(): void {
        // Guild Configuration table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS guild_configs (
                guild_id TEXT PRIMARY KEY,
                category_id TEXT,
                panel_channel_id TEXT,
                transcript_channel_id TEXT,
                error_log_channel_id TEXT,
                support_role_ids TEXT, -- JSON array of role IDs
                ticket_counter INTEGER DEFAULT 0,
                cleanup_enabled BOOLEAN DEFAULT 0,
                cleanup_after_hours INTEGER DEFAULT 24,
                auto_close_inactive BOOLEAN DEFAULT 0,
                inactive_hours INTEGER DEFAULT 72,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tickets table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id TEXT NOT NULL,
                channel_id TEXT UNIQUE NOT NULL,
                user_id TEXT NOT NULL,
                ticket_number INTEGER NOT NULL,
                ticket_type TEXT NOT NULL,
                status TEXT DEFAULT 'open', -- open, closed, archived
                assigned_to TEXT, -- User ID of assigned support staff
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                closed_at DATETIME,
                closed_by TEXT,
                close_reason TEXT,
                FOREIGN KEY (guild_id) REFERENCES guild_configs(guild_id)
            )
        `);

        // Ticket Messages table for transcript generation
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS ticket_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_id INTEGER NOT NULL,
                message_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                username TEXT NOT NULL,
                content TEXT,
                attachments TEXT, -- JSON array of attachment URLs
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
            )
        `);

        // Close Requests table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS close_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_id INTEGER NOT NULL,
                requested_by TEXT NOT NULL,
                reason TEXT,
                status TEXT DEFAULT 'pending', -- pending, approved, denied
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                processed_at DATETIME,
                processed_by TEXT,
                FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
            )
        `);

        // Error Logs table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS error_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id TEXT,
                error_type TEXT NOT NULL,
                error_message TEXT NOT NULL,
                stack_trace TEXT,
                context TEXT, -- JSON object with additional context
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Statistics table
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS ticket_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                guild_id TEXT NOT NULL,
                date DATE NOT NULL,
                tickets_created INTEGER DEFAULT 0,
                tickets_closed INTEGER DEFAULT 0,
                avg_response_time INTEGER DEFAULT 0, -- in minutes
                avg_resolution_time INTEGER DEFAULT 0, -- in minutes
                UNIQUE(guild_id, date)
            )
        `);

        // Create indexes for better performance
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_tickets_guild_id ON tickets(guild_id);
            CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
            CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
            CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
            CREATE INDEX IF NOT EXISTS idx_close_requests_ticket_id ON close_requests(ticket_id);
            CREATE INDEX IF NOT EXISTS idx_error_logs_guild_id ON error_logs(guild_id);
            CREATE INDEX IF NOT EXISTS idx_ticket_stats_guild_date ON ticket_stats(guild_id, date);
        `);

        console.log('✅ Database tables initialized successfully');
    }

    /**
     * Close the database connection
     */
    public close(): void {
        if (this.db) {
            this.db.close();
        }
    }

    /**
     * Execute a transaction with automatic rollback on error
     */
    public transaction<T>(fn: (db: Database.Database) => T): T {
        const transaction = this.db.transaction(fn);
        return transaction(this.db);
    }
}