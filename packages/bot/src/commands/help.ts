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

/**
 * Help command to provide comprehensive usage instructions and support information
 */
export const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help and usage instructions for TicketMesh')
    .addSubcommand(subcommand =>
        subcommand
            .setName('overview')
            .setDescription('Get a general overview of TicketMesh features')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('commands')
            .setDescription('View all available commands and their usage')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('setup')
            .setDescription('Get help with setting up the ticket system')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('tickets')
            .setDescription('Learn how to use the ticket system')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('permissions')
            .setDescription('Understand required permissions and roles')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('support')
            .setDescription('Get support and contact information')
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    const errorLogger = ErrorLogger.getInstance();

    try {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'overview':
                await handleOverview(interaction);
                break;
            case 'commands':
                await handleCommands(interaction);
                break;
            case 'setup':
                await handleSetup(interaction);
                break;
            case 'tickets':
                await handleTickets(interaction);
                break;
            case 'permissions':
                await handlePermissions(interaction);
                break;
            case 'support':
                await handleSupport(interaction);
                break;
            default:
                await interaction.reply({
                    content: '❌ Unknown help category. Use `/help` to see available options.',
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

        const errorMessage = '❌ An error occurred while fetching help information.';
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
async function handleOverview(interaction: ChatInputCommandInteraction) {
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
async function handleCommands(interaction: ChatInputCommandInteraction) {
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
async function handleSetup(interaction: ChatInputCommandInteraction) {
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
async function handleTickets(interaction: ChatInputCommandInteraction) {
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
async function handlePermissions(interaction: ChatInputCommandInteraction) {
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
async function handleSupport(interaction: ChatInputCommandInteraction) {
    const helpEmbedBuilder = new HelpEmbedBuilder(interaction.client);
    const response = helpEmbedBuilder.buildSupportEmbed();

    await interaction.reply({ 
        embeds: [response.embed], 
        components: response.components 
    });
}
