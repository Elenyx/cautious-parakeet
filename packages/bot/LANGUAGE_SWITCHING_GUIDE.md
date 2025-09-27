# Language Switching System Guide

## Overview

The TicketMesh bot features a comprehensive automatic language switching system that allows users to change the bot's language and have all commands, descriptions, and responses automatically update to the selected language.

## How It Works

### 1. Language Selection
Users can change the bot's language using the `/language set` command:
```
/language set language:Korean
```

### 2. Automatic Command Updates
When a language is selected, the bot automatically:
- Updates the guild's language setting in the database
- Re-registers all slash commands for that guild in the new language
- Updates command names, descriptions, subcommands, and options
- All future interactions use the new language automatically

### 3. Real-time Language Usage
The bot automatically uses the guild's configured language for:
- All slash command interactions
- Context menu commands (user info, message info)
- Response messages and error messages
- Help system and documentation

## Supported Languages

The bot supports 10 languages:

| Language | Code | Flag | Native Name |
|----------|------|------|-------------|
| English | `en` | 🇺🇸 | English |
| Spanish | `es` | 🇪🇸 | Español |
| French | `fr` | 🇫🇷 | Français |
| German | `de` | 🇩🇪 | Deutsch |
| Italian | `it` | 🇮🇹 | Italiano |
| Portuguese | `pt` | 🇵🇹 | Português |
| Russian | `ru` | 🇷🇺 | Русский |
| Japanese | `ja` | 🇯🇵 | 日本語 |
| Korean | `ko` | 🇰🇷 | 한국어 |
| Chinese | `zh` | 🇨🇳 | 中文 |

## Example: English to Korean Switch

### Before (English)
```
/language - Manage bot language settings
/help - Get help and usage instructions for TicketMesh
/stats - View ticket statistics and analytics
```

### After (Korean)
```
/언어 - 봇 언어 설정 관리
/도움말 - TicketMesh에 대한 도움말 및 사용 지침 가져오기
/통계 - 티켓 통계 및 분석 보기
```

## Technical Implementation

### Command Registration
- Commands are registered per-guild using Discord's guild command system
- When language changes, `CommandRegistrationManager.updateGuildCommands()` is called
- All commands are rebuilt with localized names and descriptions
- The process is instant and requires no bot restart

### Language Detection
- Each command automatically detects the guild's language using `LanguageService.getGuildLanguage()`
- Commands use the `CommandLanguageHelper` utility for consistent language handling
- Fallback to English if language detection fails

### Response Localization
- All response messages are automatically localized
- Error messages, success messages, and help text use the guild's language
- Placeholder replacement works in all languages

## Commands That Support Language Switching

All slash commands support language switching:

- **Language Command** (`/language`) - Manage language settings
- **Help Command** (`/help`) - Get help and usage instructions
- **Setup Wizard** (`/setup-wizard`) - Interactive setup wizard
- **Support Roles** (`/support-roles`) - Manage support staff roles
- **Stats Command** (`/stats`) - View ticket statistics
- **Debug Command** (`/debug`) - Debug and test functionality

## Context Menu Commands

Context menu commands also support language switching:
- **User Info** - Right-click on a user → Apps → User Info
- **Message Info** - Right-click on a message → Apps → Message Info

## Benefits

✅ **Instant Language Switching** - No bot restart required
✅ **Complete Localization** - All commands, descriptions, and responses
✅ **Automatic Detection** - Bot automatically uses the selected language
✅ **Seamless Experience** - Users see commands in their preferred language
✅ **Per-Guild Settings** - Each server can have its own language
✅ **Fallback Support** - Graceful fallback to English if issues occur

## Usage Examples

### Setting Language
```
/language set language:Korean
✅ 봇 언어가 이 서버에서 🇰🇷 한국어로 설정되었습니다.
```

### Viewing Current Language
```
/language current
🌐 현재 봇 언어: 🇰🇷 한국어
```

### Listing Available Languages
```
/language list
🌐 사용 가능한 언어:

🇺🇸 **English** (`en`)
🇪🇸 **Español** (`es`)
🇫🇷 **Français** (`fr`)
🇩🇪 **Deutsch** (`de`)
🇮🇹 **Italiano** (`it`)
🇵🇹 **Português** (`pt`)
🇷🇺 **Русский** (`ru`)
🇯🇵 **日本語** (`ja`)
🇰🇷 **한국어** (`ko`)
🇨🇳 **中文** (`zh`)

봇 언어를 변경하려면 `/언어 설정`을 사용하세요.
```

## Troubleshooting

### Commands Not Updating
- Ensure the bot has proper permissions in the server
- Check that the language was set successfully using `/language current`
- Try setting the language again

### Language Not Detected
- The bot will automatically fallback to English
- Check server permissions and bot status
- Verify the language code is supported

### Missing Translations
- All supported languages have complete translations
- If you notice missing translations, please report them
- The bot will fallback to English for any missing translations

## Development Notes

The language switching system is built with:
- **CommandRegistrationManager** - Handles command registration and updates
- **LanguageService** - Manages language detection and localization
- **CommandLanguageHelper** - Provides utilities for consistent language handling
- **LocalizedCommandBuilder** - Builds commands with proper localization

All components work together to provide a seamless multilingual experience.
