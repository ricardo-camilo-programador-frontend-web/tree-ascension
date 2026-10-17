import { type AnalyticsConfig, resolveAnalyticsConfig } from './config'

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] }

declare global {
  interface Window {
    dataLayer?: unknown[]
    clarity?: ClarityFn
  }
}

function appendScript(src: string, attributes: Record<string, string> = {}): void {
  const script = document.createElement('script')
  script.async = true
  script.src = src
  for (const [name, value] of Object.entries(attributes)) {
    script.setAttribute(name, value)
  }
  document.head.appendChild(script)
}

function loadClarity(config: AnalyticsConfig): void {
  if (!config.clarityId) return
  const existing = window.clarity
  window.clarity =
    existing
    ?? ((...args: unknown[]) => {
      window.clarity!.q = window.clarity!.q ?? []
      window.clarity!.q.push(args)
    })
  appendScript(`https://www.clarity.ms/tag/${config.clarityId}`)
}

function loadGa4(config: AnalyticsConfig): void {
  if (!config.ga4Id) return
  window.dataLayer = window.dataLayer || []
  const gtag = (...args: unknown[]) => window.dataLayer!.push(args)
  appendScript(`https://www.googletagmanager.com/gtag/js?id=${config.ga4Id}`)
  gtag('js', new Date())
  gtag('config', config.ga4Id)
}

function loadGtm(config: AnalyticsConfig): boolean {
  if (!config.gtmEnabled || !config.gtmId) return false
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
  appendScript(`https://www.googletagmanager.com/gtm.js?id=${config.gtmId}`)
  return true
}

function loadCounter(config: AnalyticsConfig): void {
  if (!config.counterId) return
  appendScript('https://cdn.counter.dev/script.js', {
    'data-id': config.counterId,
    'data-utcoffset': config.counterUtcOffset,
  })
}

let initialized = false

export function initAnalytics(env: Record<string, string | undefined> = import.meta.env): void {
  if (initialized) return
  initialized = true
  const config = resolveAnalyticsConfig(env)
  if (!config.enabled) return
  loadClarity(config)
  const gtmLoaded = loadGtm(config)
  if (!gtmLoaded || config.gtmGa4Id !== config.ga4Id) {
    loadGa4(config)
  }
  loadCounter(config)
}
