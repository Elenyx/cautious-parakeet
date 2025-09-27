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

    // Command localizations removed - commands now use English names/descriptions only
    // Only response messages are localized

    // Response messages
    responses: {
    errors: {
        serverOnly: "❌ 此命令只能在服务器中使用。",
        dmOnly: "❌ 此命令只能在私信中使用。",
        unknownSubcommand: "❌ 未知的子命令。",
        invalidLanguage: "❌ 选择了无效的语言。",
        permissionDenied: "❌ 您没有使用此命令的权限。",
        adminRequired: "❌ 您需要管理员权限才能使用此命令。",
        supportStaffRequired: "❌ 您需要支持人员权限才能使用此命令。",
        commandError: "❌ 处理命令时发生错误。",
        componentError: "❌ 处理交互时发生错误。",
        languageError: "❌ 更改语言时发生错误。",
        helpError: "❌ 获取帮助信息时发生错误。",
        setupError: "❌ 处理设置向导时发生错误。",
        statsError: "❌ 获取统计信息时发生错误。",
        userInfoError: "❌ 获取用户信息时发生错误。",
        messageInfoError: "❌ 获取消息信息时发生错误。",
        debugError: "❌ 处理调试命令时发生错误。",
        supportRolesError: "❌ 管理支持角色时发生错误。"
    },
    success: {
        languageSet: "✅ 机器人语言已为此服务器设置为 {flag} **{name}**。",
        languageChanged: "✅ 机器人语言已更改为 {flag} **{name}**！",
        currentLanguage: "🌐 当前机器人语言: {flag} **{name}**",
        availableLanguages: "🌐 **可用语言:**\n\n{list}\n\n使用 `/语言 设置` 来更改机器人语言。",
        helpCategory: "❌ 未知的帮助类别。使用 `/帮助` 查看可用选项。",
        supportRoleAdded: "✅ 角色 {role} 已添加为支持人员。",
        supportRoleRemoved: "✅ 角色 {role} 已从支持人员中移除。",
        supportRolesCleared: "✅ 所有支持人员角色已清除。",
        debugConfigShown: "✅ 公会配置已成功显示。",
        debugTranscriptGenerated: "✅ 工单 {ticketId} 的转录已成功生成。"
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
    greeting: "欢迎使用TicketMesh！ 🎫",
    expectation: "我是您的高级Discord工单系统，专为优化服务器支持工作流程而设计！",
    features: "**主要功能:**\n• 交互式设置向导\n• 多类别工单\n• 高级分析\n• 自动转录\n• 支持角色管理",
    quickStart: "**快速开始:**\n• 使用 `/设置向导` 配置您的工单系统\n• 设置工单类别和权限\n• 使用 `/统计` 命令进行监控",
    help: "使用 `/帮助` 探索所有功能和命令",
    links: "资源和支持",
    dashboard: "使用我们的网络仪表板配置工单系统",
    github: "在GitHub上查看源代码并贡献",
    wiki: "全面的指南和文档",
    support: "加入我们的支持服务器获取帮助和更新",
    language: "想要更改语言吗？",
    languageCommand: "您可以使用 `/语言 设置` 命令更改机器人的语言。",
    viewLanguages: "用其他语言查看",
    description: "具有分析和多语言支持的高级Discord工单系统。"
}
} as const;
