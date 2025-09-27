import { ChatInputCommandInteraction, UserContextMenuCommandInteraction, MessageContextMenuCommandInteraction } from 'discord.js';
import { LanguageService } from './LanguageService.js';
import { SupportedLanguage } from '../localization/index.js';

/**
 * Helper utility for getting the appropriate language for command interactions
 * This ensures all commands automatically use the guild's configured language
 */
export class CommandLanguageHelper {
    private static languageService: LanguageService;

    static {
        this.languageService = LanguageService.getInstance();
    }

    /**
     * Get the appropriate language for a slash command interaction
     * Returns the guild's configured language or 'en' as fallback
     */
    public static async getInteractionLanguage(interaction: ChatInputCommandInteraction): Promise<SupportedLanguage> {
        if (!interaction.guildId) {
            return 'en'; // Default to English for DM interactions
        }

        try {
            return await this.languageService.getGuildLanguage(interaction.guildId);
        } catch (error) {
            console.error('Error getting guild language:', error);
            return 'en'; // Fallback to English on error
        }
    }

    /**
     * Get the appropriate language for a user context menu interaction
     * Returns the guild's configured language or 'en' as fallback
     */
    public static async getUserContextLanguage(interaction: UserContextMenuCommandInteraction): Promise<SupportedLanguage> {
        if (!interaction.guildId) {
            return 'en'; // Default to English for DM interactions
        }

        try {
            return await this.languageService.getGuildLanguage(interaction.guildId);
        } catch (error) {
            console.error('Error getting guild language:', error);
            return 'en'; // Fallback to English on error
        }
    }

    /**
     * Get the appropriate language for a message context menu interaction
     * Returns the guild's configured language or 'en' as fallback
     */
    public static async getMessageContextLanguage(interaction: MessageContextMenuCommandInteraction): Promise<SupportedLanguage> {
        if (!interaction.guildId) {
            return 'en'; // Default to English for DM interactions
        }

        try {
            return await this.languageService.getGuildLanguage(interaction.guildId);
        } catch (error) {
            console.error('Error getting guild language:', error);
            return 'en'; // Fallback to English on error
        }
    }

    /**
     * Get the appropriate language for any interaction type
     * Returns the guild's configured language or 'en' as fallback
     */
    public static async getLanguage(interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction): Promise<SupportedLanguage> {
        if (!interaction.guildId) {
            return 'en'; // Default to English for DM interactions
        }

        try {
            return await this.languageService.getGuildLanguage(interaction.guildId);
        } catch (error) {
            console.error('Error getting guild language:', error);
            return 'en'; // Fallback to English on error
        }
    }

    /**
     * Get localized error message for the interaction's language
     */
    public static async getLocalizedError(interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction, errorKey: string): Promise<string> {
        const language = await this.getLanguage(interaction);
        return this.languageService.getError(errorKey, language);
    }

    /**
     * Get localized success message for the interaction's language
     */
    public static async getLocalizedSuccess(interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction, successKey: string, replacements?: Record<string, string>): Promise<string> {
        const language = await this.getLanguage(interaction);
        return this.languageService.getSuccess(successKey, language, replacements);
    }

    /**
     * Get localized message for the interaction's language
     */
    public static async getLocalizedMessage(
        interaction: ChatInputCommandInteraction | UserContextMenuCommandInteraction | MessageContextMenuCommandInteraction, 
        category: 'errors' | 'success', 
        key: string, 
        replacements?: Record<string, string>
    ): Promise<string> {
        const language = await this.getLanguage(interaction);
        return this.languageService.getLocalizedMessage(category, key, language, replacements);
    }
}
