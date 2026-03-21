/**
 * AdBanner Component
 * Container for advertisement banners
 */

import React from 'react';
import AdsterraAd from '../components/AdsterraAd';

interface AdBannerProps {
  zone: string;
  width: number;
  height: number;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export default function AdBanner({ zone, width, height, position }: AdBannerProps) {
  const positionClasses = {
    top: 'lg:hidden w-full h-16 bg-stone-900 border-b border-stone-800 flex items-center justify-center text-stone-700 text-xs border-dashed',
    bottom: 'w-full bg-stone-950 border-t border-stone-900 flex justify-center py-2',
    left: 'hidden lg:block w-32 bg-stone-900 border-r border-stone-800 p-2 flex-shrink-0',
    right: 'hidden lg:block w-32 bg-stone-900 border-l border-stone-800 p-2 flex-shrink-0',
  };

  if (position === 'top') {
    return (
      <div className={positionClasses[position]}>
        Ad Slot Horizontal
      </div>
    );
  }

  if (position === 'left' || position === 'right') {
    return (
      <div className={positionClasses[position]}>
        <div className="w-full h-full bg-stone-950/50 rounded flex items-center justify-center text-stone-700 text-xs text-center border border-dashed border-stone-800">
          Ad Slot<br />Vertical
        </div>
      </div>
    );
  }

  return (
    <div className={positionClasses[position]}>
      <AdsterraAd zone={zone} width={width} height={height} lazy />
    </div>
  );
}
