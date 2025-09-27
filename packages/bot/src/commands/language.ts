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

// Create command data with English names and descriptions
export const data = new SlashCommandBuilder()
    .setName('language')
    .setDescription('Manage bot language settings')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('Set the bot language for this server')
            .addStringOption(option => {
                const languageService = LanguageService.getInstance();
                const choices = languageService.getLanguageChoices('en');
                
                return option
                    .setName('language')
                    .setDescription('The language to set')
                    .setRequired(true)
                    .addChoices(...choices);
            })
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('current')
            .setDescription('Show the current bot language')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Show all available languages')
    );

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

    // Commands now use English names/descriptions only, so no need to update command registration

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

        // Commands now use English names/descriptions only, so no need to update command registration

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
