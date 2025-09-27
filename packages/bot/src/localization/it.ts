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

    // Command localizations
    commands: {
    language: {
        name: "lingua",
        description: "Gestisci le impostazioni della lingua del bot",
        set: {
            name: "imposta",
            description: "Imposta la lingua del bot per questo server",
            languageOption: {
                name: "lingua",
                description: "La lingua da impostare"
            }
        },
        current: {
            name: "attuale",
            description: "Mostra la lingua attuale del bot"
        },
        list: {
            name: "lista",
            description: "Mostra tutte le lingue disponibili"
        }
    },
    help: {
        name: "aiuto",
        description: "Ottieni aiuto e istruzioni per l'uso di TicketMesh",
        overview: {
            name: "panoramica",
            description: "Ottieni una panoramica generale delle funzionalità di TicketMesh"
        },
        commands: {
            name: "comandi",
            description: "Visualizza tutti i comandi disponibili e il loro utilizzo"
        },
        setup: {
            name: "configurazione",
            description: "Ottieni aiuto per configurare il sistema di ticket"
        },
        tickets: {
            name: "ticket",
            description: "Impara come usare il sistema di ticket"
        },
        permissions: {
            name: "permessi",
            description: "Comprendi i permessi e i ruoli richiesti"
        },
        support: {
            name: "supporto",
            description: "Ottieni informazioni di supporto e contatto"
        }
    },
    setupWizard: {
        name: "configurazione-assistente",
        description: "Assistente di configurazione interattivo per il sistema di ticket (Solo Amministratore)"
    },
    supportRoles: {
        name: "ruoli-supporto",
        description: "Gestisci i ruoli del personale di supporto per il sistema di ticket (Solo Amministratore)",
        list: {
            name: "lista",
            description: "Elenca tutti i ruoli del personale di supporto configurati"
        },
        add: {
            name: "aggiungi",
            description: "Aggiungi un ruolo come personale di supporto",
            roleOption: {
                name: "ruolo",
                description: "Il ruolo da aggiungere come personale di supporto"
            }
        },
        remove: {
            name: "rimuovi",
            description: "Rimuovi un ruolo dal personale di supporto",
            roleOption: {
                name: "ruolo",
                description: "Il ruolo da rimuovere dal personale di supporto"
            }
        },
        clear: {
            name: "cancella",
            description: "Rimuovi tutti i ruoli del personale di supporto"
        },
        members: {
            name: "membri",
            description: "Elenca tutti i membri con ruoli del personale di supporto"
        }
    },
    stats: {
        name: "statistiche",
        description: "Visualizza statistiche e analisi dei ticket (Solo Personale di Supporto)",
        overview: {
            name: "panoramica",
            description: "Visualizza panoramica generale delle statistiche dei ticket"
        },
        detailed: {
            name: "dettagliate",
            description: "Visualizza statistiche dettagliate dei ticket"
        },
        export: {
            name: "esporta",
            description: "Esporta le statistiche in un file JSON"
        },
        user: {
            name: "utente",
            description: "Visualizza statistiche per un utente specifico",
            userOption: {
                name: "utente",
                description: "Utente per visualizzare le statistiche"
            }
        },
        realtime: {
            name: "tempo-reale",
            description: "Visualizza statistiche dei ticket in tempo reale"
        }
    },
    debug: {
        name: "debug",
        description: "Informazioni di debug e stato del sistema (Solo Amministratore)",
        config: {
            name: "configurazione",
            description: "Controlla la configurazione attuale della gilda"
        },
        transcript: {
            name: "trascrizione",
            description: "Testa la generazione di trascrizioni per un ticket specifico",
            ticketIdOption: {
                name: "ticket_id",
                description: "L'ID del ticket per cui generare la trascrizione"
            }
        }
    },
    userinfo: {
        name: "info-utente",
        description: "Ottieni informazioni dettagliate su un utente (Solo Personale di Supporto)",
        userOption: {
            name: "utente",
            description: "Utente per ottenere informazioni"
        }
    },
    messageinfo: {
        name: "Informazioni del Messaggio (Personale di Supporto)",
        description: "Ottieni informazioni dettagliate su un messaggio"
    }
},

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
