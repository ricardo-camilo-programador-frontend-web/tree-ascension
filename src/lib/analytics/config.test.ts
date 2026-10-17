import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULTS, resolveAnalyticsConfig } from './config'

describe('resolveAnalyticsConfig', () => {
  it('returns defaults for empty env', () => {
    const config = resolveAnalyticsConfig({})
    expect(config).toEqual({
      enabled: true,
      clarityId: DEFAULTS.clarityId,
      ga4Id: DEFAULTS.ga4Id,
      gtmId: '',
      gtmEnabled: false,
      gtmGa4Id: '',
      counterId: DEFAULTS.counterId,
      counterUtcOffset: DEFAULTS.counterUtcOffset,
    })
  })

  it('prefers env values over defaults and trims them', () => {
    const config = resolveAnalyticsConfig({
      VITE_CLARITY_ID: '  other-id  ',
      VITE_COUNTER_UTCOFFSET: ' 2 ',
    })
    expect(config.clarityId).toBe('other-id')
    expect(config.counterUtcOffset).toBe('2')
  })

  it('new name wins over legacy name', () => {
    const config = resolveAnalyticsConfig({
      VITE_GA4_ID: 'G-NEW',
      VITE_GA_MEASUREMENT_ID: 'G-OLD',
    })
    expect(config.ga4Id).toBe('G-NEW')
  })

  it('falls back to legacy name when new name is absent', () => {
    const config = resolveAnalyticsConfig({ VITE_GA_MEASUREMENT_ID: 'G-OLD' })
    expect(config.ga4Id).toBe('G-OLD')
  })

  it('ignores placeholder values', () => {
    const config = resolveAnalyticsConfig({
      VITE_GA4_ID: 'G-XXXXXXXXXX',
      VITE_GTM_ID: 'GTM-XXXXXXX',
    })
    expect(config.ga4Id).toBe(DEFAULTS.ga4Id)
    expect(config.gtmId).toBe('')
  })

  it('kill switch disables analytics', () => {
    expect(resolveAnalyticsConfig({ VITE_ANALYTICS_ENABLED: 'false' }).enabled).toBe(false)
    expect(resolveAnalyticsConfig({ VITE_ANALYTICS_ENABLED: 'true' }).enabled).toBe(true)
  })
})

describe('initAnalytics', () => {
  beforeEach(() => {
    document.head.querySelectorAll('script[src]').forEach(script => {
      script.remove()
    })
    vi.resetModules()
  })

  async function freshInitAnalytics(env: Record<string, string | undefined>) {
    const { initAnalytics } = await import('./analytics')
    initAnalytics(env)
    return Array.from(document.head.querySelectorAll<HTMLScriptElement>('script[src]')).map(
      script => script.src,
    )
  }

  it('does not inject anything when disabled', async () => {
    const sources = await freshInitAnalytics({ VITE_ANALYTICS_ENABLED: 'false' })
    expect(sources).toEqual([])
  })

  it('injects clarity, ga4 and counter by default', async () => {
    const sources = await freshInitAnalytics({})
    expect(sources).toContain('https://www.clarity.ms/tag/vtlmgkvzek')
    expect(sources).toContain(`https://www.googletagmanager.com/gtag/js?id=${DEFAULTS.ga4Id}`)
    expect(sources).toContain('https://cdn.counter.dev/script.js')
  })

  it('skips gtag when GTM handles the same GA4 id', async () => {
    const sources = await freshInitAnalytics({
      VITE_GTM_ENABLED: 'true',
      VITE_GTM_ID: 'GTM-ABC1234',
      VITE_GTM_GA4_ID: DEFAULTS.ga4Id,
    })
    expect(sources).toContain('https://www.googletagmanager.com/gtm.js?id=GTM-ABC1234')
    expect(sources.some(src => src.includes('/gtag/js?'))).toBe(false)
  })

  it('keeps gtag when GTM uses a different GA4 id', async () => {
    const sources = await freshInitAnalytics({
      VITE_GTM_ENABLED: 'true',
      VITE_GTM_ID: 'GTM-ABC1234',
      VITE_GTM_GA4_ID: 'G-OTHER',
    })
    expect(sources.some(src => src.includes('/gtag/js?'))).toBe(true)
  })
})
