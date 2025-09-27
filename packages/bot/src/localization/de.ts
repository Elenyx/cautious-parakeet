/**
 * Deutsch (de) localization data
 */

export const DE_LOCALIZATION = {
    // Language info
    language: {
        name: 'Deutsch',
        flag: '🇩🇪',
        nativeName: 'Deutsch'
    },

    // Command localizations removed - commands now use English names/descriptions only
    // Only response messages are localized

    // Response messages
    responses: {
    errors: {
        serverOnly: "❌ Dieser Befehl kann nur in einem Server verwendet werden.",
        dmOnly: "❌ Dieser Befehl kann nur in Direktnachrichten verwendet werden.",
        unknownSubcommand: "❌ Unbekannter Unterbefehl.",
        invalidLanguage: "❌ Ungültige Sprache ausgewählt.",
        permissionDenied: "❌ Sie haben keine Berechtigung, diesen Befehl zu verwenden.",
        adminRequired: "❌ Sie benötigen Administrator-Berechtigungen, um diesen Befehl zu verwenden.",
        supportStaffRequired: "❌ Sie benötigen Support-Mitarbeiter-Berechtigungen, um diesen Befehl zu verwenden.",
        commandError: "❌ Ein Fehler ist beim Verarbeiten des Befehls aufgetreten.",
        componentError: "❌ Ein Fehler ist beim Verarbeiten der Interaktion aufgetreten.",
        languageError: "❌ Ein Fehler ist beim Ändern der Sprache aufgetreten.",
        helpError: "❌ Ein Fehler ist beim Abrufen der Hilfeinformationen aufgetreten.",
        setupError: "❌ Ein Fehler ist beim Verarbeiten des Einrichtungsassistenten aufgetreten.",
        statsError: "❌ Ein Fehler ist beim Abrufen der Statistiken aufgetreten.",
        userInfoError: "❌ Ein Fehler ist beim Abrufen der Benutzerinformationen aufgetreten.",
        messageInfoError: "❌ Ein Fehler ist beim Abrufen der Nachrichteninformationen aufgetreten.",
        debugError: "❌ Ein Fehler ist beim Verarbeiten des Debug-Befehls aufgetreten.",
        supportRolesError: "❌ Ein Fehler ist beim Verwalten der Support-Rollen aufgetreten."
    },
    success: {
        languageSet: "✅ Bot-Sprache wurde auf {flag} **{name}** für diesen Server festgelegt.",
        languageChanged: "✅ Bot-Sprache wurde auf {flag} **{name}** geändert!",
        currentLanguage: "🌐 Aktuelle Bot-Sprache: {flag} **{name}**",
        availableLanguages: "🌐 **Verfügbare Sprachen:**\n\n{list}\n\nVerwenden Sie `/sprache festlegen`, um die Bot-Sprache zu ändern.",
        helpCategory: "❌ Unbekannte Hilfe-Kategorie. Verwenden Sie `/hilfe`, um verfügbare Optionen zu sehen.",
        supportRoleAdded: "✅ Rolle {role} wurde als Support-Mitarbeiter hinzugefügt.",
        supportRoleRemoved: "✅ Rolle {role} wurde aus den Support-Mitarbeitern entfernt.",
        supportRolesCleared: "✅ Alle Support-Mitarbeiterrollen wurden gelöscht.",
        debugConfigShown: "✅ Gilden-Konfiguration erfolgreich angezeigt.",
        debugTranscriptGenerated: "✅ Transkript erfolgreich für Ticket {ticketId} generiert."
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
    greeting: "Willkommen bei TicketMesh! 🎫",
    expectation: "Ich bin Ihr fortschrittliches Discord-Ticket-System, das darauf ausgelegt ist, Ihren Server-Support-Workflow zu optimieren!",
    features: "**Hauptfunktionen:**\n• Interaktiver Setup-Assistent\n• Multi-Kategorie-Tickets\n• Erweiterte Analysen\n• Automatische Transkripte\n• Support-Rollen-Verwaltung",
    quickStart: "**Schnellstart:**\n• Verwenden Sie `/einrichtungs-assistent`, um Ihr Ticket-System zu konfigurieren\n• Richten Sie Ticket-Kategorien und Berechtigungen ein\n• Überwachen Sie mit dem `/statistiken`-Befehl",
    help: "Verwenden Sie `/hilfe`, um alle Funktionen und Befehle zu erkunden",
    links: "Ressourcen & Support",
    dashboard: "Konfigurieren Sie Ihr Ticket-System mit unserem Web-Dashboard",
    github: "Quellcode anzeigen und auf GitHub beitragen",
    wiki: "Umfassende Anleitungen und Dokumentation",
    support: "Treten Sie unserem Support-Server für Hilfe und Updates bei",
    language: "Möchten Sie die Sprache ändern?",
    languageCommand: "Sie können die Sprache des Bots mit dem Befehl `/sprache festlegen.` ändern.",
    viewLanguages: "Dies in anderen Sprachen anzeigen",
    description: "Fortschrittliches Discord-Ticket-System mit Analysen und mehrsprachiger Unterstützung."
}
} as const;
