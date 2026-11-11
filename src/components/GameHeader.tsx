import { Settings, Trophy, Zap } from 'lucide-react'
import { type Language, languages, t } from '../i18n'
import { uiText } from '../i18n/ui-text'
import { formatNumber } from '../utils/number'
import { IconButton } from './ui/IconButton'
import { ProgressBar } from './ui/ProgressBar'
import { Stat } from './ui/Stat'

export function GameHeader({
  lang,
  energy,
  wave,
  playerHealth,
  maxPlayerHealth,
  plantLevel,
  plantStage,
  fps,
  onLanguageChange,
  onOpenSettings,
  onOpenProgress,
}: {
  lang: Language
  energy: number
  wave: number
  playerHealth: number
  maxPlayerHealth: number
  plantLevel: number
  plantStage: number
  fps: number
  onLanguageChange: (lang: Language) => void
  onOpenSettings: () => void
  onOpenProgress: () => void
}) {
  const copy = t[lang]
  const hpPercent = maxPlayerHealth > 0 ? (playerHealth / maxPlayerHealth) * 100 : 0

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-2">
      <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-canopy-line bg-canopy-bg px-3">
        <Zap className="h-4 w-4 fill-canopy-sap text-canopy-sap" aria-hidden="true" />
        <span className="font-mono text-xl font-bold tabular-nums text-canopy-sap">
          {formatNumber(energy)}
        </span>
        <span className="sr-only">{copy.energy}</span>
      </div>
      <div className="hidden items-center gap-1 font-mono text-xs text-canopy-muted md:flex">
        <span>FPS</span>
        <span className={fps < 30 ? 'text-canopy-hp' : 'text-canopy-leaf'}>{fps}</span>
      </div>
      <Stat label={copy.wave} value={String(wave)} />
      <div className="min-w-[4.5rem]">
        <Stat label="HP" value={formatNumber(playerHealth)} valueClassName="text-canopy-hp" />
        <ProgressBar value={hpPercent} label="HP" tone="hp" />
      </div>
      <Stat
        label={copy.plantLevel}
        value={`${plantLevel}-${plantStage}`}
        valueClassName="text-canopy-leaf"
      />
      <div className="flex items-center gap-1.5">
        <IconButton label={copy.options} onClick={onOpenSettings}>
          <Settings className="h-4 w-4" />
        </IconButton>
        <IconButton label={copy.progressBtn} onClick={onOpenProgress}>
          <Trophy className="h-4 w-4" />
        </IconButton>
        <label className="sr-only" htmlFor="language-select">
          {uiText(copy, 'language')}
        </label>
        <select
          id="language-select"
          value={lang}
          onChange={event => onLanguageChange(event.target.value as Language)}
          className="h-10 max-w-[7.5rem] rounded-xl border border-canopy-line bg-canopy-raised px-2 text-xs text-canopy-text sm:max-w-none"
        >
          {languages.map(language => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
