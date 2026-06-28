const AudioContext = window.AudioContext || (window as any).webkitAudioContext
let audioCtx: AudioContext | null = null
let audioInitialized = false

export interface AudioSettings {
  volume: number
  muted: boolean
}

const DEFAULT_SETTINGS: AudioSettings = {
  volume: 0.5,
  muted: false,
}

const STORAGE_KEY = 'idleTD_audio_settings'

export const getAudioSettings = (): AudioSettings => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (_e) {
      return DEFAULT_SETTINGS
    }
  }
  return DEFAULT_SETTINGS
}

export const saveAudioSettings = (settings: AudioSettings) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

let currentSettings = getAudioSettings()

export const updateAudioSettings = (settings: Partial<AudioSettings>) => {
  currentSettings = { ...currentSettings, ...settings }
  saveAudioSettings(currentSettings)
}

const initAudioOnInteraction = () => {
  if (audioInitialized) return
  audioInitialized = true
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  document.removeEventListener('click', initAudioOnInteraction)
  document.removeEventListener('keydown', initAudioOnInteraction)
  document.removeEventListener('touchstart', initAudioOnInteraction)
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', initAudioOnInteraction)
  document.addEventListener('keydown', initAudioOnInteraction)
  document.addEventListener('touchstart', initAudioOnInteraction)
}

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  if (audioCtx.state === 'suspended' && audioInitialized) {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

function playTone(freq: number, type: OscillatorType, duration: number, vol: number) {
  if (currentSettings.muted || currentSettings.volume <= 0) return

  try {
    const ctx = initAudio()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)

    const finalVol = vol * currentSettings.volume
    gain.gain.setValueAtTime(finalVol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + duration)
  } catch (_e) {
    // Ignore audio errors
  }
}

export const playShootSound = () => playTone(800, 'square', 0.1, 0.2)
export const playHitSound = () => playTone(200, 'sawtooth', 0.1, 0.2)
export const playDeathSound = () => {
  if (currentSettings.muted || currentSettings.volume <= 0) return
  try {
    const ctx = initAudio()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.3)

    const finalVol = 0.5 * currentSettings.volume
    gain.gain.setValueAtTime(finalVol, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  } catch (_e) {}
}
export const playSunSound = () => {
  playTone(600, 'sine', 0.1, 0.5)
  setTimeout(() => playTone(800, 'sine', 0.2, 0.5), 100)
}
export const playSunBurstSound = () => {
  playTone(300, 'square', 0.5, 0.5)
  playTone(400, 'sawtooth', 0.5, 0.5)
}
export const playPortalSound = () => playTone(100, 'sine', 0.3, 0.5)
