import { 
    SlashCommandBuilder, 
    ChatInputCommandInteraction, 
    TextDisplayBuilder,
    SectionBuilder,
    ButtonBuilder,
    ButtonStyle,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ContainerBuilder,
    MessageFlags,
    TextChannel,
    EmbedBuilder
} from 'discord.js';
import { GuildConfigDAO } from '../database/GuildConfigDAO';

export const data = new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket system management commands")
    .addSubcommand(subcommand =>
        subcommand
            .setName("deploy")
            .setDescription("Deploy the ticket panel to the current channel")
    );

/**
 * Executes the ticket command with subcommands
 * - deploy: Creates a modern ticket system interface using Discord's new display components
 */
export async function execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'deploy') {
        await handleDeploy(interaction);
    }
}

/**
 * Handle ticket panel deployment
 */
async function handleDeploy(interaction: ChatInputCommandInteraction) {
    const guildConfigDAO = new GuildConfigDAO();
    const guildId = interaction.guildId!;

    // Get guild configuration
    const config = await guildConfigDAO.getGuildConfig(guildId);
    
    if (!config || !config.panel_channel_id) {
        await interaction.reply({
            content: '❌ No panel channel configured. Use `/setup panel` to configure a panel channel first.',
            ephemeral: true
        });
        return;
    }

    // Get the configured panel channel
    const panelChannel = interaction.guild!.channels.cache.get(config.panel_channel_id) as TextChannel;
    
    if (!panelChannel) {
        await interaction.reply({
            content: '❌ The configured panel channel no longer exists. Please reconfigure it using `/setup panel`.',
            ephemeral: true
        });
        return;
    }

    // Check if bot has permissions in the panel channel
    const botPermissions = panelChannel.permissionsFor(interaction.guild!.members.me!);
    if (!botPermissions?.has(['ViewChannel', 'SendMessages'])) {
        await interaction.reply({
            content: `❌ I don't have permission to send messages in ${panelChannel}. Please ensure I have View Channel and Send Messages permissions.`,
            ephemeral: true
        });
        return;
    }
    const components = [
        new ContainerBuilder()
            .setAccentColor(12303291) // Nice blue accent color
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**Support Ticket System**"),
                new TextDisplayBuilder().setContent("Welcome to our support system! Choose the appropriate ticket type below:"),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setLabel("Support Ticket")
                            .setCustomId("ticket_create_support")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("🎫 **Support Ticket** - General help and questions"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel("Report Issue")
                            .setCustomId("ticket_create_report")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("⚠️ **Report Ticket** - Report users, bugs, or issues"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel("Submit Appeal")
                            .setCustomId("ticket_create_appeal")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("⚖️ **Appeal Ticket** - Appeal bans, mutes, or other punishments"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("Billing Support")
                            .setCustomId("ticket_create_billing")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("💳 **Billing Ticket** - Questions regarding payments, subscriptions, or refunds"),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**Guidelines:**"),
                new TextDisplayBuilder().setContent("• Only create one ticket at a time\n• Provide detailed information about your issue\n• Be patient while waiting for staff response\n• Use the close button when your issue is resolved"),
            ),
    ];

    // Send the panel to the configured panel channel
    try {
        await panelChannel.send({
            components: components,
            flags: MessageFlags.IsComponentsV2,
        });

        // Confirm successful deployment
        const successEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle('✅ Ticket Panel Deployed')
            .setDescription(`The ticket panel has been successfully deployed to ${panelChannel}`)
            .addFields({
                name: 'Panel Features',
                value: '• Support Tickets\n• Bug Reports\n• Appeals\n• Billing Support',
                inline: false
            });

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });

    } catch (error) {
        console.error('Error deploying ticket panel:', error);
        await interaction.reply({
            content: `❌ Failed to deploy the ticket panel to ${panelChannel}. Please check my permissions and try again.`,
            ephemeral: true
        });
    }
}