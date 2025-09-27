# TicketMesh Language System

## Overview

The TicketMesh bot now includes a comprehensive language system that allows users to interact with the bot in their preferred language. When a user selects a language from the welcome message or sets it via the `/language` command, all bot interactions including slash commands will be displayed in that language.

## Features

- **10 Supported Languages**: English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, and Chinese
- **Dynamic Command Localization**: Slash command names and descriptions change based on the selected language
- **Localized Responses**: All bot messages, errors, and success responses are displayed in the selected language
- **Welcome Message Localization**: The welcome message adapts to show content in the selected language
- **Automatic Command Re-registration**: Commands are automatically updated when language changes

## How It Works

### 1. Language Selection

Users can change the bot language in two ways:

#### Via Welcome Message
- The welcome message includes a language selector dropdown
- Users can select their preferred language from the dropdown
- The language change is applied immediately

#### Via Slash Command
- Use `/language set <language>` to change the language
- Use `/language current` to see the current language
- Use `/language list` to see all available languages

### 2. Language Storage

- Language preferences are stored in the database per guild
- Each guild can have its own language setting
- Default language is English if no language is set

### 3. Dynamic Command Updates

When a language is changed:
1. The guild's language preference is updated in the database
2. All slash commands for that guild are re-registered with localized names and descriptions
3. Future interactions will use the new language

## Technical Implementation

### Core Components

#### 1. LanguageService (`src/utils/LanguageService.ts`)
- Centralized service for language management
- Handles language retrieval and storage
- Provides localized text and command data
- Manages language validation and fallbacks

#### 2. LocalizedCommandBuilder (`src/utils/LocalizedCommandBuilder.ts`)
- Builder pattern for creating localized slash commands
- Automatically applies language-specific names and descriptions
- Handles subcommands and options localization

#### 3. CommandRegistrationManager (`src/utils/CommandRegistrationManager.ts`)
- Manages dynamic command registration
- Updates commands when language changes
- Handles both global and guild-specific command registration

#### 4. Language Files (`src/localization/languages.ts`)
- Contains all localized text and command definitions
- Organized by language and category
- Includes command names, descriptions, and response messages

### Language File Structure

```typescript
export const COMMAND_LOCALIZATIONS = {
    en: {
        language: {
            name: 'language',
            description: 'Manage bot language settings',
            set: {
                name: 'set',
                description: 'Set the bot language for this server'
            }
        }
        // ... other commands
    },
    es: {
        language: {
            name: 'idioma',
            description: 'Gestionar configuración de idioma del bot',
            set: {
                name: 'establecer',
                description: 'Establecer el idioma del bot para este servidor'
            }
        }
        // ... other commands
    }
    // ... other languages
};
```

## Usage Examples

### Creating a Localized Command

```typescript
import { LocalizedCommandBuilder } from '../utils/LocalizedCommandBuilder.js';

export const data = new LocalizedCommandBuilder('myCommand')
    .setLocalizedInfo('en') // Default language for initial registration
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addLocalizedSubcommand('subcommand', 'en')
    .build();
```

### Using LanguageService in Commands

```typescript
import { LanguageService } from '../utils/LanguageService.js';

export async function execute(interaction: ChatInputCommandInteraction) {
    const languageService = LanguageService.getInstance();
    const currentLanguage = await languageService.getGuildLanguage(interaction.guildId!);
    
    // Get localized error message
    const errorMessage = languageService.getError('permissionDenied', currentLanguage);
    
    // Get localized success message with replacements
    const successMessage = languageService.getSuccess('operationComplete', currentLanguage, {
        operation: 'ticket creation'
    });
}
```

### Adding New Languages

1. Add the language to `SUPPORTED_LANGUAGES` in `languages.ts`
2. Add command localizations for the new language
3. Add response messages for the new language
4. Add welcome message content for the new language

## Command Localization

### English Commands
- `/language` - Manage bot language settings
- `/help` - Get help and usage instructions
- `/setup-wizard` - Interactive setup wizard
- `/support-roles` - Manage support staff roles
- `/stats` - View ticket statistics
- `/debug` - Debug information
- `/userinfo` - Get user information
- `/messageinfo` - Get message information

### Spanish Commands
- `/idioma` - Gestionar configuración de idioma del bot
- `/ayuda` - Obtener ayuda e instrucciones de uso
- `/configuracion-asistente` - Asistente de configuración interactivo
- `/roles-soporte` - Gestionar roles de personal de soporte
- `/estadisticas` - Ver estadísticas de tickets
- `/depuracion` - Información de depuración
- `/info-usuario` - Obtener información del usuario
- `/informacion-mensaje` - Obtener información del mensaje

## Response Messages

All bot responses are localized, including:

- Error messages
- Success messages
- Help text
- Command descriptions
- Welcome messages
- Component interactions

## Database Schema

The language system uses the existing `guild_configs` table with the `language` column:

```sql
ALTER TABLE guild_configs ADD COLUMN language VARCHAR(10) DEFAULT 'en';
```

## Best Practices

### For Developers

1. **Always use LanguageService**: Don't hardcode text in commands
2. **Provide fallbacks**: Always fallback to English if a language is not available
3. **Use placeholders**: Use `{variable}` syntax for dynamic content
4. **Test all languages**: Ensure all languages work correctly
5. **Update all components**: Don't forget to localize component interactions

### For Users

1. **Language persistence**: Language settings persist across bot restarts
2. **Guild-specific**: Each server can have its own language setting
3. **Immediate effect**: Language changes take effect immediately
4. **Command updates**: Commands will update to show in the new language

## Troubleshooting

### Common Issues

1. **Commands not updating**: Check if CommandRegistrationManager is initialized
2. **Missing translations**: Ensure all languages have complete translations
3. **Database errors**: Verify the language column exists in guild_configs
4. **Permission errors**: Ensure bot has proper permissions to register commands

### Debug Commands

- Use `/debug` to check system status
- Check console logs for command registration errors
- Verify database connection and language storage

## Future Enhancements

- User-specific language preferences (not just guild-wide)
- More languages support
- Automatic language detection
- Translation quality improvements
- Voice command localization

## Contributing

To add support for a new language:

1. Add language to `SUPPORTED_LANGUAGES`
2. Create complete translations in `COMMAND_LOCALIZATIONS`
3. Add response messages in `RESPONSE_MESSAGES`
4. Add welcome message content in `WELCOME_MESSAGES`
5. Test all functionality in the new language
6. Update documentation

## Support

For issues with the language system:
- Check the console logs for errors
- Verify database connectivity
- Ensure all required environment variables are set
- Contact support through the Discord server
