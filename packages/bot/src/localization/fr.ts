/**
 * Français (fr) localization data
 */

export const FR_LOCALIZATION = {
    // Language info
    language: {
        name: 'Français',
        flag: '🇫🇷',
        nativeName: 'Français'
    },

    // Command localizations
    commands: {
    language: {
        name: "langue",
        description: "Gérer les paramètres de langue du bot",
        set: {
            name: "définir",
            description: "Définir la langue du bot pour ce serveur",
            languageOption: {
                name: "langue",
                description: "La langue à définir"
            }
        },
        current: {
            name: "actuel",
            description: "Afficher la langue actuelle du bot"
        },
        list: {
            name: "liste",
            description: "Afficher toutes les langues disponibles"
        }
    },
    help: {
        name: "aide",
        description: "Obtenir de l'aide et des instructions d'utilisation pour TicketMesh",
        overview: {
            name: "aperçu",
            description: "Obtenir un aperçu général des fonctionnalités de TicketMesh"
        },
        commands: {
            name: "commandes",
            description: "Voir toutes les commandes disponibles et leur utilisation"
        },
        setup: {
            name: "configuration",
            description: "Obtenir de l'aide pour configurer le système de tickets"
        },
        tickets: {
            name: "tickets",
            description: "Apprendre à utiliser le système de tickets"
        },
        permissions: {
            name: "permissions",
            description: "Comprendre les permissions et rôles requis"
        },
        support: {
            name: "support",
            description: "Obtenir des informations de support et de contact"
        }
    },
    setupWizard: {
        name: "configuration-assistant",
        description: "Assistant de configuration interactif pour le système de tickets (Administrateur uniquement)"
    },
    supportRoles: {
        name: "rôles-support",
        description: "Gérer les rôles du personnel de support pour le système de tickets (Administrateur uniquement)",
        list: {
            name: "liste",
            description: "Lister tous les rôles du personnel de support configurés"
        },
        add: {
            name: "ajouter",
            description: "Ajouter un rôle comme personnel de support",
            roleOption: {
                name: "rôle",
                description: "Le rôle à ajouter comme personnel de support"
            }
        },
        remove: {
            name: "supprimer",
            description: "Supprimer un rôle du personnel de support",
            roleOption: {
                name: "rôle",
                description: "Le rôle à supprimer du personnel de support"
            }
        },
        clear: {
            name: "effacer",
            description: "Supprimer tous les rôles du personnel de support"
        },
        members: {
            name: "membres",
            description: "Lister tous les membres avec des rôles du personnel de support"
        }
    },
    stats: {
        name: "statistiques",
        description: "Voir les statistiques et analyses de tickets (Personnel de support uniquement)",
        overview: {
            name: "aperçu",
            description: "Voir un aperçu général des statistiques de tickets"
        },
        detailed: {
            name: "détaillé",
            description: "Voir des statistiques détaillées de tickets"
        },
        export: {
            name: "exporter",
            description: "Exporter les statistiques vers un fichier JSON"
        },
        user: {
            name: "utilisateur",
            description: "Voir les statistiques d'un utilisateur spécifique",
            userOption: {
                name: "utilisateur",
                description: "Utilisateur pour voir les statistiques"
            }
        },
        realtime: {
            name: "temps-réel",
            description: "Voir les statistiques de tickets en temps réel"
        }
    },
    debug: {
        name: "débogage",
        description: "Déboguer et tester la fonctionnalité du système de tickets (Administrateur uniquement)",
        config: {
            name: "config",
            description: "Vérifier la configuration actuelle de la guilde"
        },
        transcript: {
            name: "transcription",
            description: "Tester la génération de transcription pour un ticket spécifique",
            ticketIdOption: {
                name: "id_ticket",
                description: "L'ID du ticket pour générer la transcription"
            }
        }
    },
    userinfo: {
        name: "Informations de l'Utilisateur (Personnel de Support)",
        description: "Obtenir des informations détaillées sur un utilisateur"
    },
    messageinfo: {
        name: "Informations du Message (Personnel de Support)",
        description: "Obtenir des informations détaillées sur un message"
    }
},

    // Response messages
    responses: {
    errors: {
        serverOnly: "❌ Cette commande ne peut être utilisée que dans un serveur.",
        dmOnly: "❌ Cette commande ne peut être utilisée que dans les messages directs.",
        unknownSubcommand: "❌ Sous-commande inconnue.",
        invalidLanguage: "❌ Langue sélectionnée invalide.",
        permissionDenied: "❌ Vous n'avez pas la permission d'utiliser cette commande.",
        adminRequired: "❌ Vous avez besoin des permissions d'Administrateur pour utiliser cette commande.",
        supportStaffRequired: "❌ Vous avez besoin des permissions du personnel de support pour utiliser cette commande.",
        commandError: "❌ Une erreur s'est produite lors du traitement de la commande.",
        componentError: "❌ Une erreur s'est produite lors du traitement de l'interaction.",
        languageError: "❌ Une erreur s'est produite lors du changement de langue.",
        helpError: "❌ Une erreur s'est produite lors de la récupération des informations d'aide.",
            setupError: "❌ Une erreur s'est produite lors du traitement de l'assistant de configuration.",
            statsError: "❌ Une erreur s'est produite lors de la récupération des statistiques.",
            userInfoError: "❌ Une erreur s'est produite lors de la récupération des informations utilisateur.",
            messageInfoError: "❌ Une erreur s'est produite lors de la récupération des informations du message.",
            debugError: "❌ Une erreur s'est produite lors du traitement de la commande de débogage.",
            supportRolesError: "❌ Une erreur s'est produite lors de la gestion des rôles de support."
    },
    success: {
        languageSet: "✅ La langue du bot a été définie à {flag} **{name}** pour ce serveur.",
        languageChanged: "✅ La langue du bot a été changée à {flag} **{name}**!",
        currentLanguage: "🌐 Langue actuelle du bot : {flag} **{name}**",
        availableLanguages: "🌐 **Langues Disponibles :**\n\n{list}\n\nUtilisez `/langue définir` pour changer la langue du bot.",
        helpCategory: "❌ Catégorie d'aide inconnue. Utilisez `/aide` pour voir les options disponibles.",
        supportRoleAdded: "✅ Le rôle {role} a été ajouté comme personnel de support.",
        supportRoleRemoved: "✅ Le rôle {role} a été supprimé du personnel de support.",
        supportRolesCleared: "✅ Tous les rôles de personnel de support ont été supprimés.",
        debugConfigShown: "✅ Configuration de la guilde affichée avec succès.",
        debugTranscriptGenerated: "✅ Transcription générée avec succès pour le ticket {ticketId}."
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
    greeting: "Bienvenue sur TicketMesh ! 🎫",
    expectation: "Je suis votre système de tickets Discord avancé conçu pour rationaliser le flux de support de votre serveur !",
    features: "**Fonctionnalités Clés :**\n• Assistant de Configuration Interactif\n• Tickets Multi-Catégories\n• Analyses Avancées\n• Transcripts Automatiques\n• Gestion des Rôles de Support",
    quickStart: "**Démarrage Rapide :**\n• Utilisez `/configuration-assistant` pour configurer votre système de tickets\n• Configurez les catégories de tickets et les permissions\n• Surveillez avec la commande `/statistiques`",
    help: "Utilisez `/aide` pour explorer toutes les fonctionnalités et commandes",
    links: "Ressources et Support",
    dashboard: "Configurez votre système de tickets avec notre tableau de bord web",
    github: "Voir le code source et contribuer sur GitHub",
    wiki: "Guides complets et documentation",
    support: "Rejoignez notre serveur de support pour l'aide et les mises à jour",
    language: "Voulez-vous changer la langue ?",
    languageCommand: "Vous pouvez changer la langue du bot en utilisant la commande `/langue définir.`",
    viewLanguages: "Voir ceci dans d'autres langues",
    description: "Système de tickets Discord avancé avec analyses et support multi-langues."
}
} as const;
