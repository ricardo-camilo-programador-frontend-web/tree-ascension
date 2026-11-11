import {
  Clock,
  FastForward,
  Leaf,
  MousePointer2,
  ShieldAlert,
  ShoppingCart,
  Skull,
  Sparkles,
  Sun,
  Sword,
  Wind,
  Zap,
} from 'lucide-react'
import type React from 'react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { initGlobalAds } from './ads/adsterra'
import { type AudioSettings, getAudioSettings, updateAudioSettings } from './audio'
import AdsterraAd from './components/AdsterraAd'
import ConfirmModal from './components/ConfirmModal'
import { GameHeader } from './components/GameHeader'
import { dismissOnboarding, hasSeenOnboarding, OnboardingHint } from './components/OnboardingHint'
import { type ShopEntry, ShopPanel } from './components/ShopPanel'
import { showToast, ToastContainer } from './components/Toast'
import { Button } from './components/ui/Button'
import { I18nProvider } from './i18n/provider'
import { uiText } from './i18n/ui-text'

const MoringaInfo = lazy(() => import('./components/MoringaInfo'))
const ProgressPanel = lazy(() => import('./components/ProgressPanel'))
const ResetModal = lazy(() => import('./components/ResetModal'))
const SettingsModal = lazy(() => import('./components/SettingsModal'))
const SkillEvolutionModal = lazy(() => import('./components/SkillEvolutionModal'))
const SkillInfoModal = lazy(() => import('./components/SkillInfoModal'))

import { SAVE_INTERVAL, UI_SYNC_INTERVAL } from './config/constants'
import {
  buyUpgrade,
  createInitialState,
  drawGame,
  type GameState,
  getEvolutionSpeed,
  getUpgradeCostTotal,
  handleCanvasClick,
  resetGame,
  updateGame,
} from './game'
import { type Language, languages, t } from './i18n'
import { exportSave, importSave, loadGame, resetSave, saveGame } from './saveSystem'
import { formatNumber } from './utils/number'
import { fpsCounter, isPageHidden } from './utils/performance'

const LEAVES = [
  { left: '6%', delay: '0s', duration: '12s', size: '12px' },
  { left: '18%', delay: '1.4s', duration: '9s', size: '16px' },
  { left: '33%', delay: '2.2s', duration: '14s', size: '11px' },
  { left: '47%', delay: '0.6s', duration: '10s', size: '15px' },
  { left: '61%', delay: '3s', duration: '13s', size: '13px' },
  { left: '74%', delay: '1.8s', duration: '11s', size: '17px' },
  { left: '86%', delay: '2.6s', duration: '9.5s', size: '12px' },
  { left: '94%', delay: '0.2s', duration: '15s', size: '14px' },
]

function LoadingNote({ lang }: { lang: Language }) {
  return (
    <p role="status" className="p-4 text-sm text-canopy-muted">
      {uiText(t[lang], 'loading')}
    </p>
  )
}

// Optimized UI state mapper
const mapStateToUI = (state: GameState) => ({
  energy: state.energy,
  wave: state.wave,
  playerHealth: state.playerHealth,
  maxPlayerHealth: state.maxPlayerHealth,
  plant: {
    level: state.plant.level,
    stage: state.plant.stage,
    evolutionProgress: state.plant.evolutionProgress,
    baseDamage: state.plant.baseDamage,
    damageMultiplier: state.plant.damageMultiplier,
    attackSpeedMultiplier: state.plant.attackSpeedMultiplier,
  },
  upgrades: state.upgrades,
  abilities: state.abilities,
  resets: state.resets,
  energyMultiplier: state.energyMultiplier,
  modal: state.modal,
  waveState: {
    isBoss: state.waveState.isBoss,
  },
  settings: state.settings,
  playTime: state.timers.gameTime,
  waveCompleted: state.waveCompleted,
})

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('idleTD_lang') as Language
      if (saved && languages.some(language => language.code === saved)) return saved
    } catch {
      // Storage can be unavailable; English remains the default.
    }
    return 'en'
  })
  const [showOnboarding, setShowOnboarding] = useState(() => !hasSeenOnboarding())
  const gameState = useRef<GameState>(createInitialState())
  const [uiState, setUiState] = useState(() => mapStateToUI(gameState.current))
  const [fps, setFps] = useState(0)
  const [isShopOpen, setIsShopOpen] = useState(false)
  const [buyMultiplier, setBuyMultiplier] = useState<number | 'MAX'>(1)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [exportString, setExportString] = useState('')
  const [importString, setImportString] = useState('')
  const [importError, setImportError] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)
  const [audio, setAudio] = useState<AudioSettings>(getAudioSettings())
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    title: string
    message: string
    onConfirm: () => void
    onCancel: () => void
    confirmText?: string
    cancelText?: string
    destructive?: boolean
    lang: Language
  }>({ open: false, title: '', message: '', onConfirm: () => {}, onCancel: () => {}, lang: 'en' })
  const [showProgressPanel, setShowProgressPanel] = useState(false)
  const langRef = useRef(lang)
  langRef.current = lang

  useEffect(() => {
    initGlobalAds()

    const loadedState = loadGame()
    if (loadedState) {
      gameState.current = loadedState
      setUiState(mapStateToUI(loadedState))
    }

    // Initialize audio settings from localStorage
    const savedAudio = getAudioSettings()
    setAudio(savedAudio)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }
    window.addEventListener('resize', resize)
    resize()

    let animationFrameId: number

    const render = (_time: number) => {
      fpsCounter.tick()
      // updateGame handles dt internally using Date.now() for background progression
      updateGame(gameState.current, 0)
      drawGame(ctx, canvas.width, canvas.height, gameState.current)

      animationFrameId = requestAnimationFrame(render)
    }
    render(performance.now())

    // UI Sync & Auto-save interval
    const uiInterval = setInterval(() => {
      setUiState(mapStateToUI(gameState.current))
      setFps(fpsCounter.fps)

      // Wave completion notification
      if (gameState.current.waveCompleted) {
        const currentLang = langRef.current
        showToast(
          `${t[currentLang].wave} ${gameState.current.lastCompletedWave} ${t[currentLang].waveComplete || 'Complete!'}`,
          'success',
        )
        gameState.current.waveCompleted = false
      }
    }, UI_SYNC_INTERVAL)

    const saveInterval = setInterval(() => {
      // H3 fix: skip autosave when page is hidden (rAF is paused, state is stale)
      if (isPageHidden()) return
      saveGame(gameState.current)
    }, SAVE_INTERVAL) // Save every SAVE_INTERVAL ms

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === 'Escape') {
        setShowSettingsModal(false)
        setShowResetModal(false)
        setShowProgressPanel(false)
        setIsShopOpen(false)
        setConfirmModal(prev => ({ ...prev, open: false }))
        const state = gameState.current
        state.modal.isOpen = false
        state.modal.type = null
        state.modal.skillId = null
        state.modal.options = []
        setUiState(mapStateToUI(state))
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        saveGame(gameState.current)
        showToast(t[langRef.current].saveSuccess, 'success')
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', handleKeyDown)
      cancelAnimationFrame(animationFrameId)
      clearInterval(uiInterval)
      clearInterval(saveInterval)
    }
  }, [])

  const handleCanvasClickEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    handleCanvasClick(gameState.current, x, y, canvas.width, canvas.height)
    setUiState(mapStateToUI(gameState.current))
  }

  const handleBuy = (type: string) => {
    buyUpgrade(gameState.current, type, buyMultiplier)
    setUiState(mapStateToUI(gameState.current))
  }

  const getCostInfo = (type: string, level: number) => {
    return getUpgradeCostTotal(type, level, gameState.current, buyMultiplier)
  }

  const handleManualSave = () => {
    saveGame(gameState.current)
    showToast(t[lang].saveSuccess, 'success')
  }

  const handleExport = () => {
    const str = exportSave(gameState.current)
    setExportString(str)
    setCopySuccess(false)
  }

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportString)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

  const handleImport = () => {
    if (!importString) return
    try {
      const newState = importSave(importString)
      gameState.current = newState
      setUiState(mapStateToUI(newState))
      saveGame(newState)
      setImportString('')
      setImportError('')
      setShowSettingsModal(false)
      showToast(t[lang].saveImported, 'success')
    } catch (_e) {
      setImportError(t[lang].invalidSaveString)
    }
  }

  const handleHardReset = () => {
    setConfirmModal({
      open: true,
      title: t[lang].hardReset,
      message: t[lang].hardResetMessage,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, open: false }))
        resetSave()
        window.location.reload()
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, open: false })),
      confirmText: t[lang].wipeSave,
      cancelText: t[lang].cancel,
      destructive: true,
      lang: lang,
    })
  }

  const handleResetClick = () => {
    if (gameState.current.wave >= 50 || gameState.current.plant.level >= 50) {
      setShowResetModal(true)
    }
  }

  const confirmReset = () => {
    const success = resetGame(gameState.current)
    if (success) {
      setShowResetModal(false)
      setUiState(mapStateToUI(gameState.current))
      showToast(
        `${t[lang].prestigeActivated} +${formatNumber(gameState.current.energy)} ${t[lang].startingEnergy}`,
        'info',
      )
    }
  }

  const handleModalSelect = (optionId: string) => {
    const state = gameState.current
    if (state.modal.type === 'skillEvolution' && state.modal.skillId) {
      const skillId = state.modal.skillId
      if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(skillId)) {
        state.abilities[skillId as keyof typeof state.abilities].evolutions.push(optionId)
      } else if (skillId === 'grass') {
        state.upgrades.grassEvolutions.push(optionId)
      }
    }
    state.modal.isOpen = false
    state.modal.type = null
    state.modal.skillId = null
    state.modal.options = []
    setUiState(mapStateToUI(state))
  }

  const handleModalClose = () => {
    const state = gameState.current
    state.modal.isOpen = false
    state.modal.type = null
    state.modal.skillId = null
    state.modal.options = []
    setUiState(mapStateToUI(state))
  }

  const handleSkillInfo = (skillId: string) => {
    const state = gameState.current
    state.modal.isOpen = true
    state.modal.type = 'skillInfo'
    state.modal.skillId = skillId
    setUiState(mapStateToUI(state))
  }

  const getSkillName = (id: string | null) => {
    switch (id) {
      case 'sunBurst':
        return 'Sun Burst'
      case 'rootEntangle':
        return 'Root Entangle'
      case 'poisonCloud':
        return 'Poison Cloud'
      case 'solGenerator':
        return 'Sol Generator'
      case 'grass':
        return 'Sharp Grass'
      case 'damage':
        return 'Plant Damage'
      case 'speed':
        return 'Attack Speed'
      case 'click':
        return 'Click Damage'
      case 'energy':
        return 'Energy Multiplier'
      case 'evolutionSpeed':
        return 'Evolution Speed'
      default:
        return 'Unknown Skill'
    }
  }

  const getSkillLevel = (id: string | null) => {
    if (!id) return 0
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(id)) {
      return uiState.abilities[id as keyof typeof uiState.abilities].level
    } else if (id === 'grass') {
      return uiState.upgrades.grassLevel
    } else if (['damage', 'speed', 'click', 'energy', 'evolutionSpeed'].includes(id)) {
      const key = `${id}Level` as keyof typeof uiState.upgrades
      return uiState.upgrades[key] as number
    }
    return 0
  }

  const getSkillEffect = (id: string | null) => {
    if (!id) return ''
    if (id === 'sunBurst') {
      const dmg =
        uiState.plant.baseDamage
        * uiState.plant.damageMultiplier
        * 5
        * 1.15 ** (uiState.abilities.sunBurst.level - 1)
      return `${formatNumber(dmg)} Damage`
    } else if (id === 'rootEntangle') {
      return '50% Slow for 5s'
    } else if (id === 'poisonCloud') {
      const dmg =
        uiState.plant.baseDamage
        * uiState.plant.damageMultiplier
        * 0.5
        * 1.15 ** (uiState.abilities.poisonCloud.level - 1)
      return `${formatNumber(dmg * 5)} Total Damage`
    } else if (id === 'solGenerator') {
      return `+${uiState.abilities.solGenerator.level} Sun per spawn`
    } else if (id === 'grass') {
      const dmg = 5 * 1.15 ** uiState.upgrades.grassLevel
      return `${formatNumber(dmg)} DPS`
    } else if (id === 'damage') {
      return `x${formatNumber(uiState.plant.damageMultiplier)}`
    } else if (id === 'speed') {
      return `x${formatNumber(uiState.plant.attackSpeedMultiplier)}`
    } else if (id === 'click') {
      const dmg =
        uiState.plant.baseDamage
        * uiState.plant.damageMultiplier
        * 2
        * 1.15 ** (uiState.upgrades.clickLevel - 1)
      return `${formatNumber(dmg)} Damage`
    } else if (id === 'energy') {
      return `x${formatNumber(uiState.energyMultiplier)}`
    } else if (id === 'evolutionSpeed') {
      const speed = getEvolutionSpeed(uiState.upgrades.evolutionSpeedLevel)
      return `${formatNumber(speed)}/s`
    }
    return ''
  }

  const getSkillCooldown = (id: string | null) => {
    if (!id) return 0
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(id)) {
      const ability = uiState.abilities[id as keyof typeof uiState.abilities]
      if (ability.maxCooldown === 0) return 0
      // Approximate reduction logic from game.ts
      const reduction = 1 - 0.5 * (1 - Math.exp(-0.01 * ability.level))
      return Math.max(1, ability.maxCooldown * reduction).toFixed(1)
    }
    return 0
  }

  const getSkillDescription = (id: string | null) => {
    switch (id) {
      case 'sunBurst':
        return 'Unleashes a burst of solar energy damaging all enemies on screen.'
      case 'rootEntangle':
        return 'Vines erupt from the ground slowing all enemies.'
      case 'poisonCloud':
        return 'Releases a toxic cloud dealing damage over time to all enemies.'
      case 'solGenerator':
        return 'Increases the amount of suns generated automatically.'
      case 'grass':
        return 'Sharp grass covers the ground dealing continuous damage to walking enemies.'
      case 'damage':
        return 'Increases the base damage of your plant.'
      case 'speed':
        return 'Increases the attack speed of your plant.'
      case 'click':
        return 'Increases the damage dealt when you click on enemies.'
      case 'energy':
        return 'Increases the amount of energy gained from all sources.'
      case 'evolutionSpeed':
        return 'Increases the speed at which your plant evolves.'
      default:
        return ''
    }
  }

  const getSkillEvolutions = (id: string | null) => {
    if (!id) return []
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(id)) {
      return uiState.abilities[id as keyof typeof uiState.abilities].evolutions
    } else if (id === 'grass') {
      return uiState.upgrades.grassEvolutions
    }
    return []
  }

  const formatEvolutionName = (id: string) => {
    return id
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')
  }

  const totalEvolutions = (uiState.plant.level - 1) * 5 + (uiState.plant.stage - 1)
  const requiredProgress = 100 * 1.2 ** totalEvolutions
  const evoPercent = Math.max(
    0,
    Math.min(100, (uiState.plant.evolutionProgress / requiredProgress) * 100),
  )

  const togglePerformance = () => {
    gameState.current.settings.lowPerformance = !gameState.current.settings.lowPerformance
    setUiState(mapStateToUI(gameState.current))
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value)
    const newSettings = { ...audio, volume }
    setAudio(newSettings)
    updateAudioSettings(newSettings)
  }

  const toggleMute = () => {
    const newSettings = { ...audio, muted: !audio.muted }
    setAudio(newSettings)
    updateAudioSettings(newSettings)
  }

  const makeEntry = (
    id: string,
    icon: React.ReactNode,
    title: string,
    level: number,
    accentClass: string,
    ability?: ShopEntry['ability'],
    unavailableReason?: string,
  ): ShopEntry => {
    const info = getCostInfo(id, level)
    return {
      id,
      icon,
      title,
      level,
      cost: info.cost,
      count: info.count,
      canAfford: info.count > 0 && uiState.energy >= info.cost,
      effect: getSkillEffect(id),
      accentClass,
      onBuy: () => handleBuy(id),
      onInfo: () => handleSkillInfo(id),
      ability,
      unavailableReason,
    }
  }

  const upgrades: ShopEntry[] = [
    makeEntry(
      'damage',
      <Sword className="h-5 w-5 text-canopy-hp" />,
      t[lang].damage,
      uiState.upgrades.damageLevel,
      'border-l-4 border-l-canopy-hp',
    ),
    makeEntry(
      'speed',
      <Clock className="h-5 w-5 text-canopy-leaf" />,
      t[lang].attackSpeed,
      uiState.upgrades.speedLevel,
      'border-l-4 border-l-canopy-leaf',
    ),
    makeEntry(
      'click',
      <MousePointer2 className="h-5 w-5 text-canopy-info" />,
      t[lang].clickDamage,
      uiState.upgrades.clickLevel,
      'border-l-4 border-l-canopy-info',
    ),
    makeEntry(
      'energy',
      <Zap className="h-5 w-5 text-canopy-sap" />,
      t[lang].energyMultiplier,
      uiState.upgrades.energyLevel,
      'border-l-4 border-l-canopy-sap',
    ),
    makeEntry(
      'evolutionSpeed',
      <FastForward className="h-5 w-5 text-canopy-info" />,
      t[lang].evolutionSpeed,
      uiState.upgrades.evolutionSpeedLevel,
      'border-l-4 border-l-canopy-info',
    ),
    makeEntry(
      'grass',
      <Leaf className="h-5 w-5 text-canopy-leaf" />,
      t[lang].grassDamage,
      uiState.upgrades.grassLevel,
      'border-l-4 border-l-canopy-leaf',
    ),
  ]

  const abilities: ShopEntry[] = [
    makeEntry(
      'sunBurst',
      <Sun className="h-5 w-5 text-canopy-sap" />,
      t[lang].ability1,
      uiState.abilities.sunBurst.level,
      'border-l-4 border-l-canopy-sap',
      uiState.abilities.sunBurst,
    ),
    makeEntry(
      'rootEntangle',
      <Wind className="h-5 w-5 text-canopy-leaf" />,
      t[lang].ability2,
      uiState.abilities.rootEntangle.level,
      'border-l-4 border-l-canopy-leaf',
      uiState.abilities.rootEntangle,
    ),
    makeEntry(
      'poisonCloud',
      <Skull className="h-5 w-5 text-canopy-hp" />,
      t[lang].ability3,
      uiState.abilities.poisonCloud.level,
      'border-l-4 border-l-canopy-hp',
      uiState.abilities.poisonCloud,
    ),
    makeEntry(
      'solGenerator',
      <Sparkles className="h-5 w-5 text-canopy-sap" />,
      t[lang].ability4,
      uiState.abilities.solGenerator.level,
      'border-l-4 border-l-canopy-warn',
      uiState.abilities.solGenerator,
      uiState.plant.level < 500 ? uiText(t[lang], 'solLocked') : undefined,
    ),
  ]

  const hud = (
    <GameHeader
      lang={lang}
      energy={uiState.energy}
      wave={uiState.wave}
      playerHealth={uiState.playerHealth}
      maxPlayerHealth={uiState.maxPlayerHealth}
      plantLevel={uiState.plant.level}
      plantStage={uiState.plant.stage}
      fps={fps}
      onLanguageChange={next => {
        setLang(next)
        localStorage.setItem('idleTD_lang', next)
      }}
      onOpenSettings={() => setShowSettingsModal(true)}
      onOpenProgress={() => setShowProgressPanel(true)}
    />
  )
  const hudSlot = typeof document === 'undefined' ? null : document.getElementById('hud-slot')

  return (
    <I18nProvider lang={lang}>
      <div className="flex h-full min-h-0 flex-col overflow-x-hidden overflow-y-auto bg-canopy-bg font-sans text-canopy-text select-none">
        {hudSlot ? createPortal(hud, hudSlot) : hud}
        <div className="flex h-full min-h-full shrink-0 flex-col">
          <main id="game" className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
            {showSettingsModal && (
              <Suspense fallback={<LoadingNote lang={lang} />}>
                <SettingsModal
                  audio={audio}
                  onToggleMute={toggleMute}
                  onVolumeChange={handleVolumeChange}
                  lowPerformance={!!uiState.settings?.lowPerformance}
                  onTogglePerformance={togglePerformance}
                  onManualSave={handleManualSave}
                  onExport={handleExport}
                  exportString={exportString}
                  onCopyExport={handleCopyExport}
                  copySuccess={copySuccess}
                  importString={importString}
                  onImportStringChange={setImportString}
                  onImport={handleImport}
                  importError={importError}
                  onHardReset={handleHardReset}
                  onClose={() => setShowSettingsModal(false)}
                  lang={lang}
                />
              </Suspense>
            )}
            {showResetModal && (
              <Suspense fallback={<LoadingNote lang={lang} />}>
                <ResetModal
                  resets={uiState.resets}
                  onCancel={() => setShowResetModal(false)}
                  onConfirm={confirmReset}
                  lang={lang}
                />
              </Suspense>
            )}
            {uiState.modal.isOpen && uiState.modal.type === 'skillEvolution' && (
              <Suspense fallback={<LoadingNote lang={lang} />}>
                <SkillEvolutionModal
                  options={uiState.modal.options}
                  onSelect={handleModalSelect}
                  lang={lang}
                />
              </Suspense>
            )}
            {uiState.modal.isOpen && uiState.modal.type === 'skillInfo' && (
              <Suspense fallback={<LoadingNote lang={lang} />}>
                <SkillInfoModal
                  skillId={uiState.modal.skillId}
                  onClose={handleModalClose}
                  getSkillName={getSkillName}
                  getSkillLevel={getSkillLevel}
                  getSkillEffect={getSkillEffect}
                  getSkillCooldown={getSkillCooldown}
                  getSkillDescription={getSkillDescription}
                  getSkillEvolutions={getSkillEvolutions}
                  formatEvolutionName={formatEvolutionName}
                  lang={lang}
                />
              </Suspense>
            )}

            <div className="relative flex min-h-[16rem] flex-1 flex-col overflow-hidden bg-canopy-bg">
              {!uiState.settings?.lowPerformance && (
                <div
                  className="pointer-events-none absolute inset-0 overflow-hidden opacity-70"
                  aria-hidden="true"
                >
                  {LEAVES.map(leaf => (
                    <span
                      key={leaf.left}
                      className="absolute animate-fall"
                      style={{
                        left: leaf.left,
                        top: '-12%',
                        animationDuration: leaf.duration,
                        animationDelay: leaf.delay,
                        fontSize: leaf.size,
                      }}
                    >
                      🍃
                    </span>
                  ))}
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 block h-full w-full"
                aria-label={t[lang].clickDamage}
                onClick={handleCanvasClickEvent}
              />
              {showOnboarding && (
                <OnboardingHint
                  lang={lang}
                  onDismiss={() => {
                    dismissOnboarding()
                    setShowOnboarding(false)
                  }}
                />
              )}
              {uiState.waveState.isBoss && (
                <div className="pointer-events-none absolute top-3 left-1/2 flex max-w-[calc(100%-1.5rem)] -translate-x-1/2 items-center gap-2 rounded-full border border-canopy-hp/50 bg-[#3a1014]/90 px-4 py-2">
                  <ShieldAlert className="h-5 w-5 text-canopy-hp" aria-hidden="true" />
                  <span className="font-semibold tracking-wide text-canopy-hp uppercase">
                    {t[lang].bossWave}
                  </span>
                </div>
              )}
              <div className="pointer-events-none absolute bottom-3 left-1/2 w-[min(24rem,calc(100%-1.5rem))] -translate-x-1/2 rounded-2xl border border-canopy-line bg-canopy-panel/90 p-3 shadow-xl">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1 text-xs font-semibold tracking-wide text-canopy-muted uppercase">
                    <Sparkles className="h-3 w-3 text-canopy-info" aria-hidden="true" />{' '}
                    {t[lang].autoEvolution}
                  </span>
                  <span className="font-mono text-xs text-canopy-info">
                    {evoPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full border border-canopy-line bg-canopy-bg">
                  <div className="h-full bg-canopy-info" style={{ width: `${evoPercent}%` }} />
                </div>
              </div>
            </div>

            {isShopOpen && (
              <button
                type="button"
                className="fixed inset-0 z-40 bg-[#07140f]/75 lg:hidden"
                aria-label={t[lang].close}
                onClick={() => setIsShopOpen(false)}
              />
            )}
            <ShopPanel
              lang={lang}
              open={isShopOpen}
              onClose={() => setIsShopOpen(false)}
              entries={upgrades}
              abilities={abilities}
              buyMultiplier={buyMultiplier}
              onBuyMultiplier={setBuyMultiplier}
              onSave={handleManualSave}
              onReset={handleResetClick}
              canReset={uiState.wave >= 50 || uiState.plant.level >= 50}
              resets={uiState.resets}
            />
          </main>

          <div className="border-t border-canopy-line p-2 lg:hidden">
            <Button className="w-full" onClick={() => setIsShopOpen(true)}>
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              {t[lang].upgrades}
            </Button>
          </div>

          <footer className="border-t border-canopy-line px-3 py-2 text-center text-xs text-canopy-muted">
            {t[lang].developedBy}{' '}
            <a
              href="https://github.com/ricardo-camilo-programador-frontend-web"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-canopy-leaf underline-offset-2 hover:underline"
            >
              Ricardo Camilo
            </a>
          </footer>
          <div className="flex justify-center border-t border-canopy-line px-2 py-2">
            <AdsterraAd zone="bottom_banner" width={320} height={50} lazy />
          </div>
        </div>

        <Suspense fallback={<LoadingNote lang={lang} />}>
          <MoringaInfo lang={lang} />
        </Suspense>
        <ToastContainer />
        {showProgressPanel && (
          <Suspense fallback={<LoadingNote lang={lang} />}>
            <ProgressPanel
              lang={lang}
              uiState={uiState}
              onClose={() => setShowProgressPanel(false)}
            />
          </Suspense>
        )}
        <ConfirmModal
          open={confirmModal.open}
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={confirmModal.onCancel}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText}
          destructive={confirmModal.destructive}
          lang={confirmModal.lang}
        />
      </div>
    </I18nProvider>
  )
}
