import { GuildConfigDAO } from '../database/GuildConfigDAO.js';
import { 
    SUPPORTED_LANGUAGES, 
    COMMAND_LOCALIZATIONS, 
    RESPONSE_MESSAGES, 
    WELCOME_MESSAGES,
    SupportedLanguage 
} from '../localization/index.js';

/**
 * Language Service for handling localization throughout the bot
 * Provides centralized access to localized text and command definitions
 */
export class LanguageService {
    private static instance: LanguageService;
    private guildConfigDAO: GuildConfigDAO;

    private constructor() {
        this.guildConfigDAO = new GuildConfigDAO();
    }

    public static getInstance(): LanguageService {
        if (!LanguageService.instance) {
            LanguageService.instance = new LanguageService();
        }
        return LanguageService.instance;
    }

    /**
     * Get the current language for a guild
     */
    public async getGuildLanguage(guildId: string): Promise<SupportedLanguage> {
        try {
            const config = await this.guildConfigDAO.getGuildConfig(guildId);
            const language = config?.language as SupportedLanguage;
            return language && this.isLanguageSupported(language) ? language : 'en';
        } catch (error) {
            console.error('Error getting guild language:', error);
            return 'en'; // Default to English on error
        }
    }

    /**
     * Set the language for a guild
     */
    public async setGuildLanguage(guildId: string, language: SupportedLanguage): Promise<void> {
        try {
            await this.guildConfigDAO.updateGuildConfig(guildId, { language });
        } catch (error) {
            console.error('Error setting guild language:', error);
            throw error;
        }
    }

    /**
     * Get localized command data for a specific language
     */
    public getLocalizedCommandData(commandName: string, language: SupportedLanguage = 'en'): any {
        const localizations = COMMAND_LOCALIZATIONS[language as keyof typeof COMMAND_LOCALIZATIONS];
        if (!localizations || !localizations[commandName as keyof typeof localizations]) {
            // Fallback to English if language not found
            return COMMAND_LOCALIZATIONS.en[commandName as keyof typeof COMMAND_LOCALIZATIONS.en];
        }
        return localizations[commandName as keyof typeof localizations];
    }

    /**
     * Get localized response message
     */
    public getLocalizedMessage(
        category: keyof typeof RESPONSE_MESSAGES.en,
        key: string,
        language: SupportedLanguage = 'en',
        replacements?: Record<string, string>
    ): string {
        const messages = RESPONSE_MESSAGES[language as keyof typeof RESPONSE_MESSAGES] || RESPONSE_MESSAGES.en;
        const categoryMessages = messages[category] as Record<string, string>;
        
        if (!categoryMessages || !categoryMessages[key]) {
            // Fallback to English
            const englishMessages = RESPONSE_MESSAGES.en[category] as Record<string, string>;
            const message = englishMessages[key] || key;
            return this.replacePlaceholders(message, replacements);
        }

        const message = categoryMessages[key];
        return this.replacePlaceholders(message, replacements);
    }

    /**
     * Get localized welcome message
     */
    public getLocalizedWelcomeMessage(language: SupportedLanguage = 'en'): any {
        return WELCOME_MESSAGES[language as keyof typeof WELCOME_MESSAGES] || WELCOME_MESSAGES.en;
    }

    /**
     * Get language information
     */
    public getLanguageInfo(language: SupportedLanguage) {
        return SUPPORTED_LANGUAGES[language];
    }

    /**
     * Get all supported languages
     */
    public getAllSupportedLanguages() {
        return SUPPORTED_LANGUAGES;
    }

    /**
     * Check if a language is supported
     */
    public isLanguageSupported(language: string): language is SupportedLanguage {
        return language in SUPPORTED_LANGUAGES;
    }

    /**
     * Get language choices for slash command options
     */
    public getLanguageChoices(language: SupportedLanguage = 'en') {
        const choices = Object.entries(SUPPORTED_LANGUAGES).map(([code, info]) => ({
            name: `${info.flag} ${info.name}`,
            value: code
        }));

        return choices;
    }

    /**
     * Get localized language list for display
     */
    public getLocalizedLanguageList(language: SupportedLanguage = 'en'): string {
        const languageList = Object.entries(SUPPORTED_LANGUAGES)
            .map(([code, info]) => `${info.flag} **${info.name}** (\`${code}\`)`)
            .join('\n');
        
        const commandName = this.getLocalizedCommandData('language', language).name;
        return this.getLocalizedMessage('success', 'availableLanguages', language, {
            list: languageList,
            command: `/${commandName}`
        });
    }

    /**
     * Replace placeholders in messages
     */
    private replacePlaceholders(message: string, replacements?: Record<string, string>): string {
        if (!replacements) return message;
        
        return message.replace(/\{(\w+)\}/g, (match, key) => {
            return replacements[key] || match;
        });
    }

    /**
     * Get localized error message
     */
    public getError(errorKey: string, language: SupportedLanguage = 'en'): string {
        return this.getLocalizedMessage('errors', errorKey, language);
    }

    /**
     * Get localized success message
     */
    public getSuccess(successKey: string, language: SupportedLanguage = 'en', replacements?: Record<string, string>): string {
        return this.getLocalizedMessage('success', successKey, language, replacements);
    }

    /**
     * Get localized command name
     */
    public getCommandName(commandName: string, language: SupportedLanguage = 'en'): string {
        const commandData = this.getLocalizedCommandData(commandName, language);
        return commandData?.name || commandName;
    }

    /**
     * Get localized command description
     */
    public getCommandDescription(commandName: string, language: SupportedLanguage = 'en'): string {
        const commandData = this.getLocalizedCommandData(commandName, language);
        return commandData?.description || commandName;
    }

    /**
     * Get localized subcommand data
     */
    public getSubcommandData(commandName: string, subcommandName: string, language: SupportedLanguage = 'en'): any {
        const commandData = this.getLocalizedCommandData(commandName, language);
        return commandData?.[subcommandName as keyof typeof commandData];
    }

    /**
     * Get localized option data
     */
    public getOptionData(commandName: string, subcommandName: string, optionName: string, language: SupportedLanguage = 'en'): any {
        const subcommandData = this.getSubcommandData(commandName, subcommandName, language);
        return subcommandData?.[optionName as keyof typeof subcommandData];
    }
}
