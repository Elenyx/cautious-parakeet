/**
 * Português (pt) localization data
 */

export const PT_LOCALIZATION = {
    // Language info
    language: {
        name: 'Português',
        flag: '🇵🇹',
        nativeName: 'Português'
    },

    // Command localizations removed - commands now use English names/descriptions only
    // Only response messages are localized

    // Response messages
    responses: {
    errors: {
        serverOnly: "❌ Este comando só pode ser usado em um servidor.",
        dmOnly: "❌ Este comando só pode ser usado em mensagens diretas.",
        unknownSubcommand: "❌ Subcomando desconhecido.",
        invalidLanguage: "❌ Idioma selecionado inválido.",
        permissionDenied: "❌ Você não tem permissão para usar este comando.",
        adminRequired: "❌ Você precisa de permissões de Administrador para usar este comando.",
        supportStaffRequired: "❌ Você precisa de permissões da equipe de suporte para usar este comando.",
        commandError: "❌ Ocorreu um erro ao processar o comando.",
        componentError: "❌ Ocorreu um erro ao processar a interação.",
        languageError: "❌ Ocorreu um erro ao alterar o idioma.",
        helpError: "❌ Ocorreu um erro ao obter as informações de ajuda.",
        setupError: "❌ Ocorreu um erro ao processar o assistente de configuração.",
        statsError: "❌ Ocorreu um erro ao obter as estatísticas.",
        userInfoError: "❌ Ocorreu um erro ao obter as informações do usuário.",
        messageInfoError: "❌ Ocorreu um erro ao obter as informações da mensagem.",
        debugError: "❌ Ocorreu um erro ao processar o comando debug.",
        supportRolesError: "❌ Ocorreu um erro ao gerenciar as funções de suporte."
    },
    success: {
        languageSet: "✅ O idioma do bot foi definido para {flag} **{name}** para este servidor.",
        languageChanged: "✅ O idioma do bot foi alterado para {flag} **{name}**!",
        currentLanguage: "🌐 Idioma atual do bot: {flag} **{name}**",
        availableLanguages: "🌐 **Idiomas Disponíveis:**\n\n{list}\n\nUse `/idioma definir` para alterar o idioma do bot.",
        helpCategory: "❌ Categoria de ajuda desconhecida. Use `/ajuda` para ver as opções disponíveis.",
        supportRoleAdded: "✅ A função {role} foi adicionada como equipe de suporte.",
        supportRoleRemoved: "✅ A função {role} foi removida da equipe de suporte.",
        supportRolesCleared: "✅ Todas as funções da equipe de suporte foram removidas.",
        debugConfigShown: "✅ Configuração da guilda exibida com sucesso.",
        debugTranscriptGenerated: "✅ Transcrição gerada com sucesso para o ticket {ticketId}."
    },
    languageChoices: {
        en: "🇺🇸 English",
        es: "🇪🇸 Español",
        fr: "🇫🇷 Français",
        de: "🇩🇪 Deutsch",
        it: "🇮🇹 Italiano",
        pt: "🇵🇹 Português",
        ru: "🇷🇺 Русский",
        ja: "🇯🇵 日本語",
        ko: "🇰🇷 한국어",
        zh: "🇨🇳 中文"
    }
},

    // Welcome messages
    welcome: {
    greeting: "Bem-vindo ao TicketMesh! 🎫",
    expectation: "Sou seu sistema avançado de tickets para Discord projetado para otimizar o fluxo de suporte do seu servidor!",
    features: "**Características Principais:**\n• Assistente de Configuração Interativo\n• Tickets Multi-Categoria\n• Análises Avançadas\n• Transcrições Automáticas\n• Gestão de Funções de Suporte",
    quickStart: "**Início Rápido:**\n• Use `/configuração-assistente` para configurar seu sistema de tickets\n• Configure categorias de tickets e permissões\n• Monitore com o comando `/estatísticas`",
    help: "Use `/ajuda` para explorar todas as características e comandos",
    links: "Recursos e Suporte",
    dashboard: "Configure seu sistema de tickets com nosso painel web",
    github: "Ver código fonte e contribuir no GitHub",
    wiki: "Guias completos e documentação",
    support: "Junte-se ao nosso servidor de suporte para ajuda e atualizações",
    language: "Quer mudar o idioma?",
    languageCommand: "Você pode mudar o idioma do bot usando o comando `/idioma definir.`",
    viewLanguages: "Ver isso em outros idiomas",
    description: "Sistema avançado de tickets para Discord com análises e suporte multi-idioma."
}
} as const;
