/**
 * Adsterra Monetization Module
 *
 * PUBLISHER ID: 5657606
 *
 * HOW TO CHANGE THE ID:
 * Update the VITE_ADSTERRA_PUBLISHER_ID in your .env file.
 *
 * HOW TO DISABLE ADS:
 * Set VITE_ENABLE_ADSTERRA=false in your .env file.
 *
 * HOW TO ADD NEW PLACEMENTS:
 * Use the <AdsterraAd /> component and pass the specific zoneId provided by Adsterra dashboard.
 * Example: <AdsterraAd zoneId="your_zone_id" width={300} height={250} />
 */

export const ADSTERRA_PUBLISHER_ID =
  (import.meta as any).env.VITE_ADSTERRA_PUBLISHER_ID || '5657606'
export const IS_ADS_ENABLED = (import.meta as any).env.VITE_ENABLE_ADSTERRA !== 'false'

const isDev = (import.meta as any).env.DEV

export const logAdsterra = (...args: any[]) => {
  if (isDev) {
    console.warn('[Adsterra]', ...args)
  }
}

let adBlockDetected = false

export const detectAdBlock = async (): Promise<boolean> => {
  if (adBlockDetected) return true
  try {
    await fetch('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
    })
    return false
  } catch (_e) {
    adBlockDetected = true
    logAdsterra('AdBlock detected')
    return true
  }
}

export const loadAdsterraScript = (
  zoneId: string,
  src: string,
  container: HTMLElement,
  retries = 2,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const attemptLoad = (attemptsLeft: number) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.defer = true
      script.src = src

      script.onload = () => resolve()
      script.onerror = () => {
        if (attemptsLeft > 0) {
          logAdsterra(`Retrying ad script for zone: ${zoneId}. Attempts left: ${attemptsLeft}`)
          setTimeout(() => attemptLoad(attemptsLeft - 1), 1000)
        } else {
          logAdsterra(`Failed to load ad script for zone: ${zoneId}`)
          reject(new Error('Script load failed'))
        }
      }

      container.appendChild(script)
    }

    attemptLoad(retries)
  })
}

/**
 * Initializes global ad formats like Popunder, Social Bar, or Smartlink.
 * These formats run globally on the page rather than in a specific container.
 * Call this function once at the root of your application.
 */
export const initGlobalAds = () => {
  if (!IS_ADS_ENABLED || typeof window === 'undefined') return

  // Inject global publisher ID variable as requested
  if (!(window as any).ADSTERRA_PUBLISHER_ID) {
    const pubScript = document.createElement('script')
    pubScript.innerHTML = `const ADSTERRA_PUBLISHER_ID = ${ADSTERRA_PUBLISHER_ID};`
    document.head.appendChild(pubScript)
    ;(window as any).ADSTERRA_PUBLISHER_ID = ADSTERRA_PUBLISHER_ID
  }

  detectAdBlock()
}
