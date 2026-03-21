/**
 * AbilityButton Component
 * Reusable button for purchasing and displaying abilities
 */

import React from 'react';
import { Zap } from 'lucide-react';
import { t, Language } from '../i18n';

interface AbilityButtonProps {
  icon: React.ReactNode;
  title: string;
  ability: {
    level: number;
    cooldown: number;
    maxCooldown: number;
    active: boolean;
    evolutions: string[];
  };
  cost: number;
  count: number;
  canAfford: boolean;
  onClick: () => void;
  onIconClick?: () => void;
  formatNumber: (num: number) => string;
  lang: Language;
  colorClass: string;
}

export default function AbilityButton({
  icon,
  title,
  ability,
  cost,
  count,
  canAfford,
  onClick,
  onIconClick,
  formatNumber,
  lang,
  colorClass,
}: AbilityButtonProps) {
  const isUnlocked = ability.level > 0;
  const cooldownPercent = isUnlocked ? Math.max(0, (ability.cooldown / ability.maxCooldown) * 100) : 0;

  return (
    <div
      className={`relative w-full flex flex-col p-4 rounded-2xl border transition-all duration-200 text-left overflow-hidden group ${
        canAfford
          ? 'bg-stone-800/50 border-stone-700 hover:bg-stone-700/80 hover:border-stone-500 shadow-lg'
          : 'bg-stone-900/30 border-stone-800 opacity-50'
      }`}
    >
      {/* Background Gradient */}
      {canAfford && (
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      )}

      {/* Cooldown Overlay */}
      {isUnlocked && cooldownPercent > 0 && (
        <div
          className="absolute inset-0 bg-stone-950/60 pointer-events-none"
          style={{ clipPath: `inset(${100 - cooldownPercent}% 0 0 0)` }}
        />
      )}

      {/* Line 1: Icon + Name */}
      <div className="flex items-center gap-3 relative z-10 mb-2">
        <div
          className={`p-2 bg-stone-950 rounded-xl border border-stone-800 transition-all shadow-inner ${onIconClick ? 'cursor-pointer hover:bg-stone-800 hover:border-stone-600 hover:scale-110' : ''}`}
          onClick={(e) => {
            if (onIconClick) {
              e.stopPropagation();
              onIconClick();
            }
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' })}
        </div>
        <div className="font-bold text-stone-100 text-base leading-tight group-hover:text-white transition-colors">{title}</div>
        {isUnlocked && (
          <div className="ml-auto text-xs font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-900/50">
            Lv.{ability.level}
          </div>
        )}
      </div>

      {/* Line 2: Cooldown or Status */}
      {isUnlocked && (
        <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest relative z-10 mb-2 ml-1 flex items-center gap-2">
          <span>Cooldown: {ability.cooldown.toFixed(1)}s</span>
          {ability.cooldown <= 0 && <span className="text-emerald-400">Ready!</span>}
        </div>
      )}

      {/* Line 3: Upgrade Button */}
      <button
        onClick={onClick}
        disabled={!canAfford}
        className={`relative z-10 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border font-bold transition-all active:scale-[0.98] ${
          canAfford
            ? 'bg-purple-600/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30 hover:border-purple-400/50'
            : 'bg-stone-900/50 border-stone-800 text-stone-500 cursor-not-allowed'
        }`}
      >
        <span className="text-sm uppercase tracking-wider">{isUnlocked ? 'Upgrade' : 'Unlock'} {count > 1 ? `x${count}` : ''}</span>
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-lg border border-black/50">
          <Zap className={`w-3.5 h-3.5 ${canAfford ? 'text-yellow-400 fill-yellow-400/20' : 'text-stone-600'}`} />
          <span className={`font-mono font-black text-sm ${canAfford ? 'text-yellow-400' : 'text-stone-500'}`}>
            {formatNumber(cost)}
          </span>
        </div>
      </button>
    </div>
  );
}
