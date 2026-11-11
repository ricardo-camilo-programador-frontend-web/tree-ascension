import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { detectAdBlock, IS_ADS_ENABLED, loadAdsterraScript, logAdsterra } from '../ads/adsterra'
import { type Language, t } from '../i18n'
import { uiText } from '../i18n/ui-text'

interface AdsterraAdProps {
  zone: string
  format?: 'native_banner' | 'display_banner' | 'interstitial'
  width?: number
  height?: number
  className?: string
  lazy?: boolean
  fallback?: React.ReactNode
}

export default function AdsterraAd({
  zone,
  format: _format = 'display_banner',
  width = 300,
  height = 250,
  className = '',
  lazy = false,
  fallback,
}: AdsterraAdProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazy)
  const [adBlockActive, setAdBlockActive] = useState(false)

  useEffect(() => {
    if (!IS_ADS_ENABLED) return

    void detectAdBlock()
      .then(isBlocked => {
        if (isBlocked) {
          setAdBlockActive(true)
          setHasError(true)
        }
      })
      .catch(() => {
        setHasError(true)
      })
  }, [])

  useEffect(() => {
    if (!lazy || !shellRef.current || adBlockActive || !IS_ADS_ENABLED) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(shellRef.current)

    return () => observer.disconnect()
  }, [lazy, adBlockActive])

  useEffect(() => {
    if (!IS_ADS_ENABLED || !isVisible || !containerRef.current || adBlockActive) return

    const container = containerRef.current
    let isMounted = true

    // Use requestAnimationFrame to avoid forced reflows
    requestAnimationFrame(() => {
      if (!isMounted) return

      container.innerHTML = ''
      setHasError(false)

      try {
        const conf = document.createElement('script')
        conf.type = 'text/javascript'
        conf.innerHTML = `
          atOptions = {
            'key' : '${zone}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        `
        container.appendChild(conf)

        loadAdsterraScript(
          zone,
          `//www.highperformanceformat.com/${zone}/invoke.js`,
          container,
        ).catch(e => {
          if (isMounted) {
            logAdsterra('Error injecting ad:', e)
            setHasError(true)
          }
        })
      } catch (e) {
        if (isMounted) {
          logAdsterra('Error injecting ad:', e)
          setHasError(true)
        }
      }
    })

    return () => {
      isMounted = false
    }
  }, [zone, width, height, isVisible, adBlockActive])

  if (!IS_ADS_ENABLED) return null

  const language = (document.documentElement.lang || 'en') as Language
  const copy = t[language] ?? t.en
  const frameStyle = { width: '100%', maxWidth: width, minHeight: height }

  return (
    <div
      ref={shellRef}
      className={`adsterra-container w-full max-w-full ${className}`}
      style={{ maxWidth: width }}
    >
      {hasError ? (
        fallback ? (
          fallback
        ) : (
          <div
            role="alert"
            className="flex items-center justify-center rounded-lg border border-canopy-line bg-canopy-bg px-3 text-center text-xs text-canopy-muted"
            style={frameStyle}
          >
            {uiText(copy, 'adError')}
          </div>
        )
      ) : !isVisible ? (
        <div
          role="status"
          className="flex items-center justify-center rounded-lg border border-canopy-line bg-canopy-bg text-xs text-canopy-muted"
          style={frameStyle}
        >
          {uiText(copy, 'adLoading')}
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-lg border border-canopy-line bg-canopy-bg"
          style={frameStyle}
          ref={containerRef}
        />
      )}
    </div>
  )
}
