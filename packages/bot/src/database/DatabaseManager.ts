import { Pool, PoolClient, QueryResult } from 'pg';
import { MigrationManager } from './MigrationManager';

/**
 * PostgreSQL Database Manager class for handling database operations
 * Provides connection management and replaces SQLite DatabaseManager
 */
export class DatabaseManager {
    private static instance: DatabaseManager;
    private pool: Pool;
    private migrationManager: MigrationManager;

    private constructor() {
        // Initialize PostgreSQL connection pool
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // Initialize migration manager
        this.migrationManager = MigrationManager.getInstance();
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
     * Initialize the database (creates singleton instance and runs migrations)
     */
    public static async initialize(): Promise<void> {
        const manager = DatabaseManager.getInstance();
        
        // Test connection
        const connected = await manager.migrationManager.testConnection();
        if (!connected) {
            throw new Error('Failed to connect to PostgreSQL database');
        }

        // Initialize migration system
        await MigrationManager.initialize();
        
        // Run pending migrations
        await manager.migrationManager.runMigrations();
        
        console.log('✅ PostgreSQL database initialized successfully');
    }

    /**
     * Get the database pool
     */
    public getPool(): Pool {
        return this.pool;
    }

    /**
     * Get a database client from the pool
     */
    public async getClient(): Promise<PoolClient> {
        return await this.pool.connect();
    }

    /**
     * Execute a query with automatic client management
     */
    public async query(text: string, params?: unknown[]): Promise<QueryResult> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }

    /**
     * Close the database connection pool
     */
    public async close(): Promise<void> {
        await this.pool.end();
    }

    /**
     * Execute a transaction with automatic rollback on error
     */
    public async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            const result = await fn(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Run database seeds
     */
    public async runSeeds(): Promise<void> {
        await this.migrationManager.runSeeds();
    }

    /**
     * Get migration manager instance
     */
    public getMigrationManager(): MigrationManager {
        return this.migrationManager;
    }
}