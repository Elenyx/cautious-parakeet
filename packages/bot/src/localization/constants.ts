/**
 * Language constants and supported languages configuration
 */

export const SUPPORTED_LANGUAGES = {
    en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
    es: { name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
    fr: { name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
    de: { name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
    it: { name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
    pt: { name: 'Português', flag: '🇵🇹', nativeName: 'Português' },
    ru: { name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
    ja: { name: '日本語', flag: '🇯🇵', nativeName: '日本語' },
    ko: { name: '한국어', flag: '🇰🇷', nativeName: '한국어' },
    zh: { name: '中文', flag: '🇨🇳', nativeName: '中文' }
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;
