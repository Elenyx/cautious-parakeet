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

    // Command localizations
    commands: {
    language: {
        name: "idioma",
        description: "Gerenciar configurações de idioma do bot",
        set: {
            name: "definir",
            description: "Definir o idioma do bot para este servidor",
            languageOption: {
                name: "idioma",
                description: "O idioma a ser definido"
            }
        },
        current: {
            name: "atual",
            description: "Mostrar o idioma atual do bot"
        },
        list: {
            name: "lista",
            description: "Mostrar todos os idiomas disponíveis"
        }
    },
    help: {
        name: "ajuda",
        description: "Obter ajuda e instruções de uso para o TicketMesh",
        overview: {
            name: "visão-geral",
            description: "Obter uma visão geral das funcionalidades do TicketMesh"
        },
        commands: {
            name: "comandos",
            description: "Ver todos os comandos disponíveis e seu uso"
        },
        setup: {
            name: "configuração",
            description: "Obter ajuda para configurar o sistema de tickets"
        },
        tickets: {
            name: "tickets",
            description: "Aprender como usar o sistema de tickets"
        },
        permissions: {
            name: "permissões",
            description: "Entender as permissões e funções necessárias"
        },
        support: {
            name: "suporte",
            description: "Obter informações de suporte e contato"
        }
    },
    setupWizard: {
        name: "configuração-assistente",
        description: "Assistente de configuração interativo para o sistema de tickets (Apenas Administrador)"
    },
    supportRoles: {
        name: "funções-suporte",
        description: "Gerenciar funções da equipe de suporte para o sistema de tickets (Apenas Administrador)",
        list: {
            name: "lista",
            description: "Listar todas as funções da equipe de suporte configuradas"
        },
        add: {
            name: "adicionar",
            description: "Adicionar uma função como equipe de suporte",
            roleOption: {
                name: "função",
                description: "A função a ser adicionada como equipe de suporte"
            }
        },
        remove: {
            name: "remover",
            description: "Remover uma função da equipe de suporte",
            roleOption: {
                name: "função",
                description: "A função a ser removida da equipe de suporte"
            }
        },
        clear: {
            name: "limpar",
            description: "Remover todas as funções da equipe de suporte"
        },
        members: {
            name: "membros",
            description: "Listar todos os membros com funções da equipe de suporte"
        }
    },
    stats: {
        name: "estatísticas",
        description: "Ver estatísticas e análises de tickets (Apenas Equipe de Suporte)",
        overview: {
            name: "visão-geral",
            description: "Ver visão geral das estatísticas de tickets"
        },
        detailed: {
            name: "detalhadas",
            description: "Ver estatísticas detalhadas de tickets"
        },
        export: {
            name: "exportar",
            description: "Exportar estatísticas para arquivo JSON"
        },
        user: {
            name: "usuário",
            description: "Ver estatísticas de um usuário específico",
            userOption: {
                name: "usuário",
                description: "Usuário para ver estatísticas"
            }
        },
        realtime: {
            name: "tempo-real",
            description: "Ver estatísticas de tickets em tempo real"
        }
    },
    debug: {
        name: "debug",
        description: "Informações de debug e status do sistema (Apenas Administrador)",
        config: {
            name: "configuração",
            description: "Verificar configuração atual da guilda"
        },
        transcript: {
            name: "transcrição",
            description: "Testar geração de transcrição para um ticket específico",
            ticketIdOption: {
                name: "ticket_id",
                description: "O ID do ticket para gerar a transcrição"
            }
        }
    },
    userinfo: {
        name: "info-usuário",
        description: "Obter informações detalhadas sobre um usuário (Apenas Equipe de Suporte)",
        userOption: {
            name: "usuário",
            description: "Usuário para obter informações"
        }
    },
    messageinfo: {
        name: "Informações da Mensagem (Equipe de Suporte)",
        description: "Obter informações detalhadas sobre uma mensagem"
    }
},

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
