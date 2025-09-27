/**
 * Spanish (es) localization data
 */

export const ES_LOCALIZATION = {
    // Language info
    language: {
        name: 'Español',
        flag: '🇪🇸',
        nativeName: 'Español'
    },

    // Command localizations removed - commands now use English names/descriptions only
    // Only response messages are localized

    // Response messages
    responses: {
        // Common responses
        errors: {
            serverOnly: '❌ Este comando solo puede usarse en un servidor.',
            dmOnly: '❌ Este comando solo puede usarse en mensajes directos.',
            unknownSubcommand: '❌ Subcomando desconocido.',
            invalidLanguage: '❌ Idioma seleccionado inválido.',
            permissionDenied: '❌ No tienes permisos para usar este comando.',
            adminRequired: '❌ Necesitas permisos de Administrador para usar este comando.',
            supportStaffRequired: '❌ Necesitas permisos de personal de soporte para usar este comando.',
            commandError: '❌ Ocurrió un error al procesar el comando.',
            componentError: '❌ Ocurrió un error al procesar la interacción.',
            languageError: '❌ Ocurrió un error al cambiar el idioma.',
            helpError: '❌ Ocurrió un error al obtener la información de ayuda.',
            setupError: '❌ Ocurrió un error al procesar el asistente de configuración.',
            statsError: '❌ Ocurrió un error al obtener las estadísticas.',
            userInfoError: '❌ Ocurrió un error al obtener la información del usuario.',
            messageInfoError: '❌ Ocurrió un error al obtener la información del mensaje.',
            debugError: '❌ Ocurrió un error al procesar el comando de depuración.',
            supportRolesError: '❌ Ocurrió un error al gestionar los roles de soporte.'
        },
        // Success messages
        success: {
            languageSet: '✅ El idioma del bot ha sido establecido a {flag} **{name}** para este servidor.',
            languageChanged: '✅ El idioma del bot ha sido cambiado a {flag} **{name}**!',
            currentLanguage: '🌐 Idioma actual del bot: {flag} **{name}**',
            availableLanguages: '🌐 **Idiomas Disponibles:**\n\n{list}\n\nUsa `/idioma establecer` para cambiar el idioma del bot.',
            helpCategory: '❌ Categoría de ayuda desconocida. Usa `/ayuda` para ver las opciones disponibles.',
            supportRoleAdded: '✅ El rol {role} ha sido agregado como personal de soporte.',
            supportRoleRemoved: '✅ El rol {role} ha sido removido del personal de soporte.',
            supportRolesCleared: '✅ Todos los roles de personal de soporte han sido eliminados.',
            debugConfigShown: '✅ Configuración del gremio mostrada exitosamente.',
            debugTranscriptGenerated: '✅ Transcripción generada exitosamente para el ticket {ticketId}.'
        },
        // Language choices
        languageChoices: {
            en: '🇺🇸 English',
            es: '🇪🇸 Español',
            fr: '🇫🇷 Français',
            de: '🇩🇪 Deutsch',
            it: '🇮🇹 Italiano',
            pt: '🇵🇹 Português',
            ru: '🇷🇺 Русский',
            ja: '🇯🇵 日本語',
            ko: '🇰🇷 한국어',
            zh: '🇨🇳 中文'
        }
    },

    // Welcome messages
    welcome: {
        greeting: "¡Bienvenido a TicketMesh! 🎫",
        expectation: "¡Soy tu sistema avanzado de tickets para Discord diseñado para optimizar el flujo de soporte de tu servidor!",
        features: "**Características Principales:**\n• Asistente de Configuración Interactivo\n• Tickets Multi-Categoría\n• Análisis Avanzados\n• Transcripciones Automáticas\n• Gestión de Roles de Soporte",
        quickStart: "**Inicio Rápido:**\n• Usa `/configuracion-asistente` para configurar tu sistema de tickets\n• Configura categorías de tickets y permisos\n• Monitorea con el comando `/estadisticas`",
        help: "Usa `/ayuda` para explorar todas las características y comandos",
        links: "Recursos y Soporte",
        dashboard: "Configura tu sistema de tickets con nuestro panel web",
        github: "Ver código fuente y contribuir en GitHub",
        wiki: "Guías completas y documentación",
        support: "Únete a nuestro servidor de soporte para ayuda y actualizaciones",
        language: "¿Quieres cambiar el idioma?",
        languageCommand: "Puedes cambiar el idioma del bot usando el comando `/idioma establecer.`",
        viewLanguages: "Ver esto en otros idiomas",
        description: "Sistema avanzado de tickets para Discord con análisis y soporte multi-idioma."
    }
} as const;
