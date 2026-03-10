import React, { useEffect, useRef, useState } from 'react';
import { IS_ADS_ENABLED } from '../ads/adsterra';

interface AdsterraAdProps {
  zoneId: string;
  format?: 'native_banner' | 'display_banner' | 'interstitial';
  width?: number;
  height?: number;
  className?: string;
}

export default function AdsterraAd({ 
  zoneId, 
  format = 'display_banner', 
  width = 300, 
  height = 250, 
  className = '' 
}: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!IS_ADS_ENABLED || !containerRef.current) return;

    // Clear previous content to avoid duplicates on strict mode re-renders
    containerRef.current.innerHTML = '';
    setHasError(false);

    try {
      // Adsterra configuration object
      const conf = document.createElement('script');
      conf.type = 'text/javascript';
      conf.innerHTML = `
        atOptions = {
          'key' : '${zoneId}',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;

      // Adsterra invoke script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `//www.highperformanceformat.com/${zoneId}/invoke.js`;
      
      script.onerror = () => {
        console.warn(`[Adsterra] Failed to load ad script for zone ${zoneId}. AdBlocker might be enabled.`);
        setHasError(true);
      };

      containerRef.current.appendChild(conf);
      containerRef.current.appendChild(script);
    } catch (e) {
      console.error('[Adsterra] Error injecting ad:', e);
      setHasError(true);
    }
  }, [zoneId, width, height]);

  if (!IS_ADS_ENABLED) return null;

  return (
    <div 
      className={`adsterra-container flex flex-col items-center justify-center bg-stone-900/30 border border-stone-800/50 rounded-lg overflow-hidden ${className}`} 
      style={{ minWidth: width, minHeight: height }}
    >
      {hasError ? (
        <div className="text-stone-500 text-xs text-center p-4 flex flex-col items-center justify-center w-full h-full">
          <span className="opacity-70">Advertisement</span>
          <span className="text-[10px] opacity-40 mt-1">(Please disable AdBlock to support us)</span>
        </div>
      ) : (
        <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
      )}
    </div>
  );
}
