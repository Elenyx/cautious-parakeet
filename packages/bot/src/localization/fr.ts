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

    // Command localizations removed - commands now use English names/descriptions only
    // Only response messages are localized

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
