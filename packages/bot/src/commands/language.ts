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

export const data = new SlashCommandBuilder()
    .setName('language')
    .setDescription('Manage bot language settings')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('Set the bot language for this server')
            .addStringOption(option =>
                option
                    .setName('language')
                    .setDescription('The language to set')
                    .setRequired(true)
                    .addChoices(
                        { name: '🇺🇸 English', value: 'en' },
                        { name: '🇪🇸 Español', value: 'es' },
                        { name: '🇫🇷 Français', value: 'fr' },
                        { name: '🇩🇪 Deutsch', value: 'de' },
                        { name: '🇮🇹 Italiano', value: 'it' },
                        { name: '🇵🇹 Português', value: 'pt' },
                        { name: '🇷🇺 Русский', value: 'ru' },
                        { name: '🇯🇵 日本語', value: 'ja' },
                        { name: '🇰🇷 한국어', value: 'ko' },
                        { name: '🇨🇳 中文', value: 'zh' }
                    )
            )
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
    
    try {
        if (!interaction.guildId) {
            await interaction.reply({
                content: '❌ This command can only be used in a server.',
                ephemeral: true
            });
            return;
        }

        const subcommand = interaction.options.getSubcommand();
        const guildConfigDAO = new GuildConfigDAO();

        switch (subcommand) {
            case 'set':
                await handleSetLanguage(interaction, guildConfigDAO);
                break;
            case 'current':
                await handleCurrentLanguage(interaction, guildConfigDAO);
                break;
            case 'list':
                await handleListLanguages(interaction);
                break;
            default:
                await interaction.reply({
                    content: '❌ Unknown subcommand.',
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

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: '❌ An error occurred while processing the language command.',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: '❌ An error occurred while processing the language command.',
                ephemeral: true
            });
        }
    }
}

/**
 * Handle setting the bot language
 */
async function handleSetLanguage(interaction: ChatInputCommandInteraction, guildConfigDAO: GuildConfigDAO) {
    const language = interaction.options.getString('language', true) as SupportedLanguage;
    
    if (!WelcomeMessageBuilder.isLanguageSupported(language)) {
        await interaction.reply({
            content: '❌ Invalid language selected.',
            ephemeral: true
        });
        return;
    }

    // Update guild configuration
    await guildConfigDAO.updateGuildConfig(interaction.guildId!, {
        language: language
    });

    const languageInfo = SUPPORTED_LANGUAGES[language];
    
    // Send confirmation message
    await interaction.reply({
        content: `✅ Bot language has been set to ${languageInfo.flag} **${languageInfo.name}** for this server.`,
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
async function handleCurrentLanguage(interaction: ChatInputCommandInteraction, guildConfigDAO: GuildConfigDAO) {
    const config = await guildConfigDAO.getGuildConfig(interaction.guildId!);
    const currentLanguage = (config?.language as SupportedLanguage) || 'en';
    const languageInfo = SUPPORTED_LANGUAGES[currentLanguage];
    
    await interaction.reply({
        content: `🌐 Current bot language: ${languageInfo.flag} **${languageInfo.name}**`,
        ephemeral: true
    });
}

/**
 * Handle listing all available languages
 */
async function handleListLanguages(interaction: ChatInputCommandInteraction) {
    const languageList = Object.entries(SUPPORTED_LANGUAGES)
        .map(([code, info]) => `${info.flag} **${info.name}** (\`${code}\`)`)
        .join('\n');
    
    await interaction.reply({
        content: `🌐 **Available Languages:**\n\n${languageList}\n\nUse \`/language set\` to change the bot language.`,
        ephemeral: true
    });
}

/**
 * Handle language selector button interaction
 */
export async function handleLanguageSelector(interaction: StringSelectMenuInteraction) {
    const errorLogger = ErrorLogger.getInstance();
    
    try {
        if (!interaction.guildId) {
            await interaction.reply({
                content: '❌ This can only be used in a server.',
                ephemeral: true
            });
            return;
        }

        const selectedLanguage = interaction.values[0] as SupportedLanguage;
        
        if (!WelcomeMessageBuilder.isLanguageSupported(selectedLanguage)) {
            await interaction.reply({
                content: '❌ Invalid language selected.',
                ephemeral: true
            });
            return;
        }

        // Update guild configuration
        const guildConfigDAO = new GuildConfigDAO();
        await guildConfigDAO.updateGuildConfig(interaction.guildId, {
            language: selectedLanguage
        });

        const languageInfo = SUPPORTED_LANGUAGES[selectedLanguage];
        
        // Send confirmation message
        await interaction.reply({
            content: `✅ Bot language has been changed to ${languageInfo.flag} **${languageInfo.name}**!`,
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

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: '❌ An error occurred while changing the language.',
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: '❌ An error occurred while changing the language.',
                ephemeral: true
            });
        }
    }
}
