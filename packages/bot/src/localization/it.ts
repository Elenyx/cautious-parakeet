/**
 * Italiano (it) localization data
 */

export const IT_LOCALIZATION = {
    // Language info
    language: {
        name: 'Italiano',
        flag: '🇮🇹',
        nativeName: 'Italiano'
    },

    // Command localizations removed - commands now use English names/descriptions only
    // Only response messages are localized

    // Response messages
    responses: {
    errors: {
        serverOnly: "❌ Questo comando può essere utilizzato solo in un server.",
        dmOnly: "❌ Questo comando può essere utilizzato solo nei messaggi diretti.",
        unknownSubcommand: "❌ Sottocomando sconosciuto.",
        invalidLanguage: "❌ Lingua selezionata non valida.",
        permissionDenied: "❌ Non hai il permesso di utilizzare questo comando.",
        adminRequired: "❌ Hai bisogno dei permessi di Amministratore per utilizzare questo comando.",
        supportStaffRequired: "❌ Hai bisogno dei permessi del personale di supporto per utilizzare questo comando.",
        commandError: "❌ Si è verificato un errore durante l'elaborazione del comando.",
        componentError: "❌ Si è verificato un errore durante l'elaborazione dell'interazione.",
        languageError: "❌ Si è verificato un errore durante la modifica della lingua.",
        helpError: "❌ Si è verificato un errore durante il recupero delle informazioni di aiuto.",
        setupError: "❌ Si è verificato un errore durante l'elaborazione dell'assistente di configurazione.",
        statsError: "❌ Si è verificato un errore durante il recupero delle statistiche.",
        userInfoError: "❌ Si è verificato un errore durante il recupero delle informazioni utente.",
        messageInfoError: "❌ Si è verificato un errore durante il recupero delle informazioni del messaggio.",
        debugError: "❌ Si è verificato un errore durante l'elaborazione del comando debug.",
        supportRolesError: "❌ Si è verificato un errore durante la gestione dei ruoli di supporto."
    },
    success: {
        languageSet: "✅ La lingua del bot è stata impostata su {flag} **{name}** per questo server.",
        languageChanged: "✅ La lingua del bot è stata cambiata in {flag} **{name}**!",
        currentLanguage: "🌐 Lingua attuale del bot: {flag} **{name}**",
        availableLanguages: "🌐 **Lingue Disponibili:**\n\n{list}\n\nUsa `/lingua imposta` per cambiare la lingua del bot.",
        helpCategory: "❌ Categoria di aiuto sconosciuta. Usa `/aiuto` per vedere le opzioni disponibili.",
        supportRoleAdded: "✅ Il ruolo {role} è stato aggiunto come personale di supporto.",
        supportRoleRemoved: "✅ Il ruolo {role} è stato rimosso dal personale di supporto.",
        supportRolesCleared: "✅ Tutti i ruoli del personale di supporto sono stati rimossi.",
        debugConfigShown: "✅ Configurazione della gilda mostrata con successo.",
        debugTranscriptGenerated: "✅ Trascrizione generata con successo per il ticket {ticketId}."
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
    greeting: "Benvenuto su TicketMesh! 🎫",
    expectation: "Sono il tuo sistema di ticket Discord avanzato progettato per semplificare il flusso di supporto del tuo server!",
    features: "**Caratteristiche Principali:**\n• Assistente di Configurazione Interattivo\n• Ticket Multi-Categoria\n• Analisi Avanzate\n• Trascrizioni Automatiche\n• Gestione Ruoli di Supporto",
    quickStart: "**Avvio Rapido:**\n• Usa `/configurazione-assistente` per configurare il tuo sistema di ticket\n• Imposta categorie di ticket e permessi\n• Monitora con il comando `/statistiche`",
    help: "Usa `/aiuto` per esplorare tutte le caratteristiche e i comandi",
    links: "Risorse e Supporto",
    dashboard: "Configura il tuo sistema di ticket con la nostra dashboard web",
    github: "Visualizza il codice sorgente e contribuisci su GitHub",
    wiki: "Guide complete e documentazione",
    support: "Unisciti al nostro server di supporto per aiuto e aggiornamenti",
    language: "Vuoi cambiare la lingua?",
    languageCommand: "Puoi cambiare la lingua del bot usando il comando `/lingua imposta.`",
    viewLanguages: "Visualizza questo in altre lingue",
    description: "Sistema di ticket Discord avanzato con analisi e supporto multi-lingua."
}
} as const;
