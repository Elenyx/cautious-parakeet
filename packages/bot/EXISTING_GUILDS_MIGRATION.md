# Language Switching for Existing Guilds

## Overview

This document explains how the language switching system works for bots that are already in guilds before the language switching update is deployed.

## How It Works for Existing Guilds

### 1. **Automatic Fallback System**

The language switching system is designed to work seamlessly with existing guilds through a robust fallback mechanism:

```typescript
// In LanguageService.getGuildLanguage()
public async getGuildLanguage(guildId: string): Promise<SupportedLanguage> {
    try {
        const config = await this.guildConfigDAO.getGuildLanguage(guildId);
        const language = config?.language as SupportedLanguage;
        return language && this.isLanguageSupported(language) ? language : 'en';
    } catch (error) {
        console.error('Error getting guild language:', error);
        return 'en'; // Default to English on error
    }
}
```

**Key Points:**
- ✅ **Existing guilds without language configuration automatically default to English**
- ✅ **No errors or crashes occur for guilds without language settings**
- ✅ **All commands work immediately, even without explicit language configuration**

### 2. **Database Schema Compatibility**

The `upsertGuildConfig` method uses `COALESCE` to handle existing guilds gracefully:

```sql
language = COALESCE(EXCLUDED.language, guild_configs.language)
```

This means:
- ✅ **Existing guilds keep their current configuration**
- ✅ **New language field is added without breaking existing data**
- ✅ **Guilds without language field get `NULL` (which defaults to English)**

### 3. **Command Registration**

For existing guilds, the system works as follows:

1. **First Interaction**: When a user first uses a command after the update:
   - System detects no language configuration
   - Automatically defaults to English
   - Commands work normally in English

2. **Language Change**: When a user runs `/language set`:
   - Language is saved to database
   - Commands are re-registered in the new language
   - All future interactions use the new language

## Migration Options

### Option 1: Automatic (Recommended)

**No action required!** The system automatically handles existing guilds:

- ✅ Existing guilds work immediately with English as default
- ✅ Users can change language anytime using `/language set`
- ✅ No downtime or manual intervention needed
- ✅ Zero risk of breaking existing functionality

### Option 2: Proactive Migration

If you want to ensure all existing guilds have explicit language configuration, run the migration script:

```bash
cd packages/bot
node migrate-existing-guilds.js
```

This script will:
- ✅ Check all existing guilds in the database
- ✅ Set default language to 'en' for guilds without language configuration
- ✅ Register commands for all existing guilds
- ✅ Provide detailed migration report

## What Happens When Users Use Commands

### Before Language is Set

1. **User runs any command** (e.g., `/help`)
2. **System detects no language configuration**
3. **Automatically uses English**
4. **Command works normally**
5. **User sees English responses**

### After Language is Set

1. **User runs `/language set language:Korean`**
2. **System saves Korean as guild language**
3. **Commands are re-registered in Korean**
4. **All future commands use Korean**
5. **User sees Korean responses**

## Example Timeline

### Day 1: Update Deployed
- ✅ Bot restarts with new language switching code
- ✅ All existing guilds continue working in English
- ✅ No user-facing changes or errors

### Day 2: User Discovers Language Feature
- ✅ User runs `/language list` (works in English)
- ✅ User sees available languages
- ✅ User runs `/language set language:Korean`
- ✅ Commands immediately switch to Korean

### Day 3: Full Korean Experience
- ✅ All commands show in Korean (`/언어`, `/도움말`, etc.)
- ✅ All responses are in Korean
- ✅ Other users in the guild see Korean commands too

## Technical Details

### Database Changes

The language field is added to the `guild_configs` table:

```sql
ALTER TABLE guild_configs ADD COLUMN language VARCHAR(10) DEFAULT 'en';
```

### Command Registration

Commands are registered per-guild using Discord's guild command system:

```typescript
// For existing guilds without language config
const language = await languageService.getGuildLanguage(guildId); // Returns 'en'
await commandManager.registerCommandsForLanguage(language, guildId);
```

### Error Handling

The system includes comprehensive error handling:

- ✅ **Database errors**: Fallback to English
- ✅ **Missing configuration**: Default to English  
- ✅ **Invalid language codes**: Fallback to English
- ✅ **Command registration failures**: Logged but don't break functionality

## Benefits for Existing Guilds

### Immediate Benefits
- ✅ **Zero downtime**: All existing functionality continues working
- ✅ **No configuration needed**: Works out of the box
- ✅ **Backward compatible**: No breaking changes

### New Capabilities
- ✅ **Language switching**: Users can change language anytime
- ✅ **Localized commands**: Commands appear in selected language
- ✅ **Localized responses**: All messages in selected language
- ✅ **Per-guild settings**: Each server can have its own language

## Troubleshooting

### Commands Not Working
- ✅ **Check bot permissions**: Ensure bot has proper permissions
- ✅ **Verify database connection**: Check database connectivity
- ✅ **Check logs**: Look for error messages in console

### Language Not Changing
- ✅ **Verify language code**: Ensure language code is supported
- ✅ **Check permissions**: User needs Manage Server permission
- ✅ **Try again**: Sometimes Discord API has delays

### Missing Translations
- ✅ **All 10 languages are fully translated**
- ✅ **System falls back to English for any missing translations**
- ✅ **Report any issues for future updates**

## Summary

**For existing guilds, the language switching system:**

✅ **Works immediately** - No setup or configuration required
✅ **Defaults to English** - All existing functionality preserved  
✅ **Enables language switching** - Users can change language anytime
✅ **Zero risk** - No chance of breaking existing functionality
✅ **Seamless experience** - Users can discover and use the feature naturally

The system is designed to be **completely backward compatible** while adding powerful new multilingual capabilities.
