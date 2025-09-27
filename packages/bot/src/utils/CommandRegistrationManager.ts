import { Client, REST, Routes, Collection } from 'discord.js';
import { LanguageService } from './LanguageService.js';
import { LocalizedCommandBuilder } from './LocalizedCommandBuilder.js';
import { SupportedLanguage } from '../localization/index.js';

/**
 * Command Registration Manager for handling localized command registration
 * This system allows for dynamic command updates when language changes
 */
export class CommandRegistrationManager {
    private static instance: CommandRegistrationManager;
    private client: Client | null = null;
    private languageService: LanguageService;
    private registeredCommands: Map<string, any> = new Map();

    private constructor() {
        this.languageService = LanguageService.getInstance();
    }

    public static getInstance(): CommandRegistrationManager {
        if (!CommandRegistrationManager.instance) {
            CommandRegistrationManager.instance = new CommandRegistrationManager();
        }
        return CommandRegistrationManager.instance;
    }

    /**
     * Initialize the command registration manager with the Discord client
     */
    public initialize(client: Client): void {
        this.client = client;
    }

    /**
     * Register all commands for a specific language
     */
    public async registerCommandsForLanguage(language: SupportedLanguage, guildId?: string): Promise<void> {
        if (!this.client) {
            throw new Error('CommandRegistrationManager not initialized with client');
        }

        try {
            const commands = await this.buildLocalizedCommands(language);
            
            if (guildId) {
                // Register commands for specific guild
                await this.registerGuildCommands(commands, guildId);
            } else {
                // Register global commands
                await this.registerGlobalCommands(commands);
            }

            console.log(`[COMMAND_REGISTRATION] Successfully registered commands for language: ${language}`);
        } catch (error) {
            console.error(`[COMMAND_REGISTRATION] Error registering commands for language ${language}:`, error);
            throw error;
        }
    }

    /**
     * Update commands for a specific guild when language changes
     */
    public async updateGuildCommands(guildId: string, newLanguage: SupportedLanguage): Promise<void> {
        try {
            await this.registerCommandsForLanguage(newLanguage, guildId);
            console.log(`[COMMAND_REGISTRATION] Updated commands for guild ${guildId} to language: ${newLanguage}`);
        } catch (error) {
            console.error(`[COMMAND_REGISTRATION] Error updating commands for guild ${guildId}:`, error);
            throw error;
        }
    }

    /**
     * Build localized command data for all commands
     */
    private async buildLocalizedCommands(language: SupportedLanguage): Promise<any[]> {
        const commands: any[] = [];

        // Language command
        const languageCommand = new LocalizedCommandBuilder('language')
            .setLocalizedInfo(language)
            .setDefaultMemberPermissions(0x20n) // ManageGuild
            .addLocalizedSubcommand('set', language, (subcommand) => {
                return subcommand.addStringOption(option => {
                    const choices = this.languageService.getLanguageChoices(language);
                    return option
                        .setName('language')
                        .setDescription('The language to set')
                        .setRequired(true)
                        .addChoices(...choices);
                });
            })
            .addLocalizedSubcommand('current', language)
            .addLocalizedSubcommand('list', language)
            .build();

        commands.push(languageCommand.toJSON());

        // Help command
        const helpCommand = new LocalizedCommandBuilder('help')
            .setLocalizedInfo(language)
            .addLocalizedSubcommand('overview', language)
            .addLocalizedSubcommand('commands', language)
            .addLocalizedSubcommand('setup', language)
            .addLocalizedSubcommand('tickets', language)
            .addLocalizedSubcommand('permissions', language)
            .addLocalizedSubcommand('support', language)
            .build();

        commands.push(helpCommand.toJSON());

        // Setup wizard command
        const setupWizardCommand = new LocalizedCommandBuilder('setupWizard')
            .setLocalizedInfo(language)
            .setDefaultMemberPermissions(0x8n) // Administrator
            .build();

        commands.push(setupWizardCommand.toJSON());

        // Support roles command
        const supportRolesCommand = new LocalizedCommandBuilder('supportRoles')
            .setLocalizedInfo(language)
            .setDefaultMemberPermissions(0x8n) // Administrator
            .addLocalizedSubcommand('list', language)
            .addLocalizedSubcommand('add', language, (subcommand) => {
                return subcommand.addRoleOption(option => {
                    const optionData = this.languageService.getOptionData('supportRoles', 'add', 'roleOption', language);
                    return option
                        .setName(optionData.name)
                        .setDescription(optionData.description)
                        .setRequired(true);
                });
            })
            .addLocalizedSubcommand('remove', language, (subcommand) => {
                return subcommand.addRoleOption(option => {
                    const optionData = this.languageService.getOptionData('supportRoles', 'remove', 'roleOption', language);
                    return option
                        .setName(optionData.name)
                        .setDescription(optionData.description)
                        .setRequired(true);
                });
            })
            .addLocalizedSubcommand('clear', language)
            .addLocalizedSubcommand('members', language)
            .build();

        commands.push(supportRolesCommand.toJSON());

        // Stats command
        const statsCommand = new LocalizedCommandBuilder('stats')
            .setLocalizedInfo(language)
            .setDefaultMemberPermissions(0x10n) // ManageChannels
            .addLocalizedSubcommand('overview', language)
            .addLocalizedSubcommand('detailed', language)
            .addLocalizedSubcommand('export', language)
            .addLocalizedSubcommand('user', language, (subcommand) => {
                return subcommand.addUserOption(option => {
                    const optionData = this.languageService.getOptionData('stats', 'user', 'userOption', language);
                    return option
                        .setName(optionData.name)
                        .setDescription(optionData.description)
                        .setRequired(true);
                });
            })
            .addLocalizedSubcommand('realtime', language)
            .build();

        commands.push(statsCommand.toJSON());

        // Debug command
        const debugCommand = new LocalizedCommandBuilder('debug')
            .setLocalizedInfo(language)
            .setDefaultMemberPermissions(0x8n) // Administrator
            .addLocalizedSubcommand('config', language)
            .addLocalizedSubcommand('transcript', language, (subcommand) => {
                return subcommand.addStringOption(option => {
                    const optionData = this.languageService.getOptionData('debug', 'transcript', 'ticketIdOption', language);
                    return option
                        .setName(optionData.name)
                        .setDescription(optionData.description)
                        .setRequired(true);
                });
            })
            .build();

        commands.push(debugCommand.toJSON());

        // Note: userinfo and messageinfo are Context Menu Commands, not slash commands
        // They are registered separately and don't need to be included here

        return commands;
    }

    /**
     * Register commands globally
     */
    private async registerGlobalCommands(commands: any[]): Promise<void> {
        if (!this.client) return;

        const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
        
        try {
            console.log(`[COMMAND_REGISTRATION] Started refreshing ${commands.length} global application (/) commands.`);

            const data = await rest.put(
                Routes.applicationCommands(this.client.user!.id),
                { body: commands }
            ) as any[];

            console.log(`[COMMAND_REGISTRATION] Successfully reloaded ${data.length} global application (/) commands.`);
        } catch (error) {
            console.error('[COMMAND_REGISTRATION] Error registering global commands:', error);
            throw error;
        }
    }

    /**
     * Register commands for a specific guild
     */
    private async registerGuildCommands(commands: any[], guildId: string): Promise<void> {
        if (!this.client) return;

        const rest = new REST().setToken(process.env.DISCORD_TOKEN!);
        
        try {
            console.log(`[COMMAND_REGISTRATION] Started refreshing ${commands.length} guild application (/) commands for guild ${guildId}.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(this.client.user!.id, guildId),
                { body: commands }
            ) as any[];

            console.log(`[COMMAND_REGISTRATION] Successfully reloaded ${data.length} guild application (/) commands for guild ${guildId}.`);
        } catch (error) {
            console.error(`[COMMAND_REGISTRATION] Error registering guild commands for ${guildId}:`, error);
            throw error;
        }
    }

    /**
     * Get the current registered commands
     */
    public getRegisteredCommands(): Map<string, any> {
        return this.registeredCommands;
    }

    /**
     * Clear all registered commands
     */
    public clearRegisteredCommands(): void {
        this.registeredCommands.clear();
    }
}
