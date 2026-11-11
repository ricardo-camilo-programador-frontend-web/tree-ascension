import { RotateCcw, Save, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { type Language, t } from '../i18n'
import { formatNumber } from '../utils/number'
import AbilityButton, { type AbilityInfo } from './AbilityButton'
import AdsterraAd from './AdsterraAd'
import UpgradeButton from './UpgradeButton'
import { IconButton } from './ui/IconButton'
import { SegmentedControl } from './ui/SegmentedControl'

export interface ShopEntry {
  id: string
  title: string
  icon: ReactNode
  level: number
  cost: number
  count: number
  canAfford: boolean
  effect: string
  accentClass: string
  onBuy: () => void
  onInfo: () => void
  ability?: AbilityInfo
  unavailableReason?: string
}

export function ShopPanel({
  lang,
  open,
  onClose,
  entries,
  abilities,
  buyMultiplier,
  onBuyMultiplier,
  onSave,
  onReset,
  canReset,
  resets,
}: {
  lang: Language
  open: boolean
  onClose: () => void
  entries: ShopEntry[]
  abilities: ShopEntry[]
  buyMultiplier: number | 'MAX'
  onBuyMultiplier: (value: number | 'MAX') => void
  onSave: () => void
  onReset: () => void
  canReset: boolean
  resets: number
}) {
  const copy = t[lang]
  const multiplierValue = buyMultiplier === 'MAX' ? 'MAX' : String(buyMultiplier)

  return (
    <aside
      className={
        open
          ? 'fixed inset-x-2 bottom-2 top-16 z-50 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-canopy-line bg-canopy-panel shadow-2xl lg:static lg:inset-auto lg:z-auto lg:w-96 lg:shrink-0 lg:rounded-none lg:border-y-0 lg:border-r-0 lg:shadow-none'
          : 'hidden min-h-0 lg:flex lg:w-96 lg:shrink-0 lg:flex-col lg:border-l lg:border-canopy-line lg:bg-canopy-panel'
      }
    >
      <div className="flex items-center justify-between gap-2 border-b border-canopy-line px-3 py-3">
        <h2 className="font-display text-xl text-canopy-text">{copy.upgrades}</h2>
        <div className="flex items-center gap-1.5">
          <IconButton label={copy.saveGame} onClick={onSave}>
            <Save className="h-4 w-4" />
          </IconButton>
          <IconButton label={copy.resetGame} onClick={onReset} disabled={!canReset}>
            <RotateCcw className="h-4 w-4" />
          </IconButton>
          <IconButton label={copy.close} onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
      </div>
      <p className="border-b border-canopy-line px-3 py-2 text-xs leading-relaxed text-canopy-muted">
        {canReset
          ? `${copy.startingEnergy}: +${formatNumber((resets + 1) * 1000)}`
          : copy.milestoneFirstResetDesc}
      </p>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3 pb-16">
        <SegmentedControl
          label={copy.upgrades}
          value={multiplierValue}
          onChange={value => onBuyMultiplier(value === 'MAX' ? 'MAX' : Number.parseInt(value, 10))}
          options={[
            { value: '1', label: 'x1' },
            { value: '10', label: 'x10' },
            { value: 'MAX', label: 'xMAX' },
          ]}
        />
        <div className="grid gap-3">
          {entries.map(entry => (
            <UpgradeButton
              key={entry.id}
              icon={entry.icon}
              title={entry.title}
              level={entry.level}
              cost={entry.cost}
              count={entry.count}
              canAfford={entry.canAfford}
              effect={entry.effect}
              onClick={entry.onBuy}
              onIconClick={entry.onInfo}
              formatNumber={formatNumber}
              lang={lang}
              accentClass={entry.accentClass}
              unavailableReason={entry.unavailableReason}
            />
          ))}
        </div>
        <section className="grid gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-canopy-muted">
            {copy.abilities}
          </h3>
          {abilities.map(entry =>
            entry.ability ? (
              <AbilityButton
                key={entry.id}
                icon={entry.icon}
                title={entry.title}
                ability={entry.ability}
                cost={entry.cost}
                count={entry.count}
                canAfford={entry.canAfford}
                effect={entry.effect}
                onClick={entry.onBuy}
                onIconClick={entry.onInfo}
                formatNumber={formatNumber}
                lang={lang}
                accentClass={entry.accentClass}
                unavailableReason={entry.unavailableReason}
              />
            ) : null,
          )}
        </section>
        <div className="flex justify-center">
          <AdsterraAd zone="sidebar_banner" width={300} height={250} lazy />
        </div>
      </div>
    </aside>
  )
}
