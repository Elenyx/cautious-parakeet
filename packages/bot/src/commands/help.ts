import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} from 'discord.js';
import { ErrorLogger } from '../utils/ErrorLogger';
import { HelpEmbedBuilder } from '../utils/HelpEmbedBuilder';
import { LanguageService } from '../utils/LanguageService.js';
import { LocalizedCommandBuilder } from '../utils/LocalizedCommandBuilder.js';

/**
 * Help command to provide comprehensive usage instructions and support information
 */
export const data = new LocalizedCommandBuilder('help')
    .setLocalizedInfo('en') // Default to English for initial registration
    .addLocalizedSubcommand('overview', 'en')
    .addLocalizedSubcommand('commands', 'en')
    .addLocalizedSubcommand('setup', 'en')
    .addLocalizedSubcommand('tickets', 'en')
    .addLocalizedSubcommand('permissions', 'en')
    .addLocalizedSubcommand('support', 'en')
    .build();

export async function execute(interaction: ChatInputCommandInteraction) {
    const errorLogger = ErrorLogger.getInstance();
    const languageService = LanguageService.getInstance();

    try {
        // Get the current guild language
        const currentLanguage = interaction.guildId ? 
            await languageService.getGuildLanguage(interaction.guildId) : 'en';
        
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'overview':
                await handleOverview(interaction, languageService, currentLanguage);
                break;
            case 'commands':
                await handleCommands(interaction, languageService, currentLanguage);
                break;
            case 'setup':
                await handleSetup(interaction, languageService, currentLanguage);
                break;
            case 'tickets':
                await handleTickets(interaction, languageService, currentLanguage);
                break;
            case 'permissions':
                await handlePermissions(interaction, languageService, currentLanguage);
                break;
            case 'support':
                await handleSupport(interaction, languageService, currentLanguage);
                break;
            default:
                const errorMessage = languageService.getError('helpCategory', currentLanguage);
                await interaction.reply({
                    content: errorMessage,
                    ephemeral: true
                });
        }

    } catch (error) {
        console.error('Error in help command:', error);
        await errorLogger.logCommandError(error as Error, {
            guildId: interaction.guildId || undefined,
            userId: interaction.user.id,
            commandName: 'help'
        });

        const currentLanguage = interaction.guildId ? 
            await languageService.getGuildLanguage(interaction.guildId) : 'en';
        const errorMessage = languageService.getError('helpError', currentLanguage);
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

/**
 * Show general overview of TicketMesh features
 */
async function handleOverview(
    interaction: ChatInputCommandInteraction, 
    languageService: LanguageService,
    currentLanguage: string
) {
    const helpEmbedBuilder = new HelpEmbedBuilder(interaction.client);
    const response = helpEmbedBuilder.buildOverviewEmbed();

    await interaction.reply({ 
        embeds: [response.embed], 
        components: response.components 
    });
}

/**
 * Show all available commands
 */
async function handleCommands(
    interaction: ChatInputCommandInteraction,
    languageService: LanguageService,
    currentLanguage: string
) {
    const helpEmbedBuilder = new HelpEmbedBuilder(interaction.client);
    const response = helpEmbedBuilder.buildCommandsEmbed();

    await interaction.reply({ 
        embeds: [response.embed], 
        components: response.components 
    });
}

/**
 * Show setup guidance
 */
async function handleSetup(
    interaction: ChatInputCommandInteraction,
    languageService: LanguageService,
    currentLanguage: string
) {
    const helpEmbedBuilder = new HelpEmbedBuilder(interaction.client);
    const response = helpEmbedBuilder.buildSetupEmbed();

    await interaction.reply({ 
        embeds: [response.embed], 
        components: response.components 
    });
}

/**
 * Show ticket system usage guide
 */
async function handleTickets(
    interaction: ChatInputCommandInteraction,
    languageService: LanguageService,
    currentLanguage: string
) {
    const helpEmbedBuilder = new HelpEmbedBuilder(interaction.client);
    const response = helpEmbedBuilder.buildTicketsEmbed();

    await interaction.reply({ 
        embeds: [response.embed], 
        components: response.components 
    });
}

/**
 * Show permissions and roles information
 */
async function handlePermissions(
    interaction: ChatInputCommandInteraction,
    languageService: LanguageService,
    currentLanguage: string
) {
    const helpEmbedBuilder = new HelpEmbedBuilder(interaction.client);
    const response = helpEmbedBuilder.buildPermissionsEmbed();

    await interaction.reply({ 
        embeds: [response.embed], 
        components: response.components 
    });
}

/**
 * Show support and contact information
 */
async function handleSupport(
    interaction: ChatInputCommandInteraction,
    languageService: LanguageService,
    currentLanguage: string
) {
    const helpEmbedBuilder = new HelpEmbedBuilder(interaction.client);
    const response = helpEmbedBuilder.buildSupportEmbed();

    await interaction.reply({ 
        embeds: [response.embed], 
        components: response.components 
    });
}
