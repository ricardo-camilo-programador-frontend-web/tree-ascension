import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { detectAdBlock, IS_ADS_ENABLED, loadAdsterraScript, logAdsterra } from '../ads/adsterra'

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
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazy)
  const [adBlockActive, setAdBlockActive] = useState(false)

  useEffect(() => {
    if (!IS_ADS_ENABLED) return

    detectAdBlock().then(isBlocked => {
      if (isBlocked) {
        setAdBlockActive(true)
        setHasError(true)
      }
    })
  }, [])

  useEffect(() => {
    if (!lazy || !containerRef.current || adBlockActive || !IS_ADS_ENABLED) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(containerRef.current)

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

  return (
    <div
      className={`adsterra-container flex flex-col items-center justify-center bg-stone-900/30 border border-stone-800/50 rounded-lg overflow-hidden ${className}`}
      style={{ minWidth: width, minHeight: height }}
      ref={containerRef}
    >
      {hasError ? (
        fallback ? (
          fallback
        ) : (
          <div className="text-stone-500 text-xs text-center p-4 flex flex-col items-center justify-center w-full h-full">
            <span className="opacity-70">Advertisement</span>
            <span className="text-[10px] opacity-40 mt-1">
              (Please disable AdBlock to support us)
            </span>
          </div>
        )
      ) : (
        <div className="w-full h-full flex items-center justify-center" />
      )}
    </div>
  )
}
