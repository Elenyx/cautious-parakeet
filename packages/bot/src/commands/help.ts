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
    const embed = new EmbedBuilder()
        .setTitle('🎫 TicketMesh - Advanced Discord Ticket System')
        .setDescription('Welcome to TicketMesh! A powerful, feature-rich ticket system designed to streamline your Discord server\'s support workflow.')
        .setColor(0x5865F2)
        .setThumbnail(interaction.client.user?.displayAvatarURL() || null)
        .addFields(
            {
                name: '🚀 Key Features',
                value: [
                    '• **Interactive Setup Wizard** - Easy configuration process',
                    '• **Multi-Category Tickets** - Support different types of requests',
                    '• **Advanced Permissions** - Granular role-based access control',
                    '• **Ticket Analytics** - Comprehensive statistics and insights',
                    '• **Auto-Transcripts** - Automatic conversation logging',
                    '• **Custom Branding** - Personalized ticket experience'
                ].join('\n'),
                inline: false
            },
            {
                name: '📋 Quick Start',
                value: [
                    '1. Use `/setup-wizard` to configure your ticket system',
                    '2. Set up ticket categories and permissions',
                    '3. Create ticket panels for your users',
                    '4. Monitor with `/stats` command'
                ].join('\n'),
                inline: false
            },
            {
                name: '💡 Need Help?',
                value: [
                    '• Use `/help commands` for all available commands',
                    '• Use `/help setup` for configuration guidance',
                    '• Use `/help support` for additional assistance'
                ].join('\n'),
                inline: false
            }
        )
        .setFooter({ 
            text: 'TicketMesh • Made with ❤️ for Discord communities',
            iconURL: interaction.client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('help_commands')
                .setLabel('View Commands')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('📋'),
            new ButtonBuilder()
                .setCustomId('help_setup')
                .setLabel('Setup Guide')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⚙️'),
            new ButtonBuilder()
                .setCustomId('help_support')
                .setLabel('Get Support')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🆘')
        );

    await interaction.reply({ embeds: [embed], components: [row] });
}

/**
 * Show all available commands
 */
async function handleCommands(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('📋 TicketMesh Commands')
        .setDescription('Here are all the available commands for TicketMesh:')
        .setColor(0x5865F2)
        .addFields(
            {
                name: '🔧 Setup & Configuration',
                value: [
                    '`/setup-wizard` - Interactive setup wizard (Admin only)',
                    '`/debug config` - Check current configuration',
                    '`/debug transcript` - Test transcript generation'
                ].join('\n'),
                inline: false
            },
            {
                name: '📊 Analytics & Statistics',
                value: [
                    '`/stats overview` - General ticket statistics',
                    '`/stats detailed` - Detailed analytics',
                    '`/stats export` - Export data to JSON',
                    '`/stats user <user>` - User-specific stats'
                ].join('\n'),
                inline: false
            },
            {
                name: 'ℹ️ Information & Help',
                value: [
                    '`/help` - This help menu',
                    '`/userinfo` - User information (Right-click)',
                    '`/messageinfo` - Message information (Right-click)'
                ].join('\n'),
                inline: false
            }
        )
        .setFooter({ 
            text: 'Use /help <category> for detailed information about specific topics',
            iconURL: interaction.client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

/**
 * Show setup guidance
 */
async function handleSetup(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('⚙️ TicketMesh Setup Guide')
        .setDescription('Follow these steps to set up your ticket system:')
        .setColor(0x5865F2)
        .addFields(
            {
                name: '1️⃣ Initial Setup',
                value: [
                    '• Use `/setup-wizard` to start the configuration process',
                    '• Ensure you have Administrator permissions',
                    '• The wizard will guide you through each step'
                ].join('\n'),
                inline: false
            },
            {
                name: '2️⃣ Configure Categories',
                value: [
                    '• Set up different ticket categories (Support, Bug Reports, etc.)',
                    '• Assign appropriate roles for each category',
                    '• Configure auto-responses and welcome messages'
                ].join('\n'),
                inline: false
            },
            {
                name: '3️⃣ Set Permissions',
                value: [
                    '• Configure who can create tickets',
                    '• Set up support staff roles',
                    '• Define moderator permissions'
                ].join('\n'),
                inline: false
            },
            {
                name: '4️⃣ Create Ticket Panels',
                value: [
                    '• Use the setup wizard to create ticket panels',
                    '• Place panels in appropriate channels',
                    '• Test the system with `/debug config`'
                ].join('\n'),
                inline: false
            },
            {
                name: '🔧 Troubleshooting',
                value: [
                    '• Use `/debug config` to check your setup',
                    '• Verify bot permissions in server settings',
                    '• Check channel permissions for ticket categories'
                ].join('\n'),
                inline: false
            }
        )
        .setFooter({ 
            text: 'Need more help? Use /help support for additional assistance',
            iconURL: interaction.client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

/**
 * Show ticket system usage guide
 */
async function handleTickets(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('🎫 Using the Ticket System')
        .setDescription('Learn how to effectively use TicketMesh\'s ticket system:')
        .setColor(0x5865F2)
        .addFields(
            {
                name: '👤 For Users',
                value: [
                    '• Click on ticket panel buttons to create tickets',
                    '• Provide clear descriptions of your issue',
                    '• Be patient while waiting for support',
                    '• Use the close button when your issue is resolved'
                ].join('\n'),
                inline: false
            },
            {
                name: '🛠️ For Support Staff',
                value: [
                    '• Monitor ticket channels for new requests',
                    '• Use `/stats` to track ticket metrics',
                    '• Close tickets when issues are resolved',
                    '• Transcripts are automatically generated'
                ].join('\n'),
                inline: false
            },
            {
                name: '👑 For Administrators',
                value: [
                    '• Use `/stats` to monitor system performance',
                    '• Configure settings with `/setup-wizard`',
                    '• Use `/debug` commands for troubleshooting',
                    '• Manage permissions and roles as needed'
                ].join('\n'),
                inline: false
            },
            {
                name: '📝 Ticket Features',
                value: [
                    '• **Auto-transcripts** - Conversations are logged automatically',
                    '• **Multi-category** - Different types of support requests',
                    '• **Role-based access** - Granular permission control',
                    '• **Analytics** - Track performance and usage'
                ].join('\n'),
                inline: false
            }
        )
        .setFooter({ 
            text: 'Questions about tickets? Use /help support for more assistance',
            iconURL: interaction.client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

/**
 * Show permissions and roles information
 */
async function handlePermissions(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('🔐 Permissions & Roles Guide')
        .setDescription('Understanding TicketMesh permissions and role requirements:')
        .setColor(0x5865F2)
        .addFields(
            {
                name: '🤖 Bot Permissions',
                value: [
                    '• **Administrator** - Full access to all features',
                    '• **Manage Channels** - Create and manage ticket channels',
                    '• **Manage Roles** - Assign roles to support staff',
                    '• **Send Messages** - Communicate in channels',
                    '• **Embed Links** - Send rich embeds',
                    '• **Attach Files** - Handle file uploads'
                ].join('\n'),
                inline: false
            },
            {
                name: '👑 Administrator Role',
                value: [
                    '• Access to `/setup-wizard`',
                    '• Can use `/debug` commands',
                    '• Full access to `/stats`',
                    '• Can modify system configuration'
                ].join('\n'),
                inline: false
            },
            {
                name: '🛠️ Support Staff Roles',
                value: [
                    '• Access to ticket channels',
                    '• Can view ticket statistics',
                    '• Can close and manage tickets',
                    '• Configured during setup wizard'
                ].join('\n'),
                inline: false
            },
            {
                name: '👤 User Permissions',
                value: [
                    '• Can create tickets via panels',
                    '• Can interact in their ticket channels',
                    '• Can close their own tickets',
                    '• No special roles required'
                ].join('\n'),
                inline: false
            }
        )
        .setFooter({ 
            text: 'Permission issues? Check bot permissions in Server Settings > Integrations',
            iconURL: interaction.client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}

/**
 * Show support and contact information
 */
async function handleSupport(interaction: ChatInputCommandInteraction) {
    const embed = new EmbedBuilder()
        .setTitle('🆘 Support & Contact Information')
        .setDescription('Need additional help? Here\'s how to get support:')
        .setColor(0x5865F2)
        .addFields(
            {
                name: '📚 Documentation',
                value: [
                    '• **Official Website** - [ticketmesh.com](https://ticketmesh.com)',
                    '• **Setup Guide** - Complete configuration walkthrough',
                    '• **API Documentation** - For developers and integrations'
                ].join('\n'),
                inline: false
            },
            {
                name: '💬 Community Support',
                value: [
                    '• **Discord Server** - Join our support community',
                    '• **GitHub Issues** - Report bugs and request features',
                    '• **Community Forums** - Get help from other users'
                ].join('\n'),
                inline: false
            },
            {
                name: '🔧 Troubleshooting',
                value: [
                    '• Use `/debug config` to check your setup',
                    '• Verify bot permissions in server settings',
                    '• Check the logs for error messages',
                    '• Try the setup wizard again if needed'
                ].join('\n'),
                inline: false
            },
            {
                name: '⚡ Quick Fixes',
                value: [
                    '• **Bot not responding?** - Check if it\'s online',
                    '• **Commands not working?** - Verify bot permissions',
                    '• **Tickets not creating?** - Check channel permissions',
                    '• **Setup issues?** - Run `/setup-wizard` again'
                ].join('\n'),
                inline: false
            }
        )
        .setFooter({ 
            text: 'Still need help? Join our Discord server for direct support!',
            iconURL: interaction.client.user?.displayAvatarURL() || undefined
        })
        .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setLabel('Join Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/ticketmesh')
                .setEmoji('💬'),
            new ButtonBuilder()
                .setLabel('Visit Website')
                .setStyle(ButtonStyle.Link)
                .setURL('https://ticketmesh.com')
                .setEmoji('🌐'),
            new ButtonBuilder()
                .setLabel('GitHub')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/ticketmesh/ticketmesh')
                .setEmoji('📚')
        );

    await interaction.reply({ embeds: [embed], components: [row] });
}
