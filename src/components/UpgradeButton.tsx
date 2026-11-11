import { Zap } from 'lucide-react'
import type { ReactNode } from 'react'
import { type Language, t } from '../i18n'
import { cn } from '../ui/cn'
import { Button } from './ui/Button'

export interface UpgradeButtonProps {
  icon: ReactNode
  title: string
  level: number
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

export default function UpgradeButton({
  icon,
  title,
  level,
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
}: UpgradeButtonProps) {
  const copy = t[lang]
  return (
    <article
      className={cn(
        'flex flex-col gap-2 rounded-2xl border border-canopy-line bg-canopy-raised p-3',
        accentClass,
      )}
    >
      <div className="flex items-start gap-3">
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
            {copy.level} {level}
          </p>
        </div>
      </div>
      <p className="truncate text-sm text-canopy-leaf">{effect}</p>
      {unavailableReason ? (
        <p className="rounded-xl border border-canopy-line bg-canopy-bg px-3 py-2 text-sm text-canopy-muted">
          {unavailableReason}
        </p>
      ) : (
        <Button variant="secondary" onClick={onClick} disabled={!canAfford} className="w-full">
          <span>
            {copy.upgrades}
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
