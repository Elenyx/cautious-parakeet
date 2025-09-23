import {
    TextChannel,
    TextDisplayBuilder,
    SectionBuilder,
    ButtonBuilder,
    ButtonStyle,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ContainerBuilder,
    MessageFlags
} from 'discord.js';

/**
 * Deploy the ticket panel to a specified channel using Discord's Components V2 system
 */
export async function deployTicketPanel(channel: TextChannel): Promise<void> {
    const components = [
        new ContainerBuilder()
            .setAccentColor(12303291) // Nice blue accent color
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**🎫 Support Ticket System**"),
                new TextDisplayBuilder().setContent("Welcome to our support system! Choose the appropriate ticket type below to get help from our team."),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setLabel("🎫 Support Ticket")
                            .setCustomId("ticket_create_support")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("**General Support** - Get help with questions, issues, or guidance"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Danger)
                            .setLabel("⚠️ Report Issue")
                            .setCustomId("ticket_create_report")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("**Report Problems** - Report users, bugs, or technical issues"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel("⚖️ Submit Appeal")
                            .setCustomId("ticket_create_appeal")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("**Appeals** - Appeal bans, mutes, or other moderation actions"),
                    ),
            )
            .addSectionComponents(
                new SectionBuilder()
                    .setButtonAccessory(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Success)
                            .setLabel("💳 Billing Support")
                            .setCustomId("ticket_create_billing")
                    )
                    .addTextDisplayComponents(
                        new TextDisplayBuilder().setContent("**Billing & Payments** - Questions about payments, subscriptions, or refunds"),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Large).setDivider(true),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("**📋 Guidelines:**"),
                new TextDisplayBuilder().setContent("• Only create one ticket at a time\n• Provide detailed information about your issue\n• Be patient while waiting for staff response\n• Use the close button when your issue is resolved"),
            )
            .addSeparatorComponents(
                new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false),
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent("*Need immediate help? Check our FAQ or contact an online moderator.*"),
            ),
    ];

    await channel.send({
        components: components,
        flags: MessageFlags.IsComponentsV2,
    });
}