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
    MediaGalleryItemBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    type MessageActionRowComponentBuilder
} from 'discord.js';
import { LanguageService } from './LanguageService.js';

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
    },
    es: {
        greeting: "¡Bienvenido a TicketMesh! 🎫",
        expectation: "¡Soy tu sistema avanzado de tickets para Discord diseñado para optimizar el flujo de soporte de tu servidor!",
        features: "**Características Principales:**\n• Asistente de Configuración Interactivo\n• Tickets Multi-Categoría\n• Análisis Avanzados\n• Transcripciones Automáticas\n• Gestión de Roles de Soporte",
        quickStart: "**Inicio Rápido:**\n• Usa `/setup-wizard` para configurar tu sistema de tickets\n• Configura categorías de tickets y permisos\n• Monitorea con el comando `/stats`",
        help: "Usa `/help` para explorar todas las características y comandos",
        links: "Recursos y Soporte",
        dashboard: "Configura tu sistema de tickets con nuestro panel web",
        github: "Ver código fuente y contribuir en GitHub",
        wiki: "Guías completas y documentación",
        support: "Únete a nuestro servidor de soporte para ayuda y actualizaciones",
        language: "¿Quieres cambiar el idioma?",
        languageCommand: "Puedes cambiar el idioma del bot usando el comando `/language set.`",
        viewLanguages: "Ver esto en otros idiomas",
        description: "Sistema avanzado de tickets para Discord con análisis y soporte multi-idioma."
    },
    fr: {
        greeting: "Bienvenue sur TicketMesh ! 🎫",
        expectation: "Je suis votre système de tickets Discord avancé conçu pour rationaliser le flux de support de votre serveur !",
        features: "**Fonctionnalités Clés :**\n• Assistant de Configuration Interactif\n• Tickets Multi-Catégories\n• Analyses Avancées\n• Transcripts Automatiques\n• Gestion des Rôles de Support",
        quickStart: "**Démarrage Rapide :**\n• Utilisez `/setup-wizard` pour configurer votre système de tickets\n• Configurez les catégories de tickets et les permissions\n• Surveillez avec la commande `/stats`",
        help: "Utilisez `/help` pour explorer toutes les fonctionnalités et commandes",
        links: "Ressources et Support",
        dashboard: "Configurez votre système de tickets avec notre tableau de bord web",
        github: "Voir le code source et contribuer sur GitHub",
        wiki: "Guides complets et documentation",
        support: "Rejoignez notre serveur de support pour l'aide et les mises à jour",
        language: "Voulez-vous changer la langue ?",
        languageCommand: "Vous pouvez changer la langue du bot en utilisant la commande `/language set.`",
        viewLanguages: "Voir ceci dans d'autres langues",
        description: "Système de tickets Discord avancé avec analyses et support multi-langues."
    },
    de: {
        greeting: "Willkommen bei TicketMesh! 🎫",
        expectation: "Ich bin Ihr fortschrittliches Discord-Ticket-System, das darauf ausgelegt ist, Ihren Server-Support-Workflow zu optimieren!",
        features: "**Hauptfunktionen:**\n• Interaktiver Setup-Assistent\n• Multi-Kategorie-Tickets\n• Erweiterte Analysen\n• Automatische Transkripte\n• Support-Rollen-Verwaltung",
        quickStart: "**Schnellstart:**\n• Verwenden Sie `/setup-wizard`, um Ihr Ticket-System zu konfigurieren\n• Richten Sie Ticket-Kategorien und Berechtigungen ein\n• Überwachen Sie mit dem `/stats`-Befehl",
        help: "Verwenden Sie `/help`, um alle Funktionen und Befehle zu erkunden",
        links: "Ressourcen & Support",
        dashboard: "Konfigurieren Sie Ihr Ticket-System mit unserem Web-Dashboard",
        github: "Quellcode anzeigen und auf GitHub beitragen",
        wiki: "Umfassende Anleitungen und Dokumentation",
        support: "Treten Sie unserem Support-Server für Hilfe und Updates bei",
        language: "Möchten Sie die Sprache ändern?",
        languageCommand: "Sie können die Sprache des Bots mit dem Befehl `/language set.` ändern.",
        viewLanguages: "Dies in anderen Sprachen anzeigen",
        description: "Fortschrittliches Discord-Ticket-System mit Analysen und mehrsprachiger Unterstützung."
    },
    it: {
        greeting: "Benvenuto su TicketMesh! 🎫",
        expectation: "Sono il tuo sistema di ticket Discord avanzato progettato per semplificare il flusso di supporto del tuo server!",
        features: "**Caratteristiche Principali:**\n• Assistente di Configurazione Interattivo\n• Ticket Multi-Categoria\n• Analisi Avanzate\n• Trascrizioni Automatiche\n• Gestione Ruoli di Supporto",
        quickStart: "**Avvio Rapido:**\n• Usa `/setup-wizard` per configurare il tuo sistema di ticket\n• Imposta categorie di ticket e permessi\n• Monitora con il comando `/stats`",
        help: "Usa `/help` per esplorare tutte le caratteristiche e i comandi",
        links: "Risorse e Supporto",
        dashboard: "Configura il tuo sistema di ticket con la nostra dashboard web",
        github: "Visualizza il codice sorgente e contribuisci su GitHub",
        wiki: "Guide complete e documentazione",
        support: "Unisciti al nostro server di supporto per aiuto e aggiornamenti",
        language: "Vuoi cambiare la lingua?",
        languageCommand: "Puoi cambiare la lingua del bot usando il comando `/language set.`",
        viewLanguages: "Visualizza questo in altre lingue",
        description: "Sistema di ticket Discord avanzato con analisi e supporto multi-lingua."
    },
    pt: {
        greeting: "Bem-vindo ao TicketMesh! 🎫",
        expectation: "Sou seu sistema avançado de tickets para Discord projetado para otimizar o fluxo de suporte do seu servidor!",
        features: "**Características Principais:**\n• Assistente de Configuração Interativo\n• Tickets Multi-Categoria\n• Análises Avançadas\n• Transcrições Automáticas\n• Gestão de Funções de Suporte",
        quickStart: "**Início Rápido:**\n• Use `/setup-wizard` para configurar seu sistema de tickets\n• Configure categorias de tickets e permissões\n• Monitore com o comando `/stats`",
        help: "Use `/help` para explorar todas as características e comandos",
        links: "Recursos e Suporte",
        dashboard: "Configure seu sistema de tickets com nosso painel web",
        github: "Ver código fonte e contribuir no GitHub",
        wiki: "Guias completos e documentação",
        support: "Junte-se ao nosso servidor de suporte para ajuda e atualizações",
        language: "Quer mudar o idioma?",
        languageCommand: "Você pode mudar o idioma do bot usando o comando `/language set.`",
        viewLanguages: "Ver isso em outros idiomas",
        description: "Sistema avançado de tickets para Discord com análises e suporte multi-idioma."
    },
    ru: {
        greeting: "Добро пожаловать в TicketMesh! 🎫",
        expectation: "Я ваш продвинутый Discord-бот для тикетов, созданный для оптимизации рабочего процесса поддержки вашего сервера!",
        features: "**Основные функции:**\n• Интерактивный мастер настройки\n• Тикеты с несколькими категориями\n• Расширенная аналитика\n• Автоматические транскрипты\n• Управление ролями поддержки",
        quickStart: "**Быстрый старт:**\n• Используйте `/setup-wizard` для настройки системы тикетов\n• Настройте категории тикетов и разрешения\n• Отслеживайте с помощью команды `/stats`",
        help: "Используйте `/help` для изучения всех функций и команд",
        links: "Ресурсы и поддержка",
        dashboard: "Настройте систему тикетов с помощью нашей веб-панели",
        github: "Просмотр исходного кода и участие в GitHub",
        wiki: "Подробные руководства и документация",
        support: "Присоединяйтесь к нашему серверу поддержки для помощи и обновлений",
        language: "Хотите изменить язык?",
        languageCommand: "Вы можете изменить язык бота с помощью команды `/language set.`",
        viewLanguages: "Посмотреть это на других языках",
        description: "Продвинутая система тикетов для Discord с аналитикой и многоязычной поддержкой."
    },
    ja: {
        greeting: "TicketMeshへようこそ！🎫",
        expectation: "私は、サーバーのサポートワークフローを効率化するために設計された高度なDiscordチケットシステムです！",
        features: "**主な機能:**\n• インタラクティブセットアップウィザード\n• マルチカテゴリチケット\n• 高度な分析\n• 自動トランスクリプト\n• サポートロール管理",
        quickStart: "**クイックスタート:**\n• `/setup-wizard`を使用してチケットシステムを設定\n• チケットカテゴリと権限を設定\n• `/stats`コマンドで監視",
        help: "`/help`を使用してすべての機能とコマンドを探索",
        links: "リソースとサポート",
        dashboard: "Webダッシュボードでチケットシステムを設定",
        github: "GitHubでソースコードを表示し、貢献",
        wiki: "包括的なガイドとドキュメント",
        support: "ヘルプとアップデートのためにサポートサーバーに参加",
        language: "言語を変更しますか？",
        languageCommand: "`/language set.`コマンドを使用してボットの言語を変更できます。",
        viewLanguages: "他の言語でこれを表示",
        description: "分析と多言語サポートを備えた高度なDiscordチケットシステム。"
    },
    ko: {
        greeting: "TicketMesh에 오신 것을 환영합니다! 🎫",
        expectation: "저는 서버의 지원 워크플로우를 최적화하도록 설계된 고급 Discord 티켓 시스템입니다!",
        features: "**주요 기능:**\n• 대화형 설정 마법사\n• 다중 카테고리 티켓\n• 고급 분석\n• 자동 전사\n• 지원 역할 관리",
        quickStart: "**빠른 시작:**\n• `/setup-wizard`를 사용하여 티켓 시스템 설정\n• 티켓 카테고리와 권한 설정\n• `/stats` 명령어로 모니터링",
        help: "`/help`를 사용하여 모든 기능과 명령어 탐색",
        links: "리소스 및 지원",
        dashboard: "웹 대시보드로 티켓 시스템 설정",
        github: "GitHub에서 소스 코드 보기 및 기여",
        wiki: "포괄적인 가이드 및 문서",
        support: "도움과 업데이트를 위해 지원 서버에 참여",
        language: "언어를 변경하시겠습니까?",
        languageCommand: "`/language set.` 명령어를 사용하여 봇의 언어를 변경할 수 있습니다.",
        viewLanguages: "다른 언어로 보기",
        description: "분석 및 다국어 지원을 갖춘 고급 Discord 티켓 시스템."
    },
    zh: {
        greeting: "欢迎使用TicketMesh！🎫",
        expectation: "我是您的高级Discord票务系统，专为优化服务器支持工作流程而设计！",
        features: "**主要功能:**\n• 交互式设置向导\n• 多类别票务\n• 高级分析\n• 自动转录\n• 支持角色管理",
        quickStart: "**快速开始:**\n• 使用`/setup-wizard`配置票务系统\n• 设置票务类别和权限\n• 使用`/stats`命令进行监控",
        help: "使用`/help`探索所有功能和命令",
        links: "资源和支持",
        dashboard: "使用我们的网络仪表板配置票务系统",
        github: "在GitHub上查看源代码并贡献",
        wiki: "全面的指南和文档",
        support: "加入我们的支持服务器获取帮助和更新",
        language: "您想更改语言吗？",
        languageCommand: "您可以使用`/language set.`命令更改机器人的语言。",
        viewLanguages: "用其他语言查看",
        description: "具有分析和多语言支持的高级Discord票务系统。"
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
        const languageService = LanguageService.getInstance();
        const messages = languageService.getLocalizedWelcomeMessage(this.language);
        
        // Banner URL for ImageKit
        const bannerUrl = 'https://ik.imagekit.io/elenyx/Banner.png';

        // Create language selector
        const languageSelectMenu = new StringSelectMenuBuilder()
            .setCustomId(`language_change_${this.guildId}`)
            .setPlaceholder('Select Languages')
            .setMinValues(1)
            .setMaxValues(1);

        // Add language options
        const allLanguages = languageService.getAllSupportedLanguages();
        Object.entries(allLanguages).forEach(([code, lang]) => {
            const option = new StringSelectMenuOptionBuilder()
                .setLabel(lang.name)
                .setValue(code)
                .setDescription(`Change language to ${lang.name}`)
                .setEmoji({ name: lang.flag })
                .setDefault(code === this.language);
            
            languageSelectMenu.addOptions(option);
        });

        // Main container with accent color
        const container = new ContainerBuilder()
            .setAccentColor(8146337) // Custom color as specified
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**${messages.greeting}**`)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(messages.expectation)
            )
            .addMediaGalleryComponents(
                new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                            .setURL(bannerUrl)
                            .setDescription('TicketMesh Banner')
                    )
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small)
                    .setDivider(true)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(messages.features)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(messages.quickStart)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`**${messages.links}:**\n• ${messages.dashboard}\n• ${messages.github}\n• ${messages.wiki}\n• ${messages.support}`)
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small)
                    .setDivider(true)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(`💬 **${messages.language}**`)
            )
            .addActionRowComponents(
                new ActionRowBuilder<MessageActionRowComponentBuilder>()
                    .addComponents(languageSelectMenu)
            )
            .addTextDisplayComponents(
                new TextDisplayBuilder().setContent(messages.languageCommand)
            );

        return {
            components: [container],
            flags: MessageFlags.IsComponentsV2
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
            content: '🌐 **Select a language for the bot:**',
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
