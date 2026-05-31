import { describe, it, expect, vi } from 'vitest';

// Mock audio module (game.ts imports it, and it references window)
vi.mock('../audio', () => ({
  playShootSound: vi.fn(),
  playHitSound: vi.fn(),
  playDeathSound: vi.fn(),
  playSunSound: vi.fn(),
  playSunBurstSound: vi.fn(),
  playPortalSound: vi.fn(),
}));

import { createInitialState, calculateMaxHp } from '../game';

describe('calculateMaxHp', () => {
  it('returns 10000 for level 0', () => {
    expect(calculateMaxHp(0)).toBe(10000);
  });

  it('returns 10000 for level 1 (below 50)', () => {
    expect(calculateMaxHp(1)).toBe(10000);
  });

  it('returns 10000 for level 49', () => {
    expect(calculateMaxHp(49)).toBe(10000);
  });

  it('returns 20000 for level 50', () => {
    expect(calculateMaxHp(50)).toBe(20000);
  });

  it('returns 20000 for level 99', () => {
    expect(calculateMaxHp(99)).toBe(20000);
  });

  it('returns 30000 for level 100', () => {
    expect(calculateMaxHp(100)).toBe(30000);
  });

  it('returns 50000 for level 200', () => {
    expect(calculateMaxHp(200)).toBe(50000);
  });
});

describe('createInitialState', () => {
  it('returns a valid GameState object', () => {
    const state = createInitialState();
    expect(state).toBeDefined();
    expect(typeof state).toBe('object');
  });

  it('initializes energy to 0', () => {
    expect(createInitialState().energy).toBe(0);
  });

  it('initializes wave to 1', () => {
    expect(createInitialState().wave).toBe(1);
  });

  it('initializes resets to 0', () => {
    expect(createInitialState().resets).toBe(0);
  });

  it('initializes playerHealth to 10000', () => {
    expect(createInitialState().playerHealth).toBe(10000);
  });

  it('initializes maxPlayerHealth to 10000', () => {
    expect(createInitialState().maxPlayerHealth).toBe(10000);
  });

  it('initializes clickDamage to 1', () => {
    expect(createInitialState().clickDamage).toBe(1);
  });

  it('initializes energyMultiplier to 1', () => {
    expect(createInitialState().energyMultiplier).toBe(1);
  });

  it('initializes plant level to 1', () => {
    expect(createInitialState().plant.level).toBe(1);
  });

  it('initializes plant baseDamage to 5', () => {
    expect(createInitialState().plant.baseDamage).toBe(5);
  });

  it('initializes plant hp and maxHp to 100', () => {
    const state = createInitialState();
    expect(state.plant.hp).toBe(100);
    expect(state.plant.maxHp).toBe(100);
  });

  it('initializes empty entity arrays', () => {
    const state = createInitialState();
    expect(state.zombies).toEqual([]);
    expect(state.projectiles).toEqual([]);
    expect(state.particles).toEqual([]);
    expect(state.floatingTexts).toEqual([]);
    expect(state.coins).toEqual([]);
    expect(state.suns).toEqual([]);
    expect(state.sunBursts).toEqual([]);
  });

  it('initializes upgrades at starting levels', () => {
    const state = createInitialState();
    expect(state.upgrades.damageLevel).toBe(1);
    expect(state.upgrades.speedLevel).toBe(1);
    expect(state.upgrades.clickLevel).toBe(1);
    expect(state.upgrades.energyLevel).toBe(1);
    expect(state.upgrades.evolutionSpeedLevel).toBe(1);
    expect(state.upgrades.grassLevel).toBe(0);
    expect(state.upgrades.grassEvolutions).toEqual([]);
  });

  it('initializes all abilities at level 0 with correct maxCooldowns', () => {
    const state = createInitialState();
    expect(state.abilities.sunBurst.level).toBe(0);
    expect(state.abilities.sunBurst.maxCooldown).toBe(30);
    expect(state.abilities.rootEntangle.level).toBe(0);
    expect(state.abilities.rootEntangle.maxCooldown).toBe(45);
    expect(state.abilities.poisonCloud.level).toBe(0);
    expect(state.abilities.poisonCloud.maxCooldown).toBe(60);
    expect(state.abilities.solGenerator.level).toBe(0);
    expect(state.abilities.solGenerator.maxCooldown).toBe(0);
  });

  it('initializes prestige with zero values', () => {
    const state = createInitialState();
    expect(state.prestige.points).toBe(0);
    expect(state.prestige.totalPoints).toBe(0);
    expect(state.prestige.upgrades.soulRoots).toBe(0);
    expect(state.prestige.upgrades.ancientSun).toBe(0);
    expect(state.prestige.upgrades.evolutionMemory).toBe(0);
    expect(state.prestige.upgrades.eternalGrowth).toBe(0);
  });

  it('initializes stats with zeros', () => {
    const state = createInitialState();
    expect(state.stats.totalEnergyGenerated).toBe(0);
    expect(state.stats.enemiesKilled).toBe(0);
    expect(state.stats.wavesCompleted).toBe(0);
  });

  it('initializes modal as closed', () => {
    const state = createInitialState();
    expect(state.modal.isOpen).toBe(false);
    expect(state.modal.type).toBeNull();
    expect(state.modal.skillId).toBeNull();
    expect(state.modal.options).toEqual([]);
  });

  it('sets waveState correctly for wave 1', () => {
    const ws = createInitialState().waveState;
    expect(ws.spawned).toBe(0);
    expect(ws.killed).toBe(0);
    expect(ws.totalToSpawn).toBe(10);
    expect(ws.isBoss).toBe(false);
    expect(ws.spawnRate).toBe(1);
  });
});
