import { Zap } from 'lucide-react'
import React from 'react'
import { type Language, t } from '../i18n'

export interface UpgradeButtonProps {
  icon: React.ReactNode
  title: string
  level: number
  cost: number
  count: number
  canAfford: boolean
  onClick: () => void
  onIconClick?: () => void
  formatNumber: (n: number) => string
  lang: Language
  colorClass: string
}

export default function UpgradeButton({
  icon,
  title,
  level,
  cost,
  count,
  canAfford,
  onClick,
  onIconClick,
  formatNumber,
  lang,
  colorClass,
}: UpgradeButtonProps) {
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
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
        />
      )}

      {/* Line 1: Icon + Name */}
      <div className="flex items-center gap-3 relative z-10 mb-2">
        <div
          className={`p-2 bg-stone-950 rounded-xl border border-stone-800 transition-all shadow-inner ${onIconClick ? 'cursor-pointer hover:bg-stone-800 hover:border-stone-600 hover:scale-110' : ''}`}
          onClick={e => {
            if (onIconClick) {
              e.stopPropagation()
              onIconClick()
            }
          }}
        >
          {React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
            className: 'w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]',
          })}
        </div>
        <div className="font-bold text-stone-100 text-base leading-tight group-hover:text-white transition-colors">
          {title}
        </div>
      </div>

      {/* Line 2: Level */}
      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest relative z-10 mb-3 ml-1">
        {t[lang].level} {level}
      </div>

      {/* Line 3: Upgrade Button */}
      <button
        onClick={onClick}
        disabled={!canAfford}
        className={`relative z-10 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border font-bold transition-all active:scale-[0.98] ${
          canAfford
            ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-400/50'
            : 'bg-stone-900/50 border-stone-800 text-stone-500 cursor-not-allowed'
        }`}
      >
        <span className="text-sm uppercase tracking-wider">
          {t[lang].upgrades} {count > 1 ? `x${count}` : ''}
        </span>
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-lg border border-black/50">
          <Zap
            className={`w-3.5 h-3.5 ${canAfford ? 'text-yellow-400 fill-yellow-400/20' : 'text-stone-600'}`}
          />
          <span
            className={`font-mono font-black text-sm ${canAfford ? 'text-yellow-400' : 'text-stone-500'}`}
          >
            {formatNumber(cost)}
          </span>
        </div>
      </button>
    </div>
  )
}
