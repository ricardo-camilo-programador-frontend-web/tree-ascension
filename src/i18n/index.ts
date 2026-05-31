import type { Language, Translations } from './types';
export type { Language, Translations, TranslationSet, MoringaTranslations } from './types';

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
];

import { en } from './en';
import { zh } from './zh';
import { hi } from './hi';
import { es } from './es';
import { fr } from './fr';
import { ar } from './ar';
import { bn } from './bn';
import { ru } from './ru';
import { pt } from './pt';
import { ur } from './ur';
import { id } from './id';
import { de } from './de';
import { ja } from './ja';
import { mr } from './mr';
import { te } from './te';
import { tr } from './tr';
import { ta } from './ta';
import { yue } from './yue';
import { vi } from './vi';
import { tl } from './tl';

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
};
