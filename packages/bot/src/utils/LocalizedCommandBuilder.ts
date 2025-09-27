import { 
    SlashCommandBuilder, 
    SlashCommandSubcommandBuilder,
    SlashCommandStringOption,
    SlashCommandUserOption,
    SlashCommandRoleOption,
    SlashCommandChannelOption,
    PermissionFlagsBits,
    type ApplicationCommandPermissionType
} from 'discord.js';
import { LanguageService } from './LanguageService.js';
import { SupportedLanguage } from '../localization/index.js';

/**
 * Localized Command Builder for creating slash commands with multiple language support
 */
export class LocalizedCommandBuilder {
    private languageService: LanguageService;
    private commandName: string;
    private builder: SlashCommandBuilder;

    constructor(commandName: string) {
        this.languageService = LanguageService.getInstance();
        this.commandName = commandName;
        this.builder = new SlashCommandBuilder();
    }

    /**
     * Set the command name and description for a specific language
     */
    public setLocalizedInfo(language: SupportedLanguage = 'en'): this {
        const commandData = this.languageService.getLocalizedCommandData(this.commandName, language);
        this.builder
            .setName(commandData.name)
            .setDescription(commandData.description);
        return this;
    }

    /**
     * Set default member permissions
     */
    public setDefaultMemberPermissions(permissions: bigint): this {
        this.builder.setDefaultMemberPermissions(permissions);
        return this;
    }

    /**
     * Add a localized subcommand
     */
    public addLocalizedSubcommand(
        subcommandName: string, 
        language: SupportedLanguage = 'en',
        callback?: (subcommand: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder
    ): this {
        const subcommandData = this.languageService.getSubcommandData(this.commandName, subcommandName, language);
        const subcommand = new SlashCommandSubcommandBuilder()
            .setName(subcommandData.name)
            .setDescription(subcommandData.description);

        if (callback) {
            callback(subcommand);
        }

        this.builder.addSubcommand(subcommand);
        return this;
    }

    /**
     * Add a localized string option to a subcommand
     */
    public addLocalizedStringOption(
        subcommandName: string,
        optionName: string,
        language: SupportedLanguage = 'en',
        callback?: (option: SlashCommandStringOption) => SlashCommandStringOption
    ): this {
        const optionData = this.languageService.getOptionData(this.commandName, subcommandName, optionName, language);
        const option = new SlashCommandStringOption()
            .setName(optionData.name)
            .setDescription(optionData.description)
            .setRequired(true);

        if (callback) {
            callback(option);
        }

        // Find the subcommand and add the option
        const subcommandData = this.languageService.getSubcommandData(this.commandName, subcommandName, language);
        const subcommand = this.builder.options.find(opt => 'name' in opt && opt.name === subcommandData.name) as SlashCommandSubcommandBuilder;
        if (subcommand) {
            subcommand.addStringOption(option);
        }

        return this;
    }

    /**
     * Add a localized user option to a subcommand
     */
    public addLocalizedUserOption(
        subcommandName: string,
        optionName: string,
        language: SupportedLanguage = 'en',
        callback?: (option: SlashCommandUserOption) => SlashCommandUserOption
    ): this {
        const optionData = this.languageService.getOptionData(this.commandName, subcommandName, optionName, language);
        const option = new SlashCommandUserOption()
            .setName(optionData.name)
            .setDescription(optionData.description)
            .setRequired(true);

        if (callback) {
            callback(option);
        }

        const subcommandData = this.languageService.getSubcommandData(this.commandName, subcommandName, language);
        const subcommand = this.builder.options.find(opt => 'name' in opt && opt.name === subcommandData.name) as SlashCommandSubcommandBuilder;
        if (subcommand) {
            subcommand.addUserOption(option);
        }

        return this;
    }

    /**
     * Add a localized role option to a subcommand
     */
    public addLocalizedRoleOption(
        subcommandName: string,
        optionName: string,
        language: SupportedLanguage = 'en',
        callback?: (option: SlashCommandRoleOption) => SlashCommandRoleOption
    ): this {
        const optionData = this.languageService.getOptionData(this.commandName, subcommandName, optionName, language);
        const option = new SlashCommandRoleOption()
            .setName(optionData.name)
            .setDescription(optionData.description)
            .setRequired(true);

        if (callback) {
            callback(option);
        }

        const subcommandData = this.languageService.getSubcommandData(this.commandName, subcommandName, language);
        const subcommand = this.builder.options.find(opt => 'name' in opt && opt.name === subcommandData.name) as SlashCommandSubcommandBuilder;
        if (subcommand) {
            subcommand.addRoleOption(option);
        }

        return this;
    }

    /**
     * Add language choices to a string option
     */
    public addLanguageChoices(language: SupportedLanguage = 'en'): this {
        const choices = this.languageService.getLanguageChoices(language);
        // This would need to be called on a specific option, but for now we'll handle it in the command files
        return this;
    }

    /**
     * Build the final command
     */
    public build(): SlashCommandBuilder {
        return this.builder;
    }

    /**
     * Static method to create a localized command builder
     */
    public static create(commandName: string, language: SupportedLanguage = 'en'): LocalizedCommandBuilder {
        const builder = new LocalizedCommandBuilder(commandName);
        return builder.setLocalizedInfo(language);
    }
}

/**
 * Helper function to create localized slash command data
 */
export function createLocalizedCommandData(commandName: string, language: SupportedLanguage = 'en'): SlashCommandBuilder {
    return LocalizedCommandBuilder.create(commandName, language).build();
}

/**
 * Helper function to get localized command name
 */
export function getLocalizedCommandName(commandName: string, language: SupportedLanguage = 'en'): string {
    const languageService = LanguageService.getInstance();
    return languageService.getCommandName(commandName, language);
}

/**
 * Helper function to get localized command description
 */
export function getLocalizedCommandDescription(commandName: string, language: SupportedLanguage = 'en'): string {
    const languageService = LanguageService.getInstance();
    return languageService.getCommandDescription(commandName, language);
}
