import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    PermissionFlagsBits,
    TextDisplayBuilder,
    SectionBuilder,
    ButtonBuilder,
    ButtonStyle,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ContainerBuilder,
    MessageFlags,
    ChannelSelectMenuBuilder,
    RoleSelectMenuBuilder,
    ActionRowBuilder,
    ChannelType,
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    RoleSelectMenuInteraction
} from 'discord.js';
import { GuildConfigDAO } from '../database/GuildConfigDAO';
import { ErrorLogger } from '../utils/ErrorLogger';

/**
 * Interactive setup wizard command for configuring the ticket system
 * Uses Discord's Components V2 system for a user-friendly experience
 */
export const data = new SlashCommandBuilder()
    .setName('setup-wizard')
    .setDescription('Interactive setup wizard for the ticket system (Administrator only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
    const errorLogger = ErrorLogger.getInstance();

    try {
        // Check if user has admin permissions
        if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
            await interaction.reply({
                content: '❌ You need Administrator permissions to use this command.',
                ephemeral: true
            });
            return;
        }

        await showSetupWizard(interaction);

    } catch (error) {
        console.error('Error in setup wizard command:', error);
        await errorLogger.logCommandError(error as Error, {
            guildId: interaction.guildId || undefined,
            userId: interaction.user.id,
            commandName: 'setup-wizard'
        });

        const errorMessage = '❌ An error occurred while processing the setup wizard.';
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
            await interaction.reply({ content: errorMessage, ephemeral: true });
        }
    }
}

/**
 * Show the main setup wizard interface
 */
export async function showSetupWizard(interaction: ChatInputCommandInteraction | ButtonInteraction | ChannelSelectMenuInteraction | RoleSelectMenuInteraction) {
    const guildConfigDAO = new GuildConfigDAO();
    const guildId = interaction.guildId!;
    
    // Get current configuration to show progress
    const config = await guildConfigDAO.getGuildConfig(guildId);
    
    const components = [
        new ContainerBuilder()
            .setAccentColor(0x5865F2) // Discord blurple
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**🎛️ Ticket System Setup Wizard**"),
                new TextDisplayBuilder().setContent("Welcome to the interactive setup wizard! This will guide you through configuring your ticket system step by step."),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**📋 Setup Progress:**"),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(config?.category_id ? ButtonStyle.Success : ButtonStyle.Primary)
                            .setLabel(config?.category_id ? "✅ Configured" : "Configure")
                            .setCustomId("setup_category")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`**📁 Ticket Category** ${config?.category_id ? `- <#${config.category_id}>` : '- Not configured'}`),
                        new TextDisplayBuilder().setContent("Set where ticket channels will be created"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(config?.panel_channel_id ? ButtonStyle.Success : ButtonStyle.Primary)
                            .setLabel(config?.panel_channel_id ? "✅ Configured" : "Configure")
                            .setCustomId("setup_panel")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`**🎛️ Panel Channel** ${config?.panel_channel_id ? `- <#${config.panel_channel_id}>` : '- Not configured'}`),
                        new TextDisplayBuilder().setContent("Set where the ticket creation panel will be displayed"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(config?.transcript_channel ? ButtonStyle.Success : ButtonStyle.Primary)
.setLabel(config?.transcript_channel ? "✅ Configured" : "Configure")
                            .setCustomId("setup_transcript")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`**📄 Transcript Channel** ${config?.transcript_channel ? `- <#${config.transcript_channel}>` : '- Not configured'}`),
                        new TextDisplayBuilder().setContent("Set where ticket transcripts will be logged"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(config?.support_role_ids?.length ? ButtonStyle.Success : ButtonStyle.Primary)
                            .setLabel(config?.support_role_ids?.length ? "✅ Configured" : "Configure")
                            .setCustomId("setup_support_roles")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`**👥 Support Roles** ${config?.support_role_ids?.length ? `- ${config.support_role_ids.length} role(s)` : '- Not configured'}`),
                        new TextDisplayBuilder().setContent("Set which roles can manage tickets"),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel("Advanced Settings")
                            .setCustomId("setup_advanced")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("**⚙️ Advanced Configuration**"),
                        new TextDisplayBuilder().setContent("Error logging, cleanup policies, and other settings"),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Deploy Panel")
                            .setCustomId("deploy_panel")
                            .setDisabled(!config?.category_id || !config?.panel_channel_id)
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("**🚀 Deploy Ticket Panel**"),
                        new TextDisplayBuilder().setContent(config?.category_id && config?.panel_channel_id ? 
                            "Ready to deploy! Click to create the ticket panel." : 
                            "Complete category and panel setup first"),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**💡 Quick Tips:**"),
                new TextDisplayBuilder().setContent("• Configure items in order for the best experience\n• Green checkmarks indicate completed setup\n• You can reconfigure any item at any time\n• The panel will be deployed automatically once ready"),
            ),
    ];

    if (interaction.type === 2) { // ChatInputCommandInteraction
        await interaction.reply({
            components: components,
            flags: MessageFlags.IsComponentsV2,
            ephemeral: true
        });
    } else {
        await interaction.update({
            components: components,
            flags: MessageFlags.IsComponentsV2
        });
    }
}

/**
 * Show category selection interface
 */
export async function showCategorySetup(interaction: ButtonInteraction) {
    const components = [
        new ContainerBuilder()
            .setAccentColor(0x5865F2)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**📁 Configure Ticket Category**"),
                new TextDisplayBuilder().setContent("Select the category where ticket channels will be created. The bot needs proper permissions in this category."),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            ),
        new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('category_select')
                    .setPlaceholder('Select a category channel...')
                    .addChannelTypes(ChannelType.GuildCategory)
                    .setMaxValues(1)
            ),
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_to_wizard')
                    .setLabel('← Back to Setup')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];

    await interaction.update({
        components: components,
        flags: MessageFlags.IsComponentsV2
    });
}

/**
 * Show panel channel selection interface
 */
export async function showPanelSetup(interaction: ButtonInteraction) {
    const components = [
        new ContainerBuilder()
            .setAccentColor(0x5865F2)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**🎛️ Configure Panel Channel**"),
                new TextDisplayBuilder().setContent("Select the text channel where the ticket creation panel will be displayed. Users will interact with this panel to create tickets."),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            ),
        new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('panel_channel_select')
                    .setPlaceholder('Select a text channel...')
                    .addChannelTypes(ChannelType.GuildText)
                    .setMaxValues(1)
            ),
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_to_wizard')
                    .setLabel('← Back to Setup')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];

    await interaction.update({
        components: components,
        flags: MessageFlags.IsComponentsV2
    });
}

/**
 * Show transcript channel selection interface
 */
export async function showTranscriptSetup(interaction: ButtonInteraction) {
    const components = [
        new ContainerBuilder()
            .setAccentColor(0x5865F2)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**📄 Configure Transcript Channel**"),
                new TextDisplayBuilder().setContent("Select the text channel where ticket transcripts will be logged when tickets are closed. This helps maintain records of support interactions."),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            ),
        new ActionRowBuilder<ChannelSelectMenuBuilder>()
            .addComponents(
                new ChannelSelectMenuBuilder()
                    .setCustomId('transcript_channel_select')
                    .setPlaceholder('Select a text channel...')
                    .addChannelTypes(ChannelType.GuildText)
                    .setMaxValues(1)
            ),
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_to_wizard')
                    .setLabel('← Back to Setup')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];

    await interaction.update({
        components: components,
        flags: MessageFlags.IsComponentsV2
    });
}

/**
 * Show support roles selection interface
 */
export async function showSupportRolesSetup(interaction: ButtonInteraction) {
    const components = [
        new ContainerBuilder()
            .setAccentColor(0x5865F2)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**👥 Configure Support Roles**"),
                new TextDisplayBuilder().setContent("Select the roles that should be able to manage tickets. Members with these roles will have access to ticket channels and management commands."),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            ),
        new ActionRowBuilder<RoleSelectMenuBuilder>()
            .addComponents(
                new RoleSelectMenuBuilder()
                    .setCustomId('support_roles_select')
                    .setPlaceholder('Select support roles...')
                    .setMaxValues(10) // Allow up to 10 support roles
                    .setMinValues(1)
            ),
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_to_wizard')
                    .setLabel('← Back to Setup')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];

    await interaction.update({
        components: components,
        flags: MessageFlags.IsComponentsV2
    });
}

/**
 * Show advanced settings interface
 */
export async function showAdvancedSetup(interaction: ButtonInteraction) {
    const guildConfigDAO = new GuildConfigDAO();
    const config = await guildConfigDAO.getGuildConfig(interaction.guildId!);

    const components = [
        new ContainerBuilder()
            .setAccentColor(0x5865F2)
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**⚙️ Advanced Configuration**"),
                new TextDisplayBuilder().setContent("Configure additional settings for your ticket system."),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(config?.error_log_channel_id ? ButtonStyle.Success : ButtonStyle.Primary)
                            .setLabel(config?.error_log_channel_id ? "✅ Configured" : "Configure")
                            .setCustomId("setup_error_log")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent(`**🚨 Error Log Channel** ${config?.error_log_channel_id ? `- <#${config.error_log_channel_id}>` : '- Optional'}`),
                        new TextDisplayBuilder().setContent("Channel for bot error logging"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setLabel("Configure")
                            .setCustomId("setup_cleanup")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("**🧹 Cleanup Policies**"),
                        new TextDisplayBuilder().setContent("Automatic deletion of old tickets and logs"),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
            ),
        new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('back_to_wizard')
                    .setLabel('← Back to Setup')
                    .setStyle(ButtonStyle.Secondary)
            )
    ];

    await interaction.update({
        components: components,
        flags: MessageFlags.IsComponentsV2
    });
}