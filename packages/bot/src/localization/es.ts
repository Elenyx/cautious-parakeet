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

    // Command localizations
    commands: {
        // Language command
        language: {
            name: 'idioma',
            description: 'Gestionar configuración de idioma del bot',
            set: {
                name: 'establecer',
                description: 'Establecer el idioma del bot para este servidor',
                languageOption: {
                    name: 'idioma',
                    description: 'El idioma a establecer'
                }
            },
            current: {
                name: 'actual',
                description: 'Mostrar el idioma actual del bot'
            },
            list: {
                name: 'lista',
                description: 'Mostrar todos los idiomas disponibles'
            }
        },
        // Help command
        help: {
            name: 'ayuda',
            description: 'Obtener ayuda e instrucciones de uso para TicketMesh',
            overview: {
                name: 'resumen',
                description: 'Obtener una visión general de las características de TicketMesh'
            },
            commands: {
                name: 'comandos',
                description: 'Ver todos los comandos disponibles y su uso'
            },
            setup: {
                name: 'configuracion',
                description: 'Obtener ayuda con la configuración del sistema de tickets'
            },
            tickets: {
                name: 'tickets',
                description: 'Aprender a usar el sistema de tickets'
            },
            permissions: {
                name: 'permisos',
                description: 'Entender los permisos y roles requeridos'
            },
            support: {
                name: 'soporte',
                description: 'Obtener información de soporte y contacto'
            }
        },
        // Setup wizard command
        setupWizard: {
            name: 'configuracion-asistente',
            description: 'Asistente de configuración interactivo para el sistema de tickets (Solo Administrador)'
        },
        // Support roles command
        supportRoles: {
            name: 'roles-soporte',
            description: 'Gestionar roles de personal de soporte para el sistema de tickets (Solo Administrador)',
            list: {
                name: 'lista',
                description: 'Listar todos los roles de personal de soporte configurados'
            },
            add: {
                name: 'agregar',
                description: 'Agregar un rol como personal de soporte',
                roleOption: {
                    name: 'rol',
                    description: 'El rol a agregar como personal de soporte'
                }
            },
            remove: {
                name: 'remover',
                description: 'Remover un rol del personal de soporte',
                roleOption: {
                    name: 'rol',
                    description: 'El rol a remover del personal de soporte'
                }
            },
            clear: {
                name: 'limpiar',
                description: 'Remover todos los roles de personal de soporte'
            },
            members: {
                name: 'miembros',
                description: 'Listar todos los miembros con roles de personal de soporte'
            }
        },
        // Stats command
        stats: {
            name: 'estadisticas',
            description: 'Ver estadísticas y análisis de tickets (Solo Personal de Soporte)',
            overview: {
                name: 'resumen',
                description: 'Ver resumen general de estadísticas de tickets'
            },
            detailed: {
                name: 'detallado',
                description: 'Ver estadísticas detalladas de tickets'
            },
            export: {
                name: 'exportar',
                description: 'Exportar estadísticas a archivo JSON'
            },
            user: {
                name: 'usuario',
                description: 'Ver estadísticas de un usuario específico',
                userOption: {
                    name: 'usuario',
                    description: 'Usuario para ver estadísticas'
                }
            },
            realtime: {
                name: 'tiempo-real',
                description: 'Ver estadísticas de tickets en tiempo real'
            }
        },
        // Debug command
        debug: {
            name: 'depuracion',
            description: 'Depurar y probar la funcionalidad del sistema de tickets (Solo Administrador)',
            config: {
                name: 'configuracion',
                description: 'Verificar la configuración actual del gremio'
            },
            transcript: {
                name: 'transcripcion',
                description: 'Probar la generación de transcripción para un ticket específico',
                ticketIdOption: {
                    name: 'id_ticket',
                    description: 'El ID del ticket para generar la transcripción'
                }
            }
        },
        // User info command (Context Menu)
        userinfo: {
            name: 'Información del Usuario (Personal de Soporte)',
            description: 'Obtener información detallada sobre un usuario'
        },
        // Message info command (Context Menu)
        messageinfo: {
            name: 'Información del Mensaje (Personal de Soporte)',
            description: 'Obtener información detallada sobre un mensaje'
        }
    },

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
