import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    StringSelectMenuInteraction,
    ComponentType,
    MessageFlags
} from 'discord.js';
import { GuildConfigDAO } from '../database/GuildConfigDAO.js';
import { WelcomeMessageBuilder, SUPPORTED_LANGUAGES, SupportedLanguage } from '../utils/WelcomeMessageBuilder.js';
import { ErrorLogger } from '../utils/ErrorLogger.js';
import { LanguageService } from '../utils/LanguageService.js';
import { LocalizedCommandBuilder } from '../utils/LocalizedCommandBuilder.js';
import { CommandRegistrationManager } from '../utils/CommandRegistrationManager.js';

// Create localized command data - will be dynamically updated based on guild language
export const data = new LocalizedCommandBuilder('language')
    .setLocalizedInfo('en') // Default to English for initial registration
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addLocalizedSubcommand('set', 'en', (subcommand) => {
        return subcommand.addStringOption(option => {
            const languageService = LanguageService.getInstance();
            const choices = languageService.getLanguageChoices('en');
            
            return option
                .setName('language')
                .setDescription('The language to set')
                .setRequired(true)
                .addChoices(...choices);
        });
    })
    .addLocalizedSubcommand('current', 'en')
    .addLocalizedSubcommand('list', 'en')
    .build();

export async function execute(interaction: ChatInputCommandInteraction) {
    const errorLogger = ErrorLogger.getInstance();
    const languageService = LanguageService.getInstance();
    
    try {
        if (!interaction.guildId) {
            const errorMessage = languageService.getError('serverOnly');
            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
            return;
        }

        // Get the current guild language
        const currentLanguage = await languageService.getGuildLanguage(interaction.guildId);
        const subcommand = interaction.options.getSubcommand();
        const guildConfigDAO = new GuildConfigDAO();

        switch (subcommand) {
            case 'set':
                await handleSetLanguage(interaction, guildConfigDAO, languageService, currentLanguage);
                break;
            case 'current':
                await handleCurrentLanguage(interaction, guildConfigDAO, languageService, currentLanguage);
                break;
            case 'list':
                await handleListLanguages(interaction, languageService, currentLanguage);
                break;
            default:
                const unknownSubcommandError = languageService.getError('unknownSubcommand', currentLanguage);
                await interaction.reply({
                    content: unknownSubcommandError,
                    ephemeral: true
                });
        }
    } catch (error) {
        console.error('Error in language command:', error);
        await errorLogger.logError(error as Error, {
            guildId: interaction.guildId!,
            errorType: 'CommandError',
            additionalContext: { command: 'language' }
        });

        const currentLanguage = interaction.guildId ? await languageService.getGuildLanguage(interaction.guildId) : 'en';
        const errorMessage = languageService.getError('commandError', currentLanguage);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: errorMessage,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
        }
    }
}

/**
 * Handle setting the bot language
 */
async function handleSetLanguage(
    interaction: ChatInputCommandInteraction, 
    guildConfigDAO: GuildConfigDAO,
    languageService: LanguageService,
    currentLanguage: SupportedLanguage
) {
    const language = interaction.options.getString('language', true) as SupportedLanguage;
    
    if (!languageService.isLanguageSupported(language)) {
        const errorMessage = languageService.getError('invalidLanguage', currentLanguage);
        await interaction.reply({
            content: errorMessage,
            ephemeral: true
        });
        return;
    }

    // Update guild configuration
    await languageService.setGuildLanguage(interaction.guildId!, language);

    // Update commands for this guild to use the new language
    const commandRegistrationManager = CommandRegistrationManager.getInstance();
    try {
        await commandRegistrationManager.updateGuildCommands(interaction.guildId!, language);
    } catch (error) {
        console.error('Error updating guild commands:', error);
        // Continue with the language change even if command update fails
    }

    const languageInfo = languageService.getLanguageInfo(language);
    
    // Send confirmation message in the new language
    const successMessage = languageService.getSuccess('languageSet', language, {
        flag: languageInfo.flag,
        name: languageInfo.name
    });
    
    await interaction.reply({
        content: successMessage,
        ephemeral: true
    });

    // Send new welcome message in the selected language using Display Components V2
    const welcomeBuilder = new WelcomeMessageBuilder(language, interaction.guildId!);
    const welcomeMessage = welcomeBuilder.build();
    
    // Send the localized welcome message to the channel
    await interaction.followUp({
        components: welcomeMessage.components,
        flags: MessageFlags.IsComponentsV2,
        ephemeral: false
    });
}

/**
 * Handle showing current language
 */
async function handleCurrentLanguage(
    interaction: ChatInputCommandInteraction, 
    guildConfigDAO: GuildConfigDAO,
    languageService: LanguageService,
    currentLanguage: SupportedLanguage
) {
    const languageInfo = languageService.getLanguageInfo(currentLanguage);
    const message = languageService.getSuccess('currentLanguage', currentLanguage, {
        flag: languageInfo.flag,
        name: languageInfo.name
    });
    
    await interaction.reply({
        content: message,
        ephemeral: true
    });
}

/**
 * Handle listing all available languages
 */
async function handleListLanguages(
    interaction: ChatInputCommandInteraction,
    languageService: LanguageService,
    currentLanguage: SupportedLanguage
) {
    const message = languageService.getLocalizedLanguageList(currentLanguage);
    
    await interaction.reply({
        content: message,
        ephemeral: true
    });
}

/**
 * Handle language selector button interaction
 */
export async function handleLanguageSelector(interaction: StringSelectMenuInteraction) {
    const errorLogger = ErrorLogger.getInstance();
    const languageService = LanguageService.getInstance();
    
    try {
        if (!interaction.guildId) {
            const errorMessage = languageService.getError('serverOnly');
            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
            return;
        }

        const selectedLanguage = interaction.values[0] as SupportedLanguage;
        const currentLanguage = await languageService.getGuildLanguage(interaction.guildId);
        
        if (!languageService.isLanguageSupported(selectedLanguage)) {
            const errorMessage = languageService.getError('invalidLanguage', currentLanguage);
            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
            return;
        }

        // Update guild configuration
        await languageService.setGuildLanguage(interaction.guildId, selectedLanguage);

        // Update commands for this guild to use the new language
        const commandRegistrationManager = CommandRegistrationManager.getInstance();
        try {
            await commandRegistrationManager.updateGuildCommands(interaction.guildId, selectedLanguage);
        } catch (error) {
            console.error('Error updating guild commands:', error);
            // Continue with the language change even if command update fails
        }

        const languageInfo = languageService.getLanguageInfo(selectedLanguage);
        
        // Send confirmation message in the new language
        const successMessage = languageService.getSuccess('languageChanged', selectedLanguage, {
            flag: languageInfo.flag,
            name: languageInfo.name
        });
        
        await interaction.reply({
            content: successMessage,
            ephemeral: true
        });

        // Send new welcome message in the selected language using Display Components V2
        const welcomeBuilder = new WelcomeMessageBuilder(selectedLanguage, interaction.guildId);
        const welcomeMessage = welcomeBuilder.build();
        
        // Send the localized welcome message to the channel
        await interaction.followUp({
            components: welcomeMessage.components,
            flags: MessageFlags.IsComponentsV2,
            ephemeral: false
        });
        
    } catch (error) {
        console.error('Error in language selector:', error);
        await errorLogger.logError(error as Error, {
            guildId: interaction.guildId!,
            errorType: 'ComponentInteractionError',
            additionalContext: { component: 'language_selector' }
        });

        const currentLanguage = interaction.guildId ? await languageService.getGuildLanguage(interaction.guildId) : 'en';
        const errorMessage = languageService.getError('languageError', currentLanguage);

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: errorMessage,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: errorMessage,
                ephemeral: true
            });
        }
    }
}
