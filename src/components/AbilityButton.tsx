import { Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { type Language, t } from '../i18n'
import { cn } from '../ui/cn'
import { Button } from './ui/Button'

export interface AbilityInfo {
  level: number
  cooldown: number
  maxCooldown: number
  active: boolean
  evolutions: string[]
}

export interface AbilityButtonProps {
  icon: ReactNode
  title: string
  ability: AbilityInfo
  cost: number
  count: number
  canAfford: boolean
  effect: string
  onClick: () => void
  onIconClick?: () => void
  formatNumber: (n: number) => string
  lang: Language
  accentClass: string
  unavailableReason?: string
}

export default function AbilityButton({
  icon,
  title,
  ability,
  cost,
  count,
  canAfford,
  effect,
  onClick,
  onIconClick,
  formatNumber,
  lang,
  accentClass,
  unavailableReason,
}: AbilityButtonProps) {
  const copy = t[lang]
  const isUnlocked = ability.level > 0
  const cooldownPercent =
    isUnlocked && ability.maxCooldown > 0
      ? Math.max(0, Math.min(100, (ability.cooldown / ability.maxCooldown) * 100))
      : 0

  return (
    <article
      className={cn(
        'relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-canopy-line bg-canopy-raised p-3',
        accentClass,
      )}
    >
      {isUnlocked && ability.cooldown > 0 && (
        <div
          className="pointer-events-none absolute inset-y-0 left-0 bg-canopy-leaf/15"
          style={{ width: `${cooldownPercent}%` }}
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 flex items-start gap-3">
        <button
          type="button"
          onClick={onIconClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-canopy-line bg-canopy-bg text-canopy-text"
          aria-label={`${title} — ${copy.description}`}
        >
          {icon}
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-canopy-text">{title}</h3>
          <p className="text-xs font-semibold uppercase tracking-wide text-canopy-muted">
            {isUnlocked ? `${copy.level} ${ability.level}` : copy.locked}
          </p>
        </div>
      </div>
      <p className="relative z-10 truncate text-sm text-canopy-leaf">{effect}</p>
      {unavailableReason ? (
        <p className="relative z-10 rounded-xl border border-canopy-line bg-canopy-bg px-3 py-2 text-sm text-canopy-muted">
          {unavailableReason}
        </p>
      ) : (
        <Button
          variant="secondary"
          onClick={onClick}
          disabled={!canAfford}
          className="relative z-10 w-full"
        >
          <span>
            {isUnlocked ? copy.upgrades : copy.unlock}
            {count > 1 ? ` x${count}` : ''}
          </span>
          <span className="inline-flex items-center gap-1 rounded-lg bg-canopy-bg px-2 py-0.5 font-mono text-sm text-canopy-sap">
            <Zap className="h-3.5 w-3.5" aria-hidden="true" />
            {formatNumber(cost)}
          </span>
        </Button>
      )}
    </article>
  )
}
