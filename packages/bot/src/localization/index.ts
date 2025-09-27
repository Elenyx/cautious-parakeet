/**
 * Main localization index file
 * Exports all localization data and utilities
 */

// Import all language files
import { EN_LOCALIZATION } from './en.js';
import { ES_LOCALIZATION } from './es.js';
import { FR_LOCALIZATION } from './fr.js';
import { DE_LOCALIZATION } from './de.js';
import { IT_LOCALIZATION } from './it.js';
import { PT_LOCALIZATION } from './pt.js';
import { RU_LOCALIZATION } from './ru.js';
import { JA_LOCALIZATION } from './ja.js';
import { KO_LOCALIZATION } from './ko.js';
import { ZH_LOCALIZATION } from './zh.js';

// Language constants
export const SUPPORTED_LANGUAGES = {
    en: EN_LOCALIZATION.language,
    es: ES_LOCALIZATION.language,
    fr: FR_LOCALIZATION.language,
    de: DE_LOCALIZATION.language,
    it: IT_LOCALIZATION.language,
    pt: PT_LOCALIZATION.language,
    ru: RU_LOCALIZATION.language,
    ja: JA_LOCALIZATION.language,
    ko: KO_LOCALIZATION.language,
    zh: ZH_LOCALIZATION.language
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Command localizations removed - commands now use English names/descriptions only

// Response messages
export const RESPONSE_MESSAGES = {
    en: EN_LOCALIZATION.responses,
    es: ES_LOCALIZATION.responses,
    fr: FR_LOCALIZATION.responses,
    de: DE_LOCALIZATION.responses,
    it: IT_LOCALIZATION.responses,
    pt: PT_LOCALIZATION.responses,
    ru: RU_LOCALIZATION.responses,
    ja: JA_LOCALIZATION.responses,
    ko: KO_LOCALIZATION.responses,
    zh: ZH_LOCALIZATION.responses
} as const;

// Welcome messages
export const WELCOME_MESSAGES = {
    en: EN_LOCALIZATION.welcome,
    es: ES_LOCALIZATION.welcome,
    fr: FR_LOCALIZATION.welcome,
    de: DE_LOCALIZATION.welcome,
    it: IT_LOCALIZATION.welcome,
    pt: PT_LOCALIZATION.welcome,
    ru: RU_LOCALIZATION.welcome,
    ja: JA_LOCALIZATION.welcome,
    ko: KO_LOCALIZATION.welcome,
    zh: ZH_LOCALIZATION.welcome
} as const;

// Export LanguageService
export { LanguageService } from '../utils/LanguageService.js';