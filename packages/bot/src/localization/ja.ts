/**
 * 日本語 (ja) localization data
 */

export const JA_LOCALIZATION = {
    // Language info
    language: {
        name: '日本語',
        flag: '🇯🇵',
        nativeName: '日本語'
    },

    // Command localizations
    commands: {
    "language": {
        "name": "言語",
        "description": "ボットの言語設定を管理",
        "set": {
            "name": "設定",
            "description": "このサーバーのボット言語を設定",
            "languageOption": {
                "name": "言語",
                "description": "設定する言語"
            }
        },
        "current": {
            "name": "現在",
            "description": "現在のボット言語を表示"
        },
        "list": {
            "name": "一覧",
            "description": "利用可能なすべての言語を表示"
        }
    },
    "help": {
        "name": "ヘルプ",
        "description": "TicketMeshのヘルプと使用方法の説明を取得",
        "overview": {
            "name": "概要",
            "description": "TicketMeshの機能の一般的な概要を取得"
        },
        "commands": {
            "name": "コマンド",
            "description": "利用可能なすべてのコマンドとその使用方法を表示"
        },
        "setup": {
            "name": "セットアップ",
            "description": "チケットシステムの設定に関するヘルプを取得"
        },
        "tickets": {
            "name": "チケット",
            "description": "チケットシステムの使用方法を学ぶ"
        },
        "permissions": {
            "name": "権限",
            "description": "必要な権限とロールを理解する"
        },
        "support": {
            "name": "サポート",
            "description": "サポートと連絡先情報を取得"
        }
    },
    "setupWizard": {
        "name": "セットアップウィザード",
        "description": "チケットシステムのインタラクティブセットアップウィザード（管理者のみ）"
    },
    "supportRoles": {
        "name": "サポートロール",
        "description": "チケットシステムのサポートスタッフロールを管理（管理者のみ）",
        "list": {
            "name": "一覧",
            "description": "設定されたすべてのサポートスタッフロールを表示"
        },
        "add": {
            "name": "追加",
            "description": "ロールをサポートスタッフとして追加",
            "roleOption": {
                "name": "ロール",
                "description": "サポートスタッフとして追加するロール"
            }
        },
        "remove": {
            "name": "削除",
            "description": "ロールをサポートスタッフから削除",
            "roleOption": {
                "name": "ロール",
                "description": "サポートスタッフから削除するロール"
            }
        },
        "clear": {
            "name": "クリア",
            "description": "すべてのサポートスタッフロールを削除"
        },
        "members": {
            "name": "メンバー",
            "description": "サポートスタッフロールを持つすべてのメンバーを表示"
        }
    },
    "stats": {
        "name": "統計",
        "description": "チケット統計と分析を表示（サポートスタッフのみ）",
        "overview": {
            "name": "概要",
            "description": "チケット統計の一般的な概要を表示"
        },
        "detailed": {
            "name": "詳細",
            "description": "詳細なチケット統計を表示"
        },
        "export": {
            "name": "エクスポート",
            "description": "統計をJSONファイルにエクスポート"
        },
        "user": {
            "name": "ユーザー",
            "description": "特定のユーザーの統計を表示",
            "userOption": {
                "name": "ユーザー",
                "description": "統計を表示するユーザー"
            }
        },
        "realtime": {
            "name": "リアルタイム",
            "description": "リアルタイムチケット統計を表示"
        }
    },
    "debug": {
        "name": "デバッグ",
        "description": "デバッグ情報とシステムステータス（管理者のみ）",
        "config": {
            "name": "設定",
            "description": "現在のギルド設定を確認"
        },
        "transcript": {
            "name": "トランスクリプト",
            "description": "特定のチケットのトランスクリプト生成をテスト",
            "ticketIdOption": {
                "name": "ticket_id",
                "description": "トランスクリプトを生成するチケットのID"
            }
        }
    },
    "userinfo": {
        "name": "ユーザー情報",
        "description": "ユーザーの詳細情報を取得（サポートスタッフのみ）",
        "userOption": {
            "name": "ユーザー",
            "description": "情報を取得するユーザー"
        }
    },
    "messageinfo": {
        "name": "メッセージ情報（サポートスタッフ）",
        "description": "メッセージの詳細情報を取得"
    }
},

    // Response messages
    responses: {
    "errors": {
        "serverOnly": "❌ このコマンドはサーバーでのみ使用できます。",
        "dmOnly": "❌ このコマンドはダイレクトメッセージでのみ使用できます。",
        "unknownSubcommand": "❌ 不明なサブコマンドです。",
        "invalidLanguage": "❌ 無効な言語が選択されました。",
        "permissionDenied": "❌ このコマンドを使用する権限がありません。",
        "adminRequired": "❌ このコマンドを使用するには管理者権限が必要です。",
        "supportStaffRequired": "❌ このコマンドを使用するにはサポートスタッフ権限が必要です。",
        "commandError": "❌ コマンドの処理中にエラーが発生しました。",
        "componentError": "❌ インタラクションの処理中にエラーが発生しました。",
        "languageError": "❌ 言語の変更中にエラーが発生しました。",
        "helpError": "❌ ヘルプ情報の取得中にエラーが発生しました。",
        "setupError": "❌ セットアップウィザードの処理中にエラーが発生しました。",
        "statsError": "❌ 統計の取得中にエラーが発生しました。",
        "userInfoError": "❌ ユーザー情報の取得中にエラーが発生しました。",
        "messageInfoError": "❌ メッセージ情報の取得中にエラーが発生しました。",
        "debugError": "❌ デバッグコマンドの処理中にエラーが発生しました。",
        "supportRolesError": "❌ サポートロールの管理中にエラーが発生しました。"
    },
    "success": {
        "languageSet": "✅ ボットの言語がこのサーバーで {flag} **{name}** に設定されました。",
        "languageChanged": "✅ ボットの言語が {flag} **{name}** に変更されました！",
        "currentLanguage": "🌐 現在のボット言語: {flag} **{name}**",
        "availableLanguages": "🌐 **利用可能な言語:**\n\n{list}\n\nボットの言語を変更するには `/言語 設定` を使用してください。",
        "helpCategory": "❌ 不明なヘルプカテゴリです。利用可能なオプションを表示するには `/ヘルプ` を使用してください。",
        "supportRoleAdded": "✅ ロール {role} がサポートスタッフとして追加されました。",
        "supportRoleRemoved": "✅ ロール {role} がサポートスタッフから削除されました。",
        "supportRolesCleared": "✅ すべてのサポートスタッフロールが削除されました。",
        "debugConfigShown": "✅ ギルド設定が正常に表示されました。",
        "debugTranscriptGenerated": "✅ チケット {ticketId} のトランスクリプトが正常に生成されました。"
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
    "greeting": "TicketMeshへようこそ！ 🎫",
    "expectation": "サーバーのサポートワークフローを効率化するために設計された、高度なDiscordチケットシステムです！",
    "features": "**主な機能:**\n• インタラクティブセットアップウィザード\n• マルチカテゴリチケット\n• 高度な分析\n• 自動トランスクリプト\n• サポートロール管理",
    "quickStart": "**クイックスタート:**\n• `/セットアップウィザード`を使用してチケットシステムを設定\n• チケットカテゴリと権限を設定\n• `/統計`コマンドで監視",
    "help": "すべての機能とコマンドを探索するには `/ヘルプ` を使用",
    "links": "リソースとサポート",
    "dashboard": "Webダッシュボードでチケットシステムを設定",
    "github": "GitHubでソースコードを表示し、貢献",
    "wiki": "包括的なガイドとドキュメント",
    "support": "ヘルプとアップデートのためにサポートサーバーに参加",
    "language": "言語を変更しますか？",
    "languageCommand": "`/言語 設定` コマンドを使用してボットの言語を変更できます。",
    "viewLanguages": "他の言語でこれを見る",
    "description": "分析と多言語サポートを備えた高度なDiscordチケットシステム。"
}
} as const;
