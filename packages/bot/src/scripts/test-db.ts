#!/usr/bin/env node

import { config } from 'dotenv';
import { DatabaseManager } from '../database/DatabaseManager';
import { GuildConfigDAO } from '../database/GuildConfigDAO';

// Load environment variables
config();

/**
 * Interface for table information row
 */
interface TableRow {
    table_name: string;
}

/**
 * Interface for migration row
 */
interface MigrationRow {
    id: string;
    name: string;
    executed_at: string;
}

/**
 * Test script for verifying PostgreSQL setup and DAO functionality
 */
async function main() {
    console.log('🧪 Starting database tests...');

    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL environment variable is required');
        process.exit(1);
    }

    try {
        // Test 1: Database connection
        console.log('\n1️⃣ Testing database connection...');
        const dbManager = DatabaseManager.getInstance();
        const result = await dbManager.query('SELECT NOW() as current_time');
        console.log('✅ Database connected successfully');
        console.log(`   Current time: ${result.rows[0].current_time}`);

        // Test 2: Check tables exist
        console.log('\n2️⃣ Checking if tables exist...');
        const tablesResult = await dbManager.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        const tables = tablesResult.rows.map((row: TableRow) => row.table_name);
        console.log('✅ Tables found:', tables);

        // Test 3: Test GuildConfigDAO
        console.log('\n3️⃣ Testing GuildConfigDAO...');
        const guildConfigDAO = new GuildConfigDAO();
        
        // Create a test guild config
        const testGuildId = 'test_guild_123456789';
        const testConfig = await guildConfigDAO.upsertGuildConfig({
            guild_id: testGuildId,
            support_role_ids: ['role1', 'role2'],
            ticket_counter: 0,
            cleanup_enabled: true,
            cleanup_after_hours: 48,
            auto_close_inactive: false,
            inactive_hours: 72
        });
        console.log('✅ Guild config created:', testConfig.guild_id);

        // Retrieve the config
        const retrievedConfig = await guildConfigDAO.getGuildConfig(testGuildId);
        console.log('✅ Guild config retrieved:', retrievedConfig?.guild_id);

        // Update the config
        const updatedConfig = await guildConfigDAO.updateGuildConfig(testGuildId, {
            ticket_counter: 5,
            support_role_ids: ['role1', 'role2', 'role3']
        });
        console.log('✅ Guild config updated, ticket counter:', updatedConfig?.ticket_counter);

        // Increment counter
        const newCounter = await guildConfigDAO.incrementTicketCounter(testGuildId);
        console.log('✅ Ticket counter incremented to:', newCounter);

        // Clean up test data
        const deleted = await guildConfigDAO.deleteGuildConfig(testGuildId);
        console.log('✅ Test guild config deleted:', deleted);

        // Test 4: Check migrations table
        console.log('\n4️⃣ Checking migrations...');
        const migrationsResult = await dbManager.query('SELECT * FROM migrations ORDER BY executed_at');
        console.log('✅ Executed migrations:');
        migrationsResult.rows.forEach((migration: MigrationRow) => {
            console.log(`   - ${migration.id}: ${migration.name} (${migration.executed_at})`);
        });

        // Close connection
        await dbManager.close();
        console.log('\n✅ All tests passed successfully!');

    } catch (error: unknown) {
        console.error('\n❌ Test failed:', error);
        process.exit(1);
    }
}

// Run the test
if (require.main === module) {
    main().catch((error: unknown) => {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    });
}