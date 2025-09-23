#!/usr/bin/env node

import { config } from 'dotenv';
import { PostgreSQLManager } from '../database/PostgreSQLManager';
import { MigrationManager } from '../database/MigrationManager';

// Load environment variables
config();

/**
 * CLI script for running database migrations and seeds
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable is required');
        process.exit(1);
    }

    try {
        switch (command) {
            case 'migrate':
                await runMigrations();
                break;
            case 'seed':
                await runSeeds();
                break;
            case 'migrate:seed':
            case 'setup':
                await runMigrations();
                await runSeeds();
                break;
            case 'test':
                await testConnection();
                break;
            default:
                showHelp();
                break;
        }
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

/**
 * Run database migrations
 */
async function runMigrations(): Promise<void> {
    console.log('🔄 Starting database migrations...');
    
    const migrationManager = MigrationManager.getInstance();
    
    // Test connection first
    const connected = await migrationManager.testConnection();
    if (!connected) {
        throw new Error('Failed to connect to database');
    }

    // Initialize migration system
    await MigrationManager.initialize();
    
    // Run migrations
    await migrationManager.runMigrations();
    
    await migrationManager.close();
    console.log('✅ Migrations completed successfully');
}

/**
 * Run database seeds
 */
async function runSeeds(): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    const postgresManager = PostgreSQLManager.getInstance();
    await postgresManager.runSeeds();
    await postgresManager.close();
    
    console.log('✅ Seeding completed successfully');
}

/**
 * Test database connection
 */
async function testConnection(): Promise<void> {
    console.log('🔄 Testing database connection...');
    
    const migrationManager = MigrationManager.getInstance();
    const connected = await migrationManager.testConnection();
    await migrationManager.close();
    
    if (connected) {
        console.log('✅ Database connection successful');
    } else {
        throw new Error('Database connection failed');
    }
}

/**
 * Show help information
 */
function showHelp(): void {
    console.log(`
TicketMesh Database Migration Tool

Usage:
  npm run migrate <command>

Commands:
  migrate       Run pending database migrations
  seed          Run database seeds
  migrate:seed  Run migrations and then seeds (alias: setup)
  test          Test database connection
  help          Show this help message

Examples:
  npm run migrate migrate       # Run migrations only
  npm run migrate seed          # Run seeds only
  npm run migrate setup         # Run migrations and seeds
  npm run migrate test          # Test connection

Environment Variables:
  DATABASE_URL  PostgreSQL connection string (required)

Database URL Format:
  postgresql://username:password@host:port/database
  
Example:
  DATABASE_URL=postgresql://postgres:password@localhost:5432/ticketmesh
    `);
}

// Run the CLI
if (require.main === module) {
    main().catch(error => {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    });
}