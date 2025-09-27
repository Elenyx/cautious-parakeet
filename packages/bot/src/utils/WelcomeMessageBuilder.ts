import {
    ContainerBuilder,
    SectionBuilder,
    TextDisplayBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    MessageFlags,
    MediaGalleryBuilder,
    MediaGalleryItemBuilder
} from 'discord.js';

/**
 * Supported languages for the bot
 */
export const SUPPORTED_LANGUAGES = {
    en: { name: 'English', flag: '🇺🇸' },
    es: { name: 'Español', flag: '🇪🇸' },
    fr: { name: 'Français', flag: '🇫🇷' },
    de: { name: 'Deutsch', flag: '🇩🇪' },
    it: { name: 'Italiano', flag: '🇮🇹' },
    pt: { name: 'Português', flag: '🇵🇹' },
    ru: { name: 'Русский', flag: '🇷🇺' },
    ja: { name: '日本語', flag: '🇯🇵' },
    ko: { name: '한국어', flag: '🇰🇷' },
    zh: { name: '中文', flag: '🇨🇳' }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

/**
 * Welcome message content for different languages
 */
const WELCOME_MESSAGES = {
    en: {
        greeting: "Thank you very much for adding me to such a wonderful server! 😻",
        expectation: "I hope to meet your expectations and help you on your server! 💖",
        prefix: "My default prefix is ! or /",
        help: "You can see all my commands with !help or /help",
        website: "You can also see my list of commands on the website.",
        links: "Links of interest",
        dashboard: "You can configure me with my Dashboard.",
        patreon: "You can unlock cool things on my Patreon!",
        wiki: "If you need a guide, I have a wiki",
        support: "Do you need help? You can join my support server.",
        language: "Do you want to change the language?",
        languageCommand: "You can change the language of the bot using the command `/language set.`",
        viewLanguages: "View this in other languages",
        description: "I am a ticket bot, support system, utilities and much more."
    },
    es: {
        greeting: "¡Muchas gracias por agregarme a un servidor tan maravilloso! 😻",
        expectation: "¡Espero cumplir con tus expectativas y ayudarte en tu servidor! 💖",
        prefix: "Mi prefijo por defecto es ! o /",
        help: "Puedes ver todos mis comandos con !help o /help",
        website: "También puedes ver mi lista de comandos en el sitio web.",
        links: "Enlaces de interés",
        dashboard: "Puedes configurarme con mi Dashboard.",
        patreon: "¡Puedes desbloquear cosas geniales en mi Patreon!",
        wiki: "Si necesitas una guía, tengo una wiki",
        support: "¿Necesitas ayuda? Puedes unirte a mi servidor de soporte.",
        language: "¿Quieres cambiar el idioma?",
        languageCommand: "Puedes cambiar el idioma del bot usando el comando `/language set.`",
        viewLanguages: "Ver esto en otros idiomas",
        description: "Soy un bot de tickets, sistema de soporte, utilidades y mucho más."
    },
    fr: {
        greeting: "Merci beaucoup de m'avoir ajouté à un serveur si merveilleux ! 😻",
        expectation: "J'espère répondre à vos attentes et vous aider sur votre serveur ! 💖",
        prefix: "Mon préfixe par défaut est ! ou /",
        help: "Vous pouvez voir toutes mes commandes avec !help ou /help",
        website: "Vous pouvez également voir ma liste de commandes sur le site web.",
        links: "Liens d'intérêt",
        dashboard: "Vous pouvez me configurer avec mon Dashboard.",
        patreon: "Vous pouvez débloquer des choses cool sur mon Patreon !",
        wiki: "Si vous avez besoin d'un guide, j'ai un wiki",
        support: "Vous avez besoin d'aide ? Vous pouvez rejoindre mon serveur de support.",
        language: "Voulez-vous changer la langue ?",
        languageCommand: "Vous pouvez changer la langue du bot en utilisant la commande `/language set.`",
        viewLanguages: "Voir ceci dans d'autres langues",
        description: "Je suis un bot de tickets, système de support, utilitaires et bien plus encore."
    },
    de: {
        greeting: "Vielen Dank, dass Sie mich zu einem so wunderbaren Server hinzugefügt haben! 😻",
        expectation: "Ich hoffe, Ihre Erwartungen zu erfüllen und Ihnen auf Ihrem Server zu helfen! 💖",
        prefix: "Mein Standard-Präfix ist ! oder /",
        help: "Sie können alle meine Befehle mit !help oder /help sehen",
        website: "Sie können auch meine Befehlsliste auf der Website sehen.",
        links: "Interessante Links",
        dashboard: "Sie können mich mit meinem Dashboard konfigurieren.",
        patreon: "Sie können coole Sachen auf meinem Patreon freischalten!",
        wiki: "Wenn Sie eine Anleitung benötigen, habe ich ein Wiki",
        support: "Brauchen Sie Hilfe? Sie können meinem Support-Server beitreten.",
        language: "Möchten Sie die Sprache ändern?",
        languageCommand: "Sie können die Sprache des Bots mit dem Befehl `/language set.` ändern.",
        viewLanguages: "Dies in anderen Sprachen anzeigen",
        description: "Ich bin ein Ticket-Bot, Support-System, Utilities und vieles mehr."
    },
    it: {
        greeting: "Grazie mille per avermi aggiunto a un server così meraviglioso! 😻",
        expectation: "Spero di soddisfare le tue aspettative e aiutarti nel tuo server! 💖",
        prefix: "Il mio prefisso predefinito è ! o /",
        help: "Puoi vedere tutti i miei comandi con !help o /help",
        website: "Puoi anche vedere la mia lista di comandi sul sito web.",
        links: "Link di interesse",
        dashboard: "Puoi configurarmi con la mia Dashboard.",
        patreon: "Puoi sbloccare cose fantastiche sul mio Patreon!",
        wiki: "Se hai bisogno di una guida, ho una wiki",
        support: "Hai bisogno di aiuto? Puoi unirti al mio server di supporto.",
        language: "Vuoi cambiare la lingua?",
        languageCommand: "Puoi cambiare la lingua del bot usando il comando `/language set.`",
        viewLanguages: "Visualizza questo in altre lingue",
        description: "Sono un bot di ticket, sistema di supporto, utilità e molto altro."
    },
    pt: {
        greeting: "Muito obrigado por me adicionar a um servidor tão maravilhoso! 😻",
        expectation: "Espero atender às suas expectativas e ajudá-lo no seu servidor! 💖",
        prefix: "Meu prefixo padrão é ! ou /",
        help: "Você pode ver todos os meus comandos com !help ou /help",
        website: "Você também pode ver minha lista de comandos no site.",
        links: "Links de interesse",
        dashboard: "Você pode me configurar com meu Dashboard.",
        patreon: "Você pode desbloquear coisas legais no meu Patreon!",
        wiki: "Se você precisar de um guia, tenho uma wiki",
        support: "Precisa de ajuda? Você pode se juntar ao meu servidor de suporte.",
        language: "Quer mudar o idioma?",
        languageCommand: "Você pode mudar o idioma do bot usando o comando `/language set.`",
        viewLanguages: "Ver isso em outros idiomas",
        description: "Sou um bot de tickets, sistema de suporte, utilitários e muito mais."
    },
    ru: {
        greeting: "Большое спасибо за добавление меня на такой замечательный сервер! 😻",
        expectation: "Надеюсь оправдать ваши ожидания и помочь вам на вашем сервере! 💖",
        prefix: "Мой префикс по умолчанию ! или /",
        help: "Вы можете увидеть все мои команды с !help или /help",
        website: "Вы также можете увидеть мой список команд на веб-сайте.",
        links: "Интересные ссылки",
        dashboard: "Вы можете настроить меня с помощью моей панели управления.",
        patreon: "Вы можете разблокировать крутые вещи на моем Patreon!",
        wiki: "Если вам нужен гид, у меня есть вики",
        support: "Нужна помощь? Вы можете присоединиться к моему серверу поддержки.",
        language: "Хотите изменить язык?",
        languageCommand: "Вы можете изменить язык бота с помощью команды `/language set.`",
        viewLanguages: "Посмотреть это на других языках",
        description: "Я бот для тикетов, система поддержки, утилиты и многое другое."
    },
    ja: {
        greeting: "素晴らしいサーバーに追加していただき、ありがとうございます！😻",
        expectation: "あなたの期待に応え、サーバーでお手伝いできることを願っています！💖",
        prefix: "デフォルトのプレフィックスは！または/です",
        help: "！helpまたは/helpですべてのコマンドを確認できます",
        website: "ウェブサイトでもコマンドリストを確認できます。",
        links: "関連リンク",
        dashboard: "ダッシュボードで設定できます。",
        patreon: "Patreonでクールなものをアンロックできます！",
        wiki: "ガイドが必要な場合は、Wikiがあります",
        support: "ヘルプが必要ですか？サポートサーバーに参加できます。",
        language: "言語を変更しますか？",
        languageCommand: "`/language set.`コマンドを使用してボットの言語を変更できます。",
        viewLanguages: "他の言語でこれを表示",
        description: "私はチケットボット、サポートシステム、ユーティリティなどです。"
    },
    ko: {
        greeting: "이렇게 멋진 서버에 저를 추가해 주셔서 정말 감사합니다! 😻",
        expectation: "여러분의 기대에 부응하고 서버에서 도움을 드릴 수 있기를 바랍니다! 💖",
        prefix: "기본 접두사는 ! 또는 /입니다",
        help: "!help 또는 /help로 모든 명령어를 볼 수 있습니다",
        website: "웹사이트에서도 명령어 목록을 볼 수 있습니다.",
        links: "관련 링크",
        dashboard: "대시보드로 저를 설정할 수 있습니다.",
        patreon: "Patreon에서 멋진 것들을 잠금 해제할 수 있습니다!",
        wiki: "가이드가 필요하시면 위키가 있습니다",
        support: "도움이 필요하신가요? 지원 서버에 참여할 수 있습니다.",
        language: "언어를 변경하시겠습니까?",
        languageCommand: "`/language set.` 명령어를 사용하여 봇의 언어를 변경할 수 있습니다.",
        viewLanguages: "다른 언어로 보기",
        description: "저는 티켓 봇, 지원 시스템, 유틸리티 등입니다."
    },
    zh: {
        greeting: "非常感谢您将我添加到如此美妙的服务器！😻",
        expectation: "我希望能够满足您的期望并在您的服务器上为您提供帮助！💖",
        prefix: "我的默认前缀是！或/",
        help: "您可以使用！help或/help查看所有命令",
        website: "您也可以在网站上查看我的命令列表。",
        links: "相关链接",
        dashboard: "您可以使用我的仪表板来配置我。",
        patreon: "您可以在我的Patreon上解锁很酷的东西！",
        wiki: "如果您需要指南，我有一个wiki",
        support: "需要帮助吗？您可以加入我的支持服务器。",
        language: "您想更改语言吗？",
        languageCommand: "您可以使用`/language set.`命令更改机器人的语言。",
        viewLanguages: "用其他语言查看",
        description: "我是一个票务机器人、支持系统、实用工具等等。"
    }
} as const;

/**
 * Welcome Message Builder using Discord Components V2
 */
export class WelcomeMessageBuilder {
    private language: SupportedLanguage;
    private guildId: string;

    constructor(language: SupportedLanguage = 'en', guildId: string) {
        this.language = language;
        this.guildId = guildId;
    }

    /**
     * Build the complete welcome message with Components V2
     */
    public build() {
        const messages = WELCOME_MESSAGES[this.language];
        
        // Banner URL for ImageKit
        const bannerUrl = 'https://ik.imagekit.io/elenyx/Banner.png';

        // Main container with accent color
        const container = new ContainerBuilder()
            .setAccentColor(0x5865F2) // Discord blurple
            .setSpoiler(false);

        // Welcome section with greeting
        const welcomeSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`**${messages.greeting}**\n\n${messages.expectation}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('👋')
                    .setCustomId('welcome_greeting')
                    .setDisabled(true)
            );

        // Banner section using MediaGallery
        const bannerGallery = new MediaGalleryBuilder()
            .addItems(
                new MediaGalleryItemBuilder()
                    .setURL(bannerUrl)
                    .setDescription('TicketMesh Banner')
            );

        // Basic usage section
        const usageSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`**Basic Usage:**\n• ${messages.prefix}\n• ${messages.help}\n• ${messages.website}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('📖')
                    .setCustomId('welcome_usage')
                    .setDisabled(true)
            );

        // Links section
        const linksSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`**${messages.links}:**\n• ${messages.dashboard}\n• ${messages.patreon}\n• ${messages.wiki}\n• ${messages.support}`)
            )
            .setButtonAccessory(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('🔗')
                    .setCustomId('welcome_links')
                    .setDisabled(true)
            );

        // Language selector section
        const languageSection = new SectionBuilder()
            .addTextDisplayComponents(
                new TextDisplayBuilder()
                    .setContent(`💬 **${messages.language}**\n\n${messages.languageCommand}`)
            )
            .setButtonAccessory(
                button => button
                    .setCustomId(`language_select_${this.guildId}`)
                    .setLabel(messages.viewLanguages)
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji({ name: '🌐' })
            );

        // Add all sections to container
        container
            .addSectionComponents(welcomeSection)
            .addMediaGalleryComponents(bannerGallery)
            .addSectionComponents(usageSection)
            .addSectionComponents(linksSection)
            .addSectionComponents(languageSection);

        return {
            components: [container]
        };
    }

    /**
     * Build language selector modal/select menu
     */
    public buildLanguageSelector() {
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`language_change_${this.guildId}`)
            .setPlaceholder('Select a language / Selecciona un idioma')
            .setMinValues(1)
            .setMaxValues(1);

        // Add language options
        Object.entries(SUPPORTED_LANGUAGES).forEach(([code, lang]) => {
            const option = new StringSelectMenuOptionBuilder()
                .setLabel(`${lang.flag} ${lang.name}`)
                .setValue(code)
                .setDescription(`Change language to ${lang.name}`)
                .setDefault(code === this.language);
            
            selectMenu.addOptions(option);
        });

        const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(selectMenu);

        return {
            components: [actionRow],
            ephemeral: true
        };
    }

    /**
     * Get welcome message for specific language
     */
    public static getWelcomeMessage(language: SupportedLanguage) {
        return WELCOME_MESSAGES[language];
    }

    /**
     * Check if language is supported
     */
    public static isLanguageSupported(language: string): language is SupportedLanguage {
        return language in SUPPORTED_LANGUAGES;
    }
}
