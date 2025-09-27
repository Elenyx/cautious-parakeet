/**
 * English (en) localization data
 */

export const EN_LOCALIZATION = {
    // Language info
    language: {
        name: 'English',
        flag: '🇺🇸',
        nativeName: 'English'
    },

    // Command localizations removed - commands now use English names/descriptions only
    // Only response messages are localized

    // Response messages
    responses: {
        // Common responses
        errors: {
            serverOnly: '❌ This command can only be used in a server.',
            dmOnly: '❌ This command can only be used in direct messages.',
            unknownSubcommand: '❌ Unknown subcommand.',
            invalidLanguage: '❌ Invalid language selected.',
            permissionDenied: '❌ You do not have permission to use this command.',
            adminRequired: '❌ You need Administrator permissions to use this command.',
            supportStaffRequired: '❌ You need support staff permissions to use this command.',
            commandError: '❌ An error occurred while processing the command.',
            componentError: '❌ An error occurred while processing the interaction.',
            languageError: '❌ An error occurred while changing the language.',
            helpError: '❌ An error occurred while fetching help information.',
            setupError: '❌ An error occurred while processing the setup wizard.',
            statsError: '❌ An error occurred while fetching statistics.',
            userInfoError: '❌ An error occurred while fetching user information.',
            messageInfoError: '❌ An error occurred while fetching message information.',
            debugError: '❌ An error occurred while processing the debug command.',
            supportRolesError: '❌ An error occurred while managing support roles.'
        },
        // Success messages
        success: {
            languageSet: '✅ Bot language has been set to {flag} **{name}** for this server.',
            languageChanged: '✅ Bot language has been changed to {flag} **{name}**!',
            currentLanguage: '🌐 Current bot language: {flag} **{name}**',
            availableLanguages: '🌐 **Available Languages:**\n\n{list}\n\nUse `/language set` to change the bot language.',
            helpCategory: '❌ Unknown help category. Use `/help` to see available options.',
            supportRoleAdded: '✅ Role {role} has been added as support staff.',
            supportRoleRemoved: '✅ Role {role} has been removed from support staff.',
            supportRolesCleared: '✅ All support staff roles have been cleared.',
            debugConfigShown: '✅ Guild configuration displayed successfully.',
            debugTranscriptGenerated: '✅ Transcript generated successfully for ticket {ticketId}.'
        },
        // Language choices
        languageChoices: {
            en: '🇺🇸 English',
            es: '🇪🇸 Español',
            fr: '🇫🇷 Français',
            de: '🇩🇪 Deutsch',
            it: '🇮🇹 Italiano',
            pt: '🇵🇹 Português',
            ru: '🇷🇺 Русский',
            ja: '🇯🇵 日本語',
            ko: '🇰🇷 한국어',
            zh: '🇨🇳 中文'
        }
    },

    // Welcome messages
    welcome: {
        greeting: "Welcome to TicketMesh! 🎫",
        expectation: "I'm your advanced Discord ticket system designed to streamline your server's support workflow!",
        features: "**Key Features:**\n• Interactive Setup Wizard\n• Multi-Category Tickets\n• Advanced Analytics\n• Auto-Transcripts\n• Support Role Management",
        quickStart: "**Quick Start:**\n• Use `/setup-wizard` to configure your ticket system\n• Set up ticket categories and permissions\n• Monitor with `/stats` command",
        help: "Use `/help` to explore all features and commands",
        links: "Resources & Support",
        dashboard: "Configure your ticket system with our web dashboard",
        github: "View source code and contribute on GitHub",
        wiki: "Comprehensive guides and documentation",
        support: "Join our support server for help and updates",
        language: "Do you want to change the language?",
        languageCommand: "You can change the language of the bot using the command `/language set.`",
        viewLanguages: "View this in other languages",
        description: "Advanced Discord ticket system with analytics and multi-language support."
    }
} as const;
