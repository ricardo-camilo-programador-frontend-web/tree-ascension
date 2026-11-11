import { en } from './en'
import type { TranslationSet } from './types'

export type UiKey = keyof NonNullable<TranslationSet['ui']>

export function uiText(copy: TranslationSet, key: UiKey): string {
  return copy.ui?.[key] ?? en.ui?.[key] ?? key
}
