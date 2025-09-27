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

    // Command localizations
    commands: {
        // Language command
        language: {
            name: 'language',
            description: 'Manage bot language settings',
            set: {
                name: 'set',
                description: 'Set the bot language for this server',
                languageOption: {
                    name: 'language',
                    description: 'The language to set'
                }
            },
            current: {
                name: 'current',
                description: 'Show the current bot language'
            },
            list: {
                name: 'list',
                description: 'Show all available languages'
            }
        },
        // Help command
        help: {
            name: 'help',
            description: 'Get help and usage instructions for TicketMesh',
            overview: {
                name: 'overview',
                description: 'Get a general overview of TicketMesh features'
            },
            commands: {
                name: 'commands',
                description: 'View all available commands and their usage'
            },
            setup: {
                name: 'setup',
                description: 'Get help with setting up the ticket system'
            },
            tickets: {
                name: 'tickets',
                description: 'Learn how to use the ticket system'
            },
            permissions: {
                name: 'permissions',
                description: 'Understand required permissions and roles'
            },
            support: {
                name: 'support',
                description: 'Get support and contact information'
            }
        },
        // Setup wizard command
        setupWizard: {
            name: 'setup-wizard',
            description: 'Interactive setup wizard for the ticket system (Administrator only)'
        },
        // Support roles command
        supportRoles: {
            name: 'support-roles',
            description: 'Manage support staff roles for the ticket system (Administrator only)',
            list: {
                name: 'list',
                description: 'List all configured support staff roles'
            },
            add: {
                name: 'add',
                description: 'Add a role as support staff',
                roleOption: {
                    name: 'role',
                    description: 'The role to add as support staff'
                }
            },
            remove: {
                name: 'remove',
                description: 'Remove a role from support staff',
                roleOption: {
                    name: 'role',
                    description: 'The role to remove from support staff'
                }
            },
            clear: {
                name: 'clear',
                description: 'Remove all support staff roles'
            },
            members: {
                name: 'members',
                description: 'List all members with support staff roles'
            }
        },
        // Stats command
        stats: {
            name: 'stats',
            description: 'View ticket statistics and analytics (Support Staff only)',
            overview: {
                name: 'overview',
                description: 'View general ticket statistics overview'
            },
            detailed: {
                name: 'detailed',
                description: 'View detailed ticket statistics'
            },
            export: {
                name: 'export',
                description: 'Export statistics to JSON file'
            },
            user: {
                name: 'user',
                description: 'View statistics for a specific user',
                userOption: {
                    name: 'user',
                    description: 'User to view statistics for'
                }
            },
            realtime: {
                name: 'realtime',
                description: 'View real-time ticket statistics'
            }
        },
        // Debug command
        debug: {
            name: 'debug',
            description: 'Debug and test ticket system functionality (Administrator only)',
            config: {
                name: 'config',
                description: 'Check current guild configuration'
            },
            transcript: {
                name: 'transcript',
                description: 'Test transcript generation for a specific ticket',
                ticketIdOption: {
                    name: 'ticket_id',
                    description: 'The ticket ID to generate transcript for'
                }
            }
        },
        // User info command (Context Menu)
        userinfo: {
            name: 'User Info (Support Staff)',
            description: 'Get detailed information about a user'
        },
        // Message info command (Context Menu)
        messageinfo: {
            name: 'Message Info (Support Staff)',
            description: 'Get detailed information about a message'
        }
    },

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
