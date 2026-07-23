import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialState } from './game'
import { exportSave, importSave, loadGame, resetSave, saveGame } from './saveSystem'

describe('saveSystem', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveGame / loadGame', () => {
    it('saves and loads game state', () => {
      const state = createInitialState()
      state.energy = 5000
      state.wave = 10
      state.stats.enemiesKilled = 42
      state.stats.wavesCompleted = 9

      saveGame(state)

      const loaded = loadGame()
      expect(loaded).not.toBeNull()
      expect(loaded?.energy).toBe(5000)
      expect(loaded?.wave).toBe(10)
      expect(loaded?.stats.enemiesKilled).toBe(42)
      expect(loaded?.stats.wavesCompleted).toBe(9)
    })

    it('persists baseDamage across save/load cycle', () => {
      const state = createInitialState()
      state.plant.baseDamage = 160 // 5 doublings: 5 * 2^5
      state.plant.level = 2
      state.plant.stage = 1

      saveGame(state)
      const loaded = loadGame()

      expect(loaded).not.toBeNull()
      // baseDamage should be preserved exactly (no prestige applied)
      expect(loaded?.plant.baseDamage).toBe(160)
    })

    it('returns null when no save exists', () => {
      expect(loadGame()).toBeNull()
    })
  })

  describe('exportSave / importSave', () => {
    it('round-trips a game state through base64', () => {
      const state = createInitialState()
      state.energy = 99999
      state.wave = 25

      const exported = exportSave(state)
      expect(typeof exported).toBe('string')
      expect(exported.length).toBeGreaterThan(10)

      const imported = importSave(exported)
      expect(imported.energy).toBe(99999)
      expect(imported.wave).toBe(25)
    })

    it('handles unicode in save data', () => {
      const state = createInitialState()
      state.upgrades.grassEvolutions = ['poison_grass', 'faster_ticks']

      const exported = exportSave(state)
      const imported = importSave(exported)

      expect(imported.upgrades.grassEvolutions).toEqual(['poison_grass', 'faster_ticks'])
    })

    it('throws on invalid import string', () => {
      expect(() => importSave('not-valid-base64!!!')).toThrow()
    })
  })

  describe('resetSave', () => {
    it('clears all save data', () => {
      const state = createInitialState()
      state.energy = 100
      saveGame(state)

      resetSave()

      expect(loadGame()).toBeNull()
    })
  })
})
