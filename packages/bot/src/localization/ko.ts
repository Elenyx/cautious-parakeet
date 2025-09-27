/**
 * 한국어 (ko) localization data
 */

export const KO_LOCALIZATION = {
    // Language info
    language: {
        name: '한국어',
        flag: '🇰🇷',
        nativeName: '한국어'
    },

    // Command localizations
    commands: {
    "language": {
        "name": "언어",
        "description": "봇 언어 설정 관리",
        "set": {
            "name": "설정",
            "description": "이 서버의 봇 언어 설정",
            "languageOption": {
                "name": "언어",
                "description": "설정할 언어"
            }
        },
        "current": {
            "name": "현재",
            "description": "현재 봇 언어 표시"
        },
        "list": {
            "name": "목록",
            "description": "사용 가능한 모든 언어 표시"
        }
    },
    "help": {
        "name": "도움말",
        "description": "TicketMesh에 대한 도움말 및 사용 지침 가져오기",
        "overview": {
            "name": "개요",
            "description": "TicketMesh 기능의 일반적인 개요 가져오기"
        },
        "commands": {
            "name": "명령어",
            "description": "사용 가능한 모든 명령어와 사용법 보기"
        },
        "setup": {
            "name": "설정",
            "description": "티켓 시스템 설정에 대한 도움말 가져오기"
        },
        "tickets": {
            "name": "티켓",
            "description": "티켓 시스템 사용 방법 배우기"
        },
        "permissions": {
            "name": "권한",
            "description": "필요한 권한과 역할 이해하기"
        },
        "support": {
            "name": "지원",
            "description": "지원 및 연락처 정보 가져오기"
        }
    },
    "setupWizard": {
        "name": "설정-마법사",
        "description": "티켓 시스템의 대화형 설정 마법사 (관리자만)"
    },
    "supportRoles": {
        "name": "지원-역할",
        "description": "티켓 시스템의 지원 직원 역할 관리 (관리자만)",
        "list": {
            "name": "목록",
            "description": "설정된 모든 지원 직원 역할 나열"
        },
        "add": {
            "name": "추가",
            "description": "역할을 지원 직원으로 추가",
            "roleOption": {
                "name": "역할",
                "description": "지원 직원으로 추가할 역할"
            }
        },
        "remove": {
            "name": "제거",
            "description": "역할을 지원 직원에서 제거",
            "roleOption": {
                "name": "역할",
                "description": "지원 직원에서 제거할 역할"
            }
        },
        "clear": {
            "name": "지우기",
            "description": "모든 지원 직원 역할 제거"
        },
        "members": {
            "name": "멤버",
            "description": "지원 직원 역할을 가진 모든 멤버 나열"
        }
    },
    "stats": {
        "name": "통계",
        "description": "티켓 통계 및 분석 보기 (지원 직원만)",
        "overview": {
            "name": "개요",
            "description": "티켓 통계의 일반적인 개요 보기"
        },
        "detailed": {
            "name": "상세",
            "description": "상세한 티켓 통계 보기"
        },
        "export": {
            "name": "내보내기",
            "description": "통계를 JSON 파일로 내보내기"
        },
        "user": {
            "name": "사용자",
            "description": "특정 사용자의 통계 보기",
            "userOption": {
                "name": "사용자",
                "description": "통계를 볼 사용자"
            }
        },
        "realtime": {
            "name": "실시간",
            "description": "실시간 티켓 통계 보기"
        }
    },
    "debug": {
        "name": "디버그",
        "description": "디버그 정보 및 시스템 상태 (관리자만)",
        "config": {
            "name": "설정",
            "description": "현재 길드 설정 확인"
        },
        "transcript": {
            "name": "전사",
            "description": "특정 티켓의 전사 생성 테스트",
            "ticketIdOption": {
                "name": "ticket_id",
                "description": "전사를 생성할 티켓의 ID"
            }
        }
    },
    "userinfo": {
        "name": "사용자-정보",
        "description": "사용자에 대한 자세한 정보 가져오기 (지원 직원만)",
        "userOption": {
            "name": "사용자",
            "description": "정보를 가져올 사용자"
        }
    },
    "messageinfo": {
        "name": "메시지 정보 (지원 직원)",
        "description": "메시지에 대한 자세한 정보 가져오기"
    }
},

    // Response messages
    responses: {
    "errors": {
        "serverOnly": "❌ 이 명령어는 서버에서만 사용할 수 있습니다.",
        "dmOnly": "❌ 이 명령어는 다이렉트 메시지에서만 사용할 수 있습니다.",
        "unknownSubcommand": "❌ 알 수 없는 하위 명령어입니다.",
        "invalidLanguage": "❌ 잘못된 언어가 선택되었습니다.",
        "permissionDenied": "❌ 이 명령어를 사용할 권한이 없습니다.",
        "adminRequired": "❌ 이 명령어를 사용하려면 관리자 권한이 필요합니다.",
        "supportStaffRequired": "❌ 이 명령어를 사용하려면 지원 직원 권한이 필요합니다.",
        "commandError": "❌ 명령어 처리 중 오류가 발생했습니다.",
        "componentError": "❌ 상호작용 처리 중 오류가 발생했습니다.",
        "languageError": "❌ 언어 변경 중 오류가 발생했습니다.",
        "helpError": "❌ 도움말 정보를 가져오는 중 오류가 발생했습니다.",
        "setupError": "❌ 설정 마법사 처리 중 오류가 발생했습니다.",
        "statsError": "❌ 통계를 가져오는 중 오류가 발생했습니다.",
        "userInfoError": "❌ 사용자 정보를 가져오는 중 오류가 발생했습니다.",
        "messageInfoError": "❌ 메시지 정보를 가져오는 중 오류가 발생했습니다.",
        "debugError": "❌ 디버그 명령어 처리 중 오류가 발생했습니다.",
        "supportRolesError": "❌ 지원 역할 관리 중 오류가 발생했습니다."
    },
    "success": {
        "languageSet": "✅ 봇 언어가 이 서버에서 {flag} **{name}**로 설정되었습니다.",
        "languageChanged": "✅ 봇 언어가 {flag} **{name}**로 변경되었습니다!",
        "currentLanguage": "🌐 현재 봇 언어: {flag} **{name}**",
        "availableLanguages": "🌐 **사용 가능한 언어:**\n\n{list}\n\n봇 언어를 변경하려면 `/언어 설정`을 사용하세요.",
        "helpCategory": "❌ 알 수 없는 도움말 카테고리입니다. 사용 가능한 옵션을 보려면 `/도움말`을 사용하세요.",
        "supportRoleAdded": "✅ 역할 {role}이(가) 지원 직원으로 추가되었습니다.",
        "supportRoleRemoved": "✅ 역할 {role}이(가) 지원 직원에서 제거되었습니다.",
        "supportRolesCleared": "✅ 모든 지원 직원 역할이 제거되었습니다.",
        "debugConfigShown": "✅ 길드 설정이 성공적으로 표시되었습니다.",
        "debugTranscriptGenerated": "✅ 티켓 {ticketId}의 전사가 성공적으로 생성되었습니다."
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
    "greeting": "TicketMesh에 오신 것을 환영합니다! 🎫",
    "expectation": "서버의 지원 워크플로우를 최적화하도록 설계된 고급 Discord 티켓 시스템입니다!",
    "features": "**주요 기능:**\n• 대화형 설정 마법사\n• 다중 카테고리 티켓\n• 고급 분석\n• 자동 전사\n• 지원 역할 관리",
    "quickStart": "**빠른 시작:**\n• `/설정-마법사`를 사용하여 티켓 시스템 구성\n• 티켓 카테고리와 권한 설정\n• `/통계` 명령어로 모니터링",
    "help": "모든 기능과 명령어를 탐색하려면 `/도움말` 사용",
    "links": "리소스 및 지원",
    "dashboard": "웹 대시보드로 티켓 시스템 구성",
    "github": "GitHub에서 소스 코드 보기 및 기여",
    "wiki": "포괄적인 가이드 및 문서",
    "support": "도움과 업데이트를 위해 지원 서버에 참여",
    "language": "언어를 변경하시겠습니까?",
    "languageCommand": "`/언어 설정` 명령어를 사용하여 봇의 언어를 변경할 수 있습니다.",
    "viewLanguages": "다른 언어로 보기",
    "description": "분석 및 다국어 지원을 갖춘 고급 Discord 티켓 시스템."
}
} as const;
