# Localization System

This directory contains the complete localization system for TicketMesh, supporting 10 languages with full translations for all bot features.

## File Structure

```
localization/
├── index.ts           # Main export file - aggregates all language data
├── en.ts             # English translations (all features)
├── es.ts             # Spanish translations (all features)
├── fr.ts             # French translations (all features)
├── de.ts             # German translations (all features)
├── it.ts             # Italian translations (all features)
├── pt.ts             # Portuguese translations (all features)
├── ru.ts             # Russian translations (all features)
├── ja.ts             # Japanese translations (all features)
├── ko.ts             # Korean translations (all features)
├── zh.ts             # Chinese translations (all features)
├── constants.ts      # Language constants and metadata
└── README.md         # This documentation file
```

## Supported Languages

- 🇺🇸 **English** (en) - Default language
- 🇪🇸 **Español** (es) - Spanish
- 🇫🇷 **Français** (fr) - French
- 🇩🇪 **Deutsch** (de) - German
- 🇮🇹 **Italiano** (it) - Italian
- 🇵🇹 **Português** (pt) - Portuguese
- 🇷🇺 **Русский** (ru) - Russian
- 🇯🇵 **日本語** (ja) - Japanese
- 🇰🇷 **한국어** (ko) - Korean
- 🇨🇳 **中文** (zh) - Chinese

## Usage

### Importing Localization Data

```typescript
import { 
    SUPPORTED_LANGUAGES, 
    COMMAND_LOCALIZATIONS, 
    RESPONSE_MESSAGES, 
    WELCOME_MESSAGES,
    SupportedLanguage,
    LanguageService 
} from '../localization/index.js';
```

### Using the Language Service

```typescript
const languageService = LanguageService.getInstance();

// Get guild language
const language = await languageService.getGuildLanguage(guildId);

// Get localized message
const message = languageService.getLocalizedMessage('errors', 'permissionDenied', language);

// Get localized command data
const commandData = languageService.getLocalizedCommandData('help', language);
```

## File Descriptions

### Language Files (`en.ts`, `es.ts`, etc.)
Each language file contains all translations for that specific language:
- **Language info**: Name, flag, native name
- **Commands**: All command names, descriptions, subcommands, and options
- **Responses**: Error messages, success messages, and language choices
- **Welcome**: Welcome message content, features, and quick start information

### `index.ts`
Main export file that aggregates all language data and re-exports:
- `SUPPORTED_LANGUAGES` - Language metadata for all languages
- `COMMAND_LOCALIZATIONS` - All command translations organized by language
- `RESPONSE_MESSAGES` - All response messages organized by language
- `WELCOME_MESSAGES` - All welcome messages organized by language
- `LanguageService` - The main service class for accessing translations

## Adding New Languages

1. Create a new language file (e.g., `nl.ts` for Dutch)
2. Copy the structure from `en.ts` and translate all content
3. Add the language to the imports and exports in `index.ts`
4. Update the `SupportedLanguage` type in `index.ts`

## Translation Guidelines

- Use native language names and appropriate flags
- Maintain consistency in terminology across all files
- Include proper emoji usage for visual appeal
- Test all translations for accuracy and cultural appropriateness
- Keep command names concise but descriptive
- Use clear, user-friendly error and success messages

## Benefits of Language-Based Structure

### Scalability
- **Manageable file sizes**: Each language file stays ~200-300 lines
- **Easy to add features**: Just add to each language file
- **No merge conflicts**: Different translators can work on different language files
- **Better organization**: All translations for a language are in one place

### Development Workflow
- **Translation teams**: Each translator works on their language file
- **Feature development**: Add new commands/features to all language files
- **Maintenance**: Easy to update specific languages without affecting others
- **Testing**: Can test individual languages independently

### Future Growth
- **Adding commands**: 10 new commands = 10 entries per language file (not 100 entries in one file)
- **Adding languages**: Just create one new file per language
- **Performance**: Better tree-shaking and loading performance
- **Collaboration**: Multiple developers can work simultaneously without conflicts

## Maintenance

- Each language file is self-contained with all translations
- Changes to features should be applied to all language files for consistency
- Regular review of translations for accuracy and cultural sensitivity
- Version control all changes to track translation updates
- Use the existing language files as templates for new languages
