import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Client } from 'discord.js';

/**
 * Utility class for building consistent help embeds with navigation
 */
export class HelpEmbedBuilder {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Create a base embed with consistent styling
     */
    private createBaseEmbed(title: string, description: string, color: number = 0x5865F2): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setThumbnail(this.client.user?.displayAvatarURL() || null)
            .setFooter({ 
                text: 'TicketMesh • Made with ❤️ for Discord communities',
                iconURL: this.client.user?.displayAvatarURL() || undefined
            })
            .setTimestamp();
    }

    /**
     * Create navigation buttons for help categories
     */
    createNavigationButtons(currentCategory?: string): ActionRowBuilder<ButtonBuilder> {
        const row = new ActionRowBuilder<ButtonBuilder>();

        const categories = [
            { id: 'help_overview', label: 'Overview', emoji: '🏠', style: ButtonStyle.Primary },
            { id: 'help_commands', label: 'Commands', emoji: '📋', style: ButtonStyle.Secondary },
            { id: 'help_setup', label: 'Setup', emoji: '⚙️', style: ButtonStyle.Secondary },
            { id: 'help_tickets', label: 'Tickets', emoji: '🎫', style: ButtonStyle.Secondary },
            { id: 'help_permissions', label: 'Permissions', emoji: '🔐', style: ButtonStyle.Secondary },
            { id: 'help_support', label: 'Support', emoji: '🆘', style: ButtonStyle.Success }
        ];

        categories.forEach(category => {
            const isCurrent = currentCategory === category.id;
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(category.id)
                    .setLabel(category.label)
                    .setStyle(isCurrent ? ButtonStyle.Primary : category.style)
                    .setEmoji(category.emoji)
                    .setDisabled(isCurrent)
            );
        });

        return row;
    }

    /**
     * Create quick action buttons
     */
    createQuickActionButtons(): ActionRowBuilder<ButtonBuilder> {
        return new ActionRowBuilder<ButtonBuilder>()
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
    }

    /**
     * Build overview help embed
     */
    buildOverviewEmbed(): { embed: EmbedBuilder; components: ActionRowBuilder<ButtonBuilder>[] } {
        const embed = this.createBaseEmbed(
            '🎫 TicketMesh - Advanced Discord Ticket System',
            'Welcome to TicketMesh! A powerful, feature-rich ticket system designed to streamline your Discord server\'s support workflow.'
        );

        embed.addFields(
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
                    '• Use the buttons below to navigate help categories',
                    '• Use `/help <category>` for specific help topics',
                    '• Join our support server for direct assistance'
                ].join('\n'),
                inline: false
            }
        );

        return {
            embed,
            components: [this.createNavigationButtons('help_overview')]
        };
    }

    /**
     * Build commands help embed
     */
    buildCommandsEmbed(): { embed: EmbedBuilder; components: ActionRowBuilder<ButtonBuilder>[] } {
        const embed = this.createBaseEmbed(
            '📋 TicketMesh Commands',
            'Here are all the available commands for TicketMesh:'
        );

        embed.addFields(
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
        );

        return {
            embed,
            components: [this.createNavigationButtons('help_commands')]
        };
    }

    /**
     * Build setup help embed
     */
    buildSetupEmbed(): { embed: EmbedBuilder; components: ActionRowBuilder<ButtonBuilder>[] } {
        const embed = this.createBaseEmbed(
            '⚙️ TicketMesh Setup Guide',
            'Follow these steps to set up your ticket system:'
        );

        embed.addFields(
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
        );

        return {
            embed,
            components: [this.createNavigationButtons('help_setup')]
        };
    }

    /**
     * Build tickets help embed
     */
    buildTicketsEmbed(): { embed: EmbedBuilder; components: ActionRowBuilder<ButtonBuilder>[] } {
        const embed = this.createBaseEmbed(
            '🎫 Using the Ticket System',
            'Learn how to effectively use TicketMesh\'s ticket system:'
        );

        embed.addFields(
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
        );

        return {
            embed,
            components: [this.createNavigationButtons('help_tickets')]
        };
    }

    /**
     * Build permissions help embed
     */
    buildPermissionsEmbed(): { embed: EmbedBuilder; components: ActionRowBuilder<ButtonBuilder>[] } {
        const embed = this.createBaseEmbed(
            '🔐 Permissions & Roles Guide',
            'Understanding TicketMesh permissions and role requirements:'
        );

        embed.addFields(
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
        );

        return {
            embed,
            components: [this.createNavigationButtons('help_permissions')]
        };
    }

    /**
     * Build support help embed
     */
    buildSupportEmbed(): { embed: EmbedBuilder; components: ActionRowBuilder<ButtonBuilder>[] } {
        const embed = this.createBaseEmbed(
            '🆘 Support & Contact Information',
            'Need additional help? Here\'s how to get support:'
        );

        embed.addFields(
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
        );

        return {
            embed,
            components: [this.createNavigationButtons('help_support'), this.createQuickActionButtons()]
        };
    }

    /**
     * Build error help embed
     */
    buildErrorEmbed(title: string, description: string, suggestions: string[]): { embed: EmbedBuilder; components: ActionRowBuilder<ButtonBuilder>[] } {
        const embed = this.createBaseEmbed(title, description, 0xFF6B6B);

        embed.addFields(
            {
                name: '💡 What to do:',
                value: suggestions.map(suggestion => `• ${suggestion}`).join('\n'),
                inline: false
            }
        );

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('help_support')
                    .setLabel('Get Support')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('🆘')
            );

        return {
            embed,
            components: [row]
        };
    }
}
