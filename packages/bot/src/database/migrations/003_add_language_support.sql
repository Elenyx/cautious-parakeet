-- Add language support to guild configurations
-- Migration: 003_add_language_support.sql

-- Add language column to guild_configs table
ALTER TABLE guild_configs ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';

-- Create index for language column
CREATE INDEX IF NOT EXISTS idx_guild_configs_language ON guild_configs(language);

-- Update existing records to have default language
UPDATE guild_configs SET language = 'en' WHERE language IS NULL;
