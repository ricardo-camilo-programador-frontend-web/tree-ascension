import type { Language, Translations } from './types'

export type {
  EvolutionId,
  Language,
  MoringaTranslations,
  TranslationSet,
  Translations,
} from './types'

export const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ru', name: 'Русский' },
  { code: 'pt', name: 'Português' },
  { code: 'ur', name: 'اردو' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'mr', name: 'मराठी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'yue', name: '粵語' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'tl', name: 'Tagalog' },
]

import { ar } from './ar'
import { bn } from './bn'
import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { hi } from './hi'
import { id } from './id'
import { ja } from './ja'
import { mr } from './mr'
import { pt } from './pt'
import { ru } from './ru'
import { ta } from './ta'
import { te } from './te'
import { tl } from './tl'
import { tr } from './tr'
import { ur } from './ur'
import { vi } from './vi'
import { yue } from './yue'
import { zh } from './zh'

export const t: Translations = {
  en,
  zh,
  hi,
  es,
  fr,
  ar,
  bn,
  ru,
  pt,
  ur,
  id,
  de,
  ja,
  mr,
  te,
  tr,
  ta,
  yue,
  vi,
  tl,
}
