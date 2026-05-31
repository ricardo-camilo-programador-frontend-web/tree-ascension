/**
 * achievements.ts — Centralized achievement definitions and unlock logic.
 *
 * Achievement unlock state is persisted in `GameState.unlockedAchievements`
 * so that once earned, an achievement can NEVER be "un-earned", even if the
 * triggering condition later becomes false (e.g. spending energy below the
 * threshold, or losing a multiplier after prestige reset).
 *
 * The `checkAndUnlockAchievements()` function should be called periodically
 * from the UI sync loop (App.tsx 100ms interval) and mutates the persisted
 * set in-place.
 */

import type { GameState } from './game';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AchievementDef {
  /** Unique identifier — stored in save data */
  id: string;
  /** i18n key for the achievement title */
  titleKey: string;
  /** i18n key for the achievement description */
  descriptionKey: string;
  /**
   * Pure condition evaluated against the current GameState.
   * Returns `true` when the achievement should be considered unlocked.
   */
  condition: (state: GameState) => boolean;
}

// ---------------------------------------------------------------------------
// Achievement definitions
// ---------------------------------------------------------------------------

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_wave',
    titleKey: 'achievement1Title',
    descriptionKey: 'achievement1Desc',
    condition: (s) => s.wave >= 1,
  },
  {
    id: 'wave_10',
    titleKey: 'achievement2Title',
    descriptionKey: 'achievement2Desc',
    condition: (s) => s.wave >= 10,
  },
  {
    id: 'wave_50',
    titleKey: 'achievement3Title',
    descriptionKey: 'achievement3Desc',
    condition: (s) => s.wave >= 50,
  },
  {
    id: 'wave_100',
    titleKey: 'achievement4Title',
    descriptionKey: 'achievement4Desc',
    condition: (s) => s.wave >= 100,
  },
  {
    id: 'plant_level_10',
    titleKey: 'achievement5Title',
    descriptionKey: 'achievement5Desc',
    condition: (s) => s.plant.level >= 10,
  },
  {
    id: 'plant_level_50',
    titleKey: 'achievement6Title',
    descriptionKey: 'achievement6Desc',
    condition: (s) => s.plant.level >= 50,
  },
  {
    id: 'plant_level_100',
    titleKey: 'achievement7Title',
    descriptionKey: 'achievement7Desc',
    condition: (s) => s.plant.level >= 100,
  },
  {
    id: 'first_reset',
    titleKey: 'achievement8Title',
    descriptionKey: 'achievement8Desc',
    condition: (s) => s.resets >= 1,
  },
  {
    id: 'reset_5',
    titleKey: 'achievement9Title',
    descriptionKey: 'achievement9Desc',
    condition: (s) => s.resets >= 5,
  },
  {
    id: 'reset_10',
    titleKey: 'achievement10Title',
    descriptionKey: 'achievement10Desc',
    condition: (s) => s.resets >= 10,
  },
  {
    id: 'energy_1m',
    titleKey: 'achievement11Title',
    descriptionKey: 'achievement11Desc',
    condition: (s) => s.energy >= 1_000_000,
  },
  {
    id: 'energy_1b',
    titleKey: 'achievement12Title',
    descriptionKey: 'achievement12Desc',
    condition: (s) => s.energy >= 1_000_000_000,
  },
  {
    id: 'all_abilities',
    titleKey: 'achievement13Title',
    descriptionKey: 'achievement13Desc',
    condition: (s) =>
      s.abilities.sunBurst.level > 0 &&
      s.abilities.rootEntangle.level > 0 &&
      s.abilities.poisonCloud.level > 0 &&
      s.abilities.solGenerator.level > 0,
  },
  {
    id: 'damage_multiplier_10',
    titleKey: 'achievement14Title',
    descriptionKey: 'achievement14Desc',
    condition: (s) => s.plant.damageMultiplier >= 10,
  },
  {
    id: 'speed_multiplier_5',
    titleKey: 'achievement15Title',
    descriptionKey: 'achievement15Desc',
    condition: (s) => s.plant.attackSpeedMultiplier >= 5,
  },
];

/** Fast lookup Set from the persisted array */
const existingSet = (ids: string[]): Set<string> => new Set(ids);

// ---------------------------------------------------------------------------
// Core unlock logic
// ---------------------------------------------------------------------------

/**
 * Evaluate all achievement conditions against `state`.
 * Any newly-met achievement whose `id` is NOT already in
 * `state.unlockedAchievements` is appended (mutating in-place).
 *
 * @returns Array of **newly** unlocked achievement IDs (empty if nothing new).
 */
export function checkAndUnlockAchievements(state: GameState): string[] {
  const previously = existingSet(state.unlockedAchievements);
  const newlyUnlocked: string[] = [];

  for (const ach of ACHIEVEMENTS) {
    if (!previously.has(ach.id) && ach.condition(state)) {
      newlyUnlocked.push(ach.id);
    }
  }

  if (newlyUnlocked.length > 0) {
    state.unlockedAchievements.push(...newlyUnlocked);
  }

  return newlyUnlocked;
}
