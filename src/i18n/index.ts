import type { Language, TranslationSet, Translations } from './types'

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

import { en } from './en'

const cache: Partial<Record<Language, TranslationSet>> = { en }

const loaders: Record<Exclude<Language, 'en'>, () => Promise<TranslationSet>> = {
  zh: () => import('./zh').then(module => module.zh),
  hi: () => import('./hi').then(module => module.hi),
  es: () => import('./es').then(module => module.es),
  fr: () => import('./fr').then(module => module.fr),
  ar: () => import('./ar').then(module => module.ar),
  bn: () => import('./bn').then(module => module.bn),
  ru: () => import('./ru').then(module => module.ru),
  pt: () => import('./pt').then(module => module.pt),
  ur: () => import('./ur').then(module => module.ur),
  id: () => import('./id').then(module => module.id),
  de: () => import('./de').then(module => module.de),
  ja: () => import('./ja').then(module => module.ja),
  mr: () => import('./mr').then(module => module.mr),
  te: () => import('./te').then(module => module.te),
  tr: () => import('./tr').then(module => module.tr),
  ta: () => import('./ta').then(module => module.ta),
  yue: () => import('./yue').then(module => module.yue),
  vi: () => import('./vi').then(module => module.vi),
  tl: () => import('./tl').then(module => module.tl),
}

function slot(lang: Language): TranslationSet {
  return cache[lang] ?? en
}

export function getCopy(lang: Language): TranslationSet {
  return slot(lang)
}

export function loadLanguage(lang: Language): Promise<TranslationSet> {
  const cached = cache[lang]
  if (cached) return Promise.resolve(cached)
  if (lang === 'en') return Promise.resolve(en)
  return loaders[lang]()
    .then(copy => {
      cache[lang] = copy
      return copy
    })
    .catch(() => en)
}

export const t: Translations = {
  get en() {
    return en
  },
  get zh() {
    return slot('zh')
  },
  get hi() {
    return slot('hi')
  },
  get es() {
    return slot('es')
  },
  get fr() {
    return slot('fr')
  },
  get ar() {
    return slot('ar')
  },
  get bn() {
    return slot('bn')
  },
  get ru() {
    return slot('ru')
  },
  get pt() {
    return slot('pt')
  },
  get ur() {
    return slot('ur')
  },
  get id() {
    return slot('id')
  },
  get de() {
    return slot('de')
  },
  get ja() {
    return slot('ja')
  },
  get mr() {
    return slot('mr')
  },
  get te() {
    return slot('te')
  },
  get tr() {
    return slot('tr')
  },
  get ta() {
    return slot('ta')
  },
  get yue() {
    return slot('yue')
  },
  get vi() {
    return slot('vi')
  },
  get tl() {
    return slot('tl')
  },
}
