-- Initial seed data for TicketMesh
-- This file contains sample data for testing purposes

-- Note: This is a sample seed file
-- In production, you might want to seed with default configurations
-- or leave this empty and let the bot create configurations as needed

-- Example: Insert a default guild configuration (uncomment and modify as needed)
-- INSERT INTO guild_configs (
--     guild_id,
--     support_role_ids,
--     ticket_counter,
--     cleanup_enabled,
--     cleanup_after_hours,
--     auto_close_inactive,
--     inactive_hours
-- ) VALUES (
--     'YOUR_GUILD_ID_HERE',
--     '[]',
--     0,
--     FALSE,
--     24,
--     FALSE,
--     72
-- ) ON CONFLICT (guild_id) DO NOTHING;

-- You can add more seed data here as needed
-- For example, default ticket types, common configurations, etc.

-- Log that seeding is complete
INSERT INTO error_logs (
    error_type,
    error_message,
    context
) VALUES (
    'SYSTEM',
    'Database seeding completed successfully',
    '{"timestamp": "' || CURRENT_TIMESTAMP || '", "type": "seed_completion"}'
);