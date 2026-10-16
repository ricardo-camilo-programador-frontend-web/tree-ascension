export interface AnalyticsConfig {
  enabled: boolean
  clarityId: string
  ga4Id: string
  gtmId: string
  gtmEnabled: boolean
  gtmGa4Id: string
  counterId: string
  counterUtcOffset: string
}

export const DEFAULTS = {
  clarityId: 'vtlmgkvzek',
  ga4Id: 'G-GZGTXLX0G6',
  gtmId: '',
  gtmEnabled: false,
  counterId: 'f30df6f3-776d-4154-959d-0210ac8a8325',
  counterUtcOffset: '-3',
} as const

const PLACEHOLDERS = [/^G-XXXXXXXXXX$/i, /^GTM-XXXXXXX$/i]

function resolveValue(
  env: Record<string, string | undefined>,
  name: string,
  ...fallbackNames: string[]
): string | undefined {
  for (const key of [name, ...fallbackNames]) {
    const value = env[key]?.trim()
    if (value && !PLACEHOLDERS.some(pattern => pattern.test(value))) {
      return value
    }
  }
  return undefined
}

export function resolveAnalyticsConfig(env: Record<string, string | undefined>): AnalyticsConfig {
  const enabled = env.VITE_ANALYTICS_ENABLED?.trim() !== 'false'
  return {
    enabled,
    clarityId: resolveValue(env, 'VITE_CLARITY_ID') ?? DEFAULTS.clarityId,
    ga4Id: resolveValue(env, 'VITE_GA4_ID', 'VITE_GA_MEASUREMENT_ID') ?? DEFAULTS.ga4Id,
    gtmId: resolveValue(env, 'VITE_GTM_ID') ?? DEFAULTS.gtmId,
    gtmEnabled: env.VITE_GTM_ENABLED?.trim() === 'true',
    gtmGa4Id: resolveValue(env, 'VITE_GTM_GA4_ID') ?? '',
    counterId: resolveValue(env, 'VITE_COUNTER_ID', 'VITE_COUNTER_DEV_ID') ?? DEFAULTS.counterId,
    counterUtcOffset: env.VITE_COUNTER_UTCOFFSET?.trim() || DEFAULTS.counterUtcOffset,
  }
}
