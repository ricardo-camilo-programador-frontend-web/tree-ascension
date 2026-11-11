import { describe, expect, it } from 'vitest'
import { getCopy, languages, loadLanguage, t } from './index'

describe('loadLanguage', () => {
  it('keeps English available before other catalogs load', () => {
    expect(getCopy('en').energy).toBe('Energy')
  })

  it('loads every catalog without dropping the save-facing strings', async () => {
    for (const language of languages) {
      const copy = await loadLanguage(language.code)
      expect(copy.energy.length).toBeGreaterThan(0)
      expect(copy.upgrades.length).toBeGreaterThan(0)
      expect(t[language.code].wave.length).toBeGreaterThan(0)
    }
  })
})
