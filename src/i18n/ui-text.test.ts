import { describe, expect, it } from 'vitest'
import { en } from './en'
import { uiText } from './ui-text'

describe('uiText', () => {
  it('reads the active copy and falls back to English', () => {
    expect(uiText(en, 'gotIt')).toBe('Got it')
    expect(uiText({ ...en, ui: undefined }, 'loading')).toBe('Loading')
  })
})
