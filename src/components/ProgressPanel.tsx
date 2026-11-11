/**
 * ProgressPanel Component
 * Displays player progress, achievements, and statistics
 */

import {
  Award,
  CheckCircle2,
  Clock,
  Leaf,
  Lock,
  Star,
  Sword,
  Target,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { t } from '../i18n'
import type { Language, TranslationSet } from '../i18n/types'
import { uiText } from '../i18n/ui-text'
import { formatNumber } from '../utils/number'
import { EmptyState } from './ui/EmptyState'

interface ProgressPanelProps {
  lang: Language
  uiState: {
    energy: number
    wave: number
    plant: {
      level: number
      stage: number
      evolutionProgress: number
      baseDamage: number
      damageMultiplier: number
      attackSpeedMultiplier: number
    }
    upgrades: {
      damageLevel: number
      speedLevel: number
      clickLevel: number
      energyLevel: number
      evolutionSpeedLevel: number
      grassLevel: number
      grassEvolutions: string[]
    }
    abilities: {
      sunBurst: { level: number; evolutions: string[] }
      rootEntangle: { level: number; evolutions: string[] }
      poisonCloud: { level: number; evolutions: string[] }
      solGenerator: { level: number; evolutions: string[] }
    }
    resets: number
  }
  onClose: () => void
}

interface Achievement {
  id: string
  titleKey: string
  descriptionKey: string
  icon: React.ReactNode
  condition: (state: ProgressPanelProps['uiState']) => boolean
}

const achievements: Achievement[] = [
  {
    id: 'first_wave',
    titleKey: 'achievement1Title',
    descriptionKey: 'achievement1Desc',
    icon: <Target className="w-5 h-5 text-emerald-400" />,
    condition: state => state.wave >= 1,
  },
  {
    id: 'wave_10',
    titleKey: 'achievement2Title',
    descriptionKey: 'achievement2Desc',
    icon: <Sword className="w-5 h-5 text-blue-400" />,
    condition: state => state.wave >= 10,
  },
  {
    id: 'wave_50',
    titleKey: 'achievement3Title',
    descriptionKey: 'achievement3Desc',
    icon: <Trophy className="w-5 h-5 text-yellow-400" />,
    condition: state => state.wave >= 50,
  },
  {
    id: 'wave_100',
    titleKey: 'achievement4Title',
    descriptionKey: 'achievement4Desc',
    icon: <Star className="w-5 h-5 text-purple-400" />,
    condition: state => state.wave >= 100,
  },
  {
    id: 'plant_level_10',
    titleKey: 'achievement5Title',
    descriptionKey: 'achievement5Desc',
    icon: <Leaf className="w-5 h-5 text-green-400" />,
    condition: state => state.plant.level >= 10,
  },
  {
    id: 'plant_level_50',
    titleKey: 'achievement6Title',
    descriptionKey: 'achievement6Desc',
    icon: <Leaf className="w-5 h-5 text-emerald-400" />,
    condition: state => state.plant.level >= 50,
  },
  {
    id: 'plant_level_100',
    titleKey: 'achievement7Title',
    descriptionKey: 'achievement7Desc',
    icon: <Leaf className="w-5 h-5 text-cyan-400" />,
    condition: state => state.plant.level >= 100,
  },
  {
    id: 'first_reset',
    titleKey: 'achievement8Title',
    descriptionKey: 'achievement8Desc',
    icon: <TrendingUp className="w-5 h-5 text-orange-400" />,
    condition: state => state.resets >= 1,
  },
  {
    id: 'reset_5',
    titleKey: 'achievement9Title',
    descriptionKey: 'achievement9Desc',
    icon: <TrendingUp className="w-5 h-5 text-red-400" />,
    condition: state => state.resets >= 5,
  },
  {
    id: 'reset_10',
    titleKey: 'achievement10Title',
    descriptionKey: 'achievement10Desc',
    icon: <Award className="w-5 h-5 text-amber-400" />,
    condition: state => state.resets >= 10,
  },
  {
    id: 'energy_1m',
    titleKey: 'achievement11Title',
    descriptionKey: 'achievement11Desc',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    condition: state => state.energy >= 1000000,
  },
  {
    id: 'energy_1b',
    titleKey: 'achievement12Title',
    descriptionKey: 'achievement12Desc',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    condition: state => state.energy >= 1000000000,
  },
  {
    id: 'all_abilities',
    titleKey: 'achievement13Title',
    descriptionKey: 'achievement13Desc',
    icon: <Star className="w-5 h-5 text-pink-400" />,
    condition: state =>
      state.abilities.sunBurst.level > 0
      && state.abilities.rootEntangle.level > 0
      && state.abilities.poisonCloud.level > 0
      && state.abilities.solGenerator.level > 0,
  },
  {
    id: 'damage_multiplier_10',
    titleKey: 'achievement14Title',
    descriptionKey: 'achievement14Desc',
    icon: <Sword className="w-5 h-5 text-red-400" />,
    condition: state => state.plant.damageMultiplier >= 10,
  },
  {
    id: 'speed_multiplier_5',
    titleKey: 'achievement15Title',
    descriptionKey: 'achievement15Desc',
    icon: <Clock className="w-5 h-5 text-blue-400" />,
    condition: state => state.plant.attackSpeedMultiplier >= 5,
  },
]

function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}

export default function ProgressPanel({ lang, uiState, onClose }: ProgressPanelProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Play time timer — updates every second
  const [totalPlayTime, setTotalPlayTime] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalPlayTime(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Focus trap + Escape + focus management
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose],
  )

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement
    modalRef.current?.focus()
    return () => {
      previousFocusRef.current?.focus()
    }
  }, [])

  const unlockedAchievements = useMemo(() => {
    return achievements.filter(a => a.condition(uiState))
  }, [uiState])

  const unlockedSet = useMemo(() => {
    return new Set(unlockedAchievements.map(a => a.id))
  }, [unlockedAchievements])

  const totalUpgrades = useMemo(() => {
    return (
      uiState.upgrades.damageLevel
      + uiState.upgrades.speedLevel
      + uiState.upgrades.clickLevel
      + uiState.upgrades.energyLevel
      + uiState.upgrades.evolutionSpeedLevel
      + uiState.upgrades.grassLevel
      + uiState.abilities.sunBurst.level
      + uiState.abilities.rootEntangle.level
      + uiState.abilities.poisonCloud.level
      + uiState.abilities.solGenerator.level
    )
  }, [uiState])

  const totalEvolutions = useMemo(() => {
    return (
      uiState.upgrades.grassEvolutions.length
      + uiState.abilities.sunBurst.evolutions.length
      + uiState.abilities.rootEntangle.evolutions.length
      + uiState.abilities.poisonCloud.evolutions.length
      + uiState.abilities.solGenerator.evolutions.length
    )
  }, [uiState])

  const progressScore = useMemo(() => {
    const waveScore = Math.min(100, uiState.wave)
    const levelScore = Math.min(100, uiState.plant.level)
    const resetScore = uiState.resets * 10
    const achievementScore = unlockedAchievements.length * 5
    const upgradeScore = Math.min(50, totalUpgrades / 2)

    return Math.floor(waveScore + levelScore + resetScore + achievementScore + upgradeScore)
  }, [uiState, unlockedAchievements, totalUpgrades])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#07140f]/85 backdrop-blur-sm"
        aria-label={t[lang].close || 'Close'}
        onClick={onClose}
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-panel-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-canopy-line bg-canopy-panel shadow-2xl outline-none"
      >
        {/* Header */}
        <div className="p-6 border-b border-canopy-line bg-canopy-raised/60">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h2 id="progress-panel-title" className="font-display text-2xl text-canopy-text">
                {t[lang].progressTitle || 'Progress'}
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label={t[lang].close || 'Close'}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-canopy-line bg-canopy-raised text-canopy-muted hover:text-canopy-text"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Score */}
          <div className="mt-4 rounded-xl border border-canopy-line bg-canopy-bg p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-wide text-canopy-muted">
                {t[lang].progressScore || 'Progress Score'}
              </span>
              <span className="font-mono text-2xl font-bold text-canopy-leaf">{progressScore}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full border border-canopy-line bg-canopy-panel">
              <div
                className="h-full bg-canopy-leaf"
                style={{ width: `${Math.min(100, progressScore / 5)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6 space-y-6">
          {/* Statistics */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-canopy-text">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              {t[lang].statistics || 'Statistics'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-canopy-muted">
                  {t[lang].wave}
                </div>
                <div className="font-mono text-xl font-bold text-canopy-text">{uiState.wave}</div>
              </div>
              <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-canopy-muted">
                  {t[lang].plantLevel}
                </div>
                <div className="text-xl font-black text-emerald-400">
                  {uiState.plant.level}-{uiState.plant.stage}
                </div>
              </div>
              <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-canopy-muted">
                  {t[lang].resets}
                </div>
                <div className="text-xl font-black text-orange-400">{uiState.resets}</div>
              </div>
              <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-canopy-muted">
                  {t[lang].energy || 'Energy'}
                </div>
                <div className="text-xl font-black text-yellow-400">
                  {formatNumber(uiState.energy)}
                </div>
              </div>
              <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-canopy-muted">
                  {t[lang].totalUpgrades || 'Total Upgrades'}
                </div>
                <div className="text-xl font-black text-blue-400">{totalUpgrades}</div>
              </div>
              <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-canopy-muted">
                  {t[lang].evolutions || 'Evolutions'}
                </div>
                <div className="text-xl font-black text-purple-400">{totalEvolutions}</div>
              </div>
              <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-canopy-muted">
                  {t[lang].damageMultiplier || 'Damage Mult'}
                </div>
                <div className="text-xl font-black text-red-400">
                  x{formatNumber(uiState.plant.damageMultiplier)}
                </div>
              </div>
              <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-canopy-muted">
                  {t[lang].speedMultiplier || 'Speed Mult'}
                </div>
                <div className="text-xl font-black text-cyan-400">
                  x{formatNumber(uiState.plant.attackSpeedMultiplier)}
                </div>
              </div>
              <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-canopy-muted">
                  {t[lang].playTime || 'Play Time'}
                </div>
                <div className="font-mono text-xl font-bold text-canopy-text">
                  {formatPlayTime(totalPlayTime)}
                </div>
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-canopy-text">
              <Trophy className="w-5 h-5 text-yellow-400" />
              {t[lang].achievements || 'Achievements'} ({unlockedAchievements.length}/
              {achievements.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map(achievement => {
                const isUnlocked = unlockedSet.has(achievement.id)
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isUnlocked
                        ? 'border-canopy-sap/50 bg-canopy-raised'
                        : 'border-canopy-line bg-canopy-bg'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-lg p-2 ${isUnlocked ? 'bg-canopy-sap/20' : 'bg-canopy-raised'}`}
                      >
                        {isUnlocked ? (
                          achievement.icon
                        ) : (
                          <Lock className="h-5 w-5 text-canopy-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${isUnlocked ? 'text-canopy-text' : 'text-canopy-muted'}`}
                          >
                            {String(
                              t[lang][achievement.titleKey as keyof TranslationSet]
                                || achievement.id,
                            )}
                          </span>
                          {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-canopy-muted mt-1">
                          {String(
                            t[lang][achievement.descriptionKey as keyof TranslationSet]
                              || 'Achievement description',
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Milestones */}
          <section>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-canopy-text">
              <Target className="w-5 h-5 text-emerald-400" />
              {t[lang].milestones || 'Next Milestones'}
            </h3>
            <div className="space-y-3">
              {uiState.wave < 50 && (
                <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-canopy-text">
                      {t[lang].milestoneWave50 || 'Reach Wave 50'}
                    </span>
                    <span className="text-sm text-canopy-muted">{uiState.wave}/50</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-canopy-panel">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${(uiState.wave / 50) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {uiState.plant.level < 50 && (
                <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-canopy-text">
                      {t[lang].milestonePlant50 || 'Reach Plant Level 50'}
                    </span>
                    <span className="text-sm text-canopy-muted">{uiState.plant.level}/50</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-canopy-panel">
                    <div
                      className="h-full bg-cyan-500 transition-all"
                      style={{ width: `${(uiState.plant.level / 50) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {uiState.resets < 1 && (
                <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-canopy-text">
                      {t[lang].milestoneFirstReset || 'First Prestige Reset'}
                    </span>
                    <span className="text-sm text-canopy-muted">{t[lang].locked || 'Locked'}</span>
                  </div>
                  <p className="text-xs text-canopy-muted">
                    {t[lang].milestoneFirstResetDesc || 'Reach Wave 50 or Plant Level 50 to unlock'}
                  </p>
                </div>
              )}
              {unlockedAchievements.length < achievements.length && (
                <div className="rounded-xl border border-canopy-line bg-canopy-bg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-canopy-text">
                      {t[lang].milestoneAllAchievements || 'Complete All Achievements'}
                    </span>
                    <span className="text-sm text-canopy-muted">
                      {unlockedAchievements.length}/{achievements.length}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-canopy-panel">
                    <div
                      className="h-full bg-yellow-500 transition-all"
                      style={{
                        width: `${(unlockedAchievements.length / achievements.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            {uiState.wave >= 50
              && uiState.plant.level >= 50
              && uiState.resets >= 1
              && unlockedAchievements.length >= achievements.length && (
                <EmptyState title={t[lang].milestones} body={uiText(t[lang], 'milestonesClear')} />
              )}
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-canopy-line bg-canopy-bg/80 p-4">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 w-full rounded-xl bg-canopy-raised font-semibold text-canopy-text hover:border-canopy-leaf"
          >
            {t[lang].close || 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}
