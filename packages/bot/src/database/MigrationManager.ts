import { Pool, PoolClient } from 'pg';
import fs from 'fs';
import path from 'path';

/**
 * Interface for migration metadata
 */
export interface Migration {
    id: string;
    name: string;
    executed_at?: Date;
}

/**
 * Migration Manager class for handling PostgreSQL database migrations
 * Provides migration execution, rollback, and seeding functionality
 */
export class MigrationManager {
    private static instance: MigrationManager;
    private pool: Pool;
    private migrationsPath: string;
    private seedsPath: string;

    private constructor() {
        // Initialize PostgreSQL connection pool
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // Set migration and seed paths
        // Use __dirname so that in development it resolves to src/database,
        // and in production it resolves to dist/database after compilation.
        const baseDir = __dirname;
        this.migrationsPath = path.join(baseDir, 'migrations');
        this.seedsPath = path.join(baseDir, 'seeds');

        // Ensure directories exist
        this.ensureDirectories();
    }

    /**
     * Get singleton instance of MigrationManager
     */
    public static getInstance(): MigrationManager {
        if (!MigrationManager.instance) {
            MigrationManager.instance = new MigrationManager();
        }
        return MigrationManager.instance;
    }

    /**
     * Initialize the migration system (creates singleton instance)
     */
    public static async initialize(): Promise<void> {
        const manager = MigrationManager.getInstance();
        await manager.createMigrationsTable();
    }

    /**
     * Get the database pool
     */
    public getPool(): Pool {
        return this.pool;
    }

    /**
     * Ensure migration and seed directories exist
     */
    private ensureDirectories(): void {
        if (!fs.existsSync(this.migrationsPath)) {
            fs.mkdirSync(this.migrationsPath, { recursive: true });
        }
        if (!fs.existsSync(this.seedsPath)) {
            fs.mkdirSync(this.seedsPath, { recursive: true });
        }
    }

    /**
     * Create the migrations tracking table
     */
    private async createMigrationsTable(): Promise<void> {
        const client = await this.pool.connect();
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS migrations (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Migrations table initialized successfully');
        } catch (error) {
            console.error('❌ Error creating migrations table:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get all executed migrations
     */
    public async getExecutedMigrations(): Promise<Migration[]> {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM migrations ORDER BY executed_at ASC');
            return result.rows;
        } catch (error) {
            console.error('❌ Error fetching executed migrations:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get all available migration files
     */
    public getAvailableMigrations(): string[] {
        if (!fs.existsSync(this.migrationsPath)) {
            return [];
        }
        
        return fs.readdirSync(this.migrationsPath)
            .filter(file => file.endsWith('.sql'))
            .sort();
    }

    /**
     * Run pending migrations
     */
    public async runMigrations(): Promise<void> {
        const executedMigrations = await this.getExecutedMigrations();
        const availableMigrations = this.getAvailableMigrations();
        const executedIds = new Set(executedMigrations.map(m => m.id));

        const pendingMigrations = availableMigrations.filter(file => {
            const id = path.basename(file, '.sql');
            return !executedIds.has(id);
        });

        if (pendingMigrations.length === 0) {
            console.log('✅ No pending migrations to run');
            return;
        }

        console.log(`🔄 Running ${pendingMigrations.length} pending migrations...`);

        for (const migrationFile of pendingMigrations) {
            await this.runMigration(migrationFile);
        }

        console.log('✅ All migrations completed successfully');
    }

    /**
     * Run a single migration
     */
    private async runMigration(migrationFile: string): Promise<void> {
        const migrationPath = path.join(this.migrationsPath, migrationFile);
        const migrationId = path.basename(migrationFile, '.sql');
        const migrationName = migrationId.replace(/^\d+_/, '');

        console.log(`🔄 Running migration: ${migrationId}`);

        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            // Read and execute migration SQL
            const sql = fs.readFileSync(migrationPath, 'utf8');
            await client.query(sql);

            // Record migration as executed
            await client.query(
                'INSERT INTO migrations (id, name) VALUES ($1, $2)',
                [migrationId, migrationName]
            );

            await client.query('COMMIT');
            console.log(`✅ Migration completed: ${migrationId}`);
        } catch (error) {
            await client.query('ROLLBACK');
            console.error(`❌ Migration failed: ${migrationId}`, error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Run database seeds
     */
    public async runSeeds(): Promise<void> {
        if (!fs.existsSync(this.seedsPath)) {
            console.log('✅ No seeds directory found, skipping seeding');
            return;
        }

        const seedFiles = fs.readdirSync(this.seedsPath)
            .filter(file => file.endsWith('.sql'))
            .sort();

        if (seedFiles.length === 0) {
            console.log('✅ No seed files found');
            return;
        }

        console.log(`🌱 Running ${seedFiles.length} seed files...`);

        for (const seedFile of seedFiles) {
            await this.runSeed(seedFile);
        }

        console.log('✅ All seeds completed successfully');
    }

    /**
     * Run a single seed file
     */
    private async runSeed(seedFile: string): Promise<void> {
        const seedPath = path.join(this.seedsPath, seedFile);
        const seedName = path.basename(seedFile, '.sql');

        console.log(`🌱 Running seed: ${seedName}`);

        const client = await this.pool.connect();
        try {
            const sql = fs.readFileSync(seedPath, 'utf8');
            await client.query(sql);
            console.log(`✅ Seed completed: ${seedName}`);
        } catch (error) {
            console.error(`❌ Seed failed: ${seedName}`, error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Test database connection
     */
    public async testConnection(): Promise<boolean> {
        try {
            const client = await this.pool.connect();
            await client.query('SELECT 1');
            client.release();
            console.log('✅ Database connection successful');
            return true;
        } catch (error) {
            console.error('❌ Database connection failed:', error);
            return false;
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
}