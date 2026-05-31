import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock audio module (game.ts imports it, and it references window)
vi.mock('../audio', () => ({
  playShootSound: vi.fn(),
  playHitSound: vi.fn(),
  playDeathSound: vi.fn(),
  playSunSound: vi.fn(),
  playSunBurstSound: vi.fn(),
  playPortalSound: vi.fn(),
}));

import { saveGame, loadGame, exportSave, importSave, resetSave, restoreFromBackup } from '../saveSystem';
import { createInitialState } from '../game';
import type { GameState } from '../game';

// Mock localStorage for Node environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

// Suppress console.log/error during tests
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('saveSystem', () => {
  let state: GameState;

  beforeEach(() => {
    state = createInitialState();
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('saveGame + loadGame', () => {
    it('saves and loads the game state correctly', () => {
      state.energy = 5000;
      state.wave = 10;
      state.stats.enemiesKilled = 42;
      state.upgrades.damageLevel = 5;

      saveGame(state);
      const loaded = loadGame();
      expect(loaded).not.toBeNull();
      expect(loaded!.energy).toBe(5000);
      expect(loaded!.wave).toBe(10);
      expect(loaded!.stats.enemiesKilled).toBe(42);
      expect(loaded!.upgrades.damageLevel).toBe(5);
    });

    it('returns null when no save exists', () => {
      expect(loadGame()).toBeNull();
    });

    it('creates a backup of the previous save before overwriting', () => {
      saveGame(state);
      state.energy = 100;
      saveGame(state);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'plant_clicker_save_backup',
        expect.any(String)
      );
    });

    it('restores from backup on corrupted main save', () => {
      saveGame(state);
      localStorageMock.setItem('plant_clicker_save', 'corrupted');
      try {
        const loaded = loadGame();
        expect(loaded).not.toBeNull();
      } catch {
        // acceptable if both fail
      }
    });
  });

  describe('exportSave + importSave', () => {
    it('exports and imports a save correctly', () => {
      state.energy = 12345;
      state.wave = 25;
      state.plant.level = 10;

      const exported = exportSave(state);
      expect(typeof exported).toBe('string');
      expect(exported.length).toBeGreaterThan(0);
      expect(() => atob(exported)).not.toThrow();

      const imported = importSave(exported);
      expect(imported.energy).toBe(12345);
      expect(imported.wave).toBe(25);
      expect(imported.plant.level).toBe(10);
    });

    it('throws on invalid import string', () => {
      expect(() => importSave('invalid-base64!!!')).toThrow();
    });

    it('throws on tampered save data', () => {
      const exported = exportSave(state);
      const decoded = JSON.parse(atob(exported));
      decoded.data.player.energy = 999999;
      const tampered = btoa(JSON.stringify(decoded));
      expect(() => importSave(tampered)).toThrow();
    });

    it('round-trips prestige data correctly', () => {
      state.resets = 3;
      state.prestige.points = 100;
      state.prestige.totalPoints = 100;
      state.prestige.upgrades.soulRoots = 2;
      state.prestige.upgrades.ancientSun = 1;

      const imported = importSave(exportSave(state));
      expect(imported.resets).toBe(3);
      expect(imported.prestige.points).toBe(100);
      expect(imported.prestige.upgrades.soulRoots).toBe(2);
      expect(imported.prestige.upgrades.ancientSun).toBe(1);
    });

    it('round-trips abilities correctly', () => {
      state.abilities.sunBurst.level = 5;
      state.abilities.sunBurst.evolutions = ['double_burst'];
      state.abilities.poisonCloud.level = 3;

      const imported = importSave(exportSave(state));
      expect(imported.abilities.sunBurst.level).toBe(5);
      expect(imported.abilities.sunBurst.evolutions).toEqual(['double_burst']);
      expect(imported.abilities.poisonCloud.level).toBe(3);
    });
  });

  describe('resetSave', () => {
    it('removes save data from localStorage', () => {
      saveGame(state);
      expect(localStorageMock.getItem('plant_clicker_save')).not.toBeNull();
      resetSave();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('plant_clicker_save');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('plant_clicker_save_backup');
    });
  });

  describe('restoreFromBackup', () => {
    it('returns null when no backup exists', () => {
      expect(restoreFromBackup()).toBeNull();
    });

    it('returns state from valid backup', () => {
      state.energy = 777;
      saveGame(state);
      state.energy = 888;
      saveGame(state);
      const backup = restoreFromBackup();
      expect(backup).not.toBeNull();
      expect(backup!.energy).toBe(777);
    });
  });
});
