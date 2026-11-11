import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { contrastPairs, contrastRatio, palette } from './tokens'

describe('canopy contrast tokens', () => {
  it('keeps every text pair at or above 4.5:1', () => {
    for (const [name, foreground, background] of contrastPairs) {
      expect(contrastRatio(foreground, background), name).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('mirrors the palette in the stylesheet', () => {
    const css = readFileSync('src/index.css', 'utf8').toLowerCase()
    for (const hex of Object.values(palette)) {
      expect(css).toContain(hex)
    }
  })
})
