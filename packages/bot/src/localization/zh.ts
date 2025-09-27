/**
 * 中文 (zh) localization data
 */

export const ZH_LOCALIZATION = {
    // Language info
    language: {
        name: '中文',
        flag: '🇨🇳',
        nativeName: '中文'
    },

    // Command localizations
    commands: {
    "language": {
        "name": "语言",
        "description": "管理机器人语言设置",
        "set": {
            "name": "设置",
            "description": "为此服务器设置机器人语言",
            "languageOption": {
                "name": "语言",
                "description": "要设置的语言"
            }
        },
        "current": {
            "name": "当前",
            "description": "显示当前机器人语言"
        },
        "list": {
            "name": "列表",
            "description": "显示所有可用语言"
        }
    },
    "help": {
        "name": "帮助",
        "description": "获取TicketMesh的帮助和使用说明",
        "overview": {
            "name": "概述",
            "description": "获取TicketMesh功能的总体概述"
        },
        "commands": {
            "name": "命令",
            "description": "查看所有可用命令及其用法"
        },
        "setup": {
            "name": "设置",
            "description": "获取设置票务系统的帮助"
        },
        "tickets": {
            "name": "工单",
            "description": "学习如何使用工单系统"
        },
        "permissions": {
            "name": "权限",
            "description": "了解所需的权限和角色"
        },
        "support": {
            "name": "支持",
            "description": "获取支持和联系信息"
        }
    },
    "setupWizard": {
        "name": "设置向导",
        "description": "工单系统的交互式设置向导（仅管理员）"
    },
    "supportRoles": {
        "name": "支持角色",
        "description": "管理工单系统的支持人员角色（仅管理员）",
        "list": {
            "name": "列表",
            "description": "列出所有配置的支持人员角色"
        },
        "add": {
            "name": "添加",
            "description": "将角色添加为支持人员",
            "roleOption": {
                "name": "角色",
                "description": "要添加为支持人员的角色"
            }
        },
        "remove": {
            "name": "移除",
            "description": "从支持人员中移除角色",
            "roleOption": {
                "name": "角色",
                "description": "要从支持人员中移除的角色"
            }
        },
        "clear": {
            "name": "清除",
            "description": "移除所有支持人员角色"
        },
        "members": {
            "name": "成员",
            "description": "列出所有具有支持人员角色的成员"
        }
    },
    "stats": {
        "name": "统计",
        "description": "查看工单统计和分析（仅支持人员）",
        "overview": {
            "name": "概述",
            "description": "查看工单统计的总体概述"
        },
        "detailed": {
            "name": "详细",
            "description": "查看详细的工单统计"
        },
        "export": {
            "name": "导出",
            "description": "将统计导出到JSON文件"
        },
        "user": {
            "name": "用户",
            "description": "查看特定用户的统计",
            "userOption": {
                "name": "用户",
                "description": "要查看统计的用户"
            }
        },
        "realtime": {
            "name": "实时",
            "description": "查看实时工单统计"
        }
    },
    "debug": {
        "name": "调试",
        "description": "调试信息和系统状态（仅管理员）",
        "config": {
            "name": "配置",
            "description": "检查当前公会配置"
        },
        "transcript": {
            "name": "转录",
            "description": "测试特定工单的转录生成",
            "ticketIdOption": {
                "name": "ticket_id",
                "description": "要生成转录的工单ID"
            }
        }
    },
    "userinfo": {
        "name": "用户信息",
        "description": "获取用户的详细信息（仅支持人员）",
        "userOption": {
            "name": "用户",
            "description": "要获取信息的用户"
        }
    },
    "messageinfo": {
        "name": "消息信息（支持人员）",
        "description": "获取消息的详细信息"
    }
},

    // Response messages
    responses: {
    "errors": {
        "serverOnly": "❌ 此命令只能在服务器中使用。",
        "dmOnly": "❌ 此命令只能在私信中使用。",
        "unknownSubcommand": "❌ 未知的子命令。",
        "invalidLanguage": "❌ 选择了无效的语言。",
        "permissionDenied": "❌ 您没有使用此命令的权限。",
        "adminRequired": "❌ 您需要管理员权限才能使用此命令。",
        "supportStaffRequired": "❌ 您需要支持人员权限才能使用此命令。",
        "commandError": "❌ 处理命令时发生错误。",
        "componentError": "❌ 处理交互时发生错误。",
        "languageError": "❌ 更改语言时发生错误。",
        "helpError": "❌ 获取帮助信息时发生错误。",
        "setupError": "❌ 处理设置向导时发生错误。",
        "statsError": "❌ 获取统计信息时发生错误。",
        "userInfoError": "❌ 获取用户信息时发生错误。",
        "messageInfoError": "❌ 获取消息信息时发生错误。",
        "debugError": "❌ 处理调试命令时发生错误。",
        "supportRolesError": "❌ 管理支持角色时发生错误。"
    },
    "success": {
        "languageSet": "✅ 机器人语言已为此服务器设置为 {flag} **{name}**。",
        "languageChanged": "✅ 机器人语言已更改为 {flag} **{name}**！",
        "currentLanguage": "🌐 当前机器人语言: {flag} **{name}**",
        "availableLanguages": "🌐 **可用语言:**\n\n{list}\n\n使用 `/语言 设置` 来更改机器人语言。",
        "helpCategory": "❌ 未知的帮助类别。使用 `/帮助` 查看可用选项。",
        "supportRoleAdded": "✅ 角色 {role} 已添加为支持人员。",
        "supportRoleRemoved": "✅ 角色 {role} 已从支持人员中移除。",
        "supportRolesCleared": "✅ 所有支持人员角色已清除。",
        "debugConfigShown": "✅ 公会配置已成功显示。",
        "debugTranscriptGenerated": "✅ 工单 {ticketId} 的转录已成功生成。"
    },
    "languageChoices": {
        "en": "🇺🇸 English",
        "es": "🇪🇸 Español",
        "fr": "🇫🇷 Français",
        "de": "🇩🇪 Deutsch",
        "it": "🇮🇹 Italiano",
        "pt": "🇵🇹 Português",
        "ru": "🇷🇺 Русский",
        "ja": "🇯🇵 日本語",
        "ko": "🇰🇷 한국어",
        "zh": "🇨🇳 中文"
    }
},

    // Welcome messages
    welcome: {
    "greeting": "欢迎使用TicketMesh！ 🎫",
    "expectation": "我是您的高级Discord工单系统，专为优化服务器支持工作流程而设计！",
    "features": "**主要功能:**\n• 交互式设置向导\n• 多类别工单\n• 高级分析\n• 自动转录\n• 支持角色管理",
    "quickStart": "**快速开始:**\n• 使用 `/设置向导` 配置您的工单系统\n• 设置工单类别和权限\n• 使用 `/统计` 命令进行监控",
    "help": "使用 `/帮助` 探索所有功能和命令",
    "links": "资源和支持",
    "dashboard": "使用我们的网络仪表板配置工单系统",
    "github": "在GitHub上查看源代码并贡献",
    "wiki": "全面的指南和文档",
    "support": "加入我们的支持服务器获取帮助和更新",
    "language": "想要更改语言吗？",
    "languageCommand": "您可以使用 `/语言 设置` 命令更改机器人的语言。",
    "viewLanguages": "用其他语言查看",
    "description": "具有分析和多语言支持的高级Discord工单系统。"
}
} as const;
