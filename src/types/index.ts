import type { ReactNode } from 'react';

/**
 * Central type definitions for Tree Ascension
 * This file exports all shared types used across the application
 */

// Re-export from game.ts for backward compatibility
export type { Zombie, ZombieType, Projectile, Particle, FloatingText, Coin, Sun, SunBurst, GameState } from '../game';

// UI-specific types
export type { Language } from '../i18n';

// Component prop types
export interface UpgradeButtonProps {
  icon: ReactNode;
  title: string;
  level: number;
  cost: number;
  count: number;
  canAfford: boolean;
  onClick: () => void;
  onIconClick?: () => void;
  formatNumber: (num: number) => string;
  lang: string;
  colorClass: string;
}

export interface AbilityButtonProps {
  icon: ReactNode;
  title: string;
  ability: {
    level: number;
    cooldown: number;
    maxCooldown: number;
    active: boolean;
    evolutions: string[];
  };
  cost: number;
  count: number;
  canAfford: boolean;
  onClick: () => void;
  onIconClick?: () => void;
  formatNumber: (num: number) => string;
  lang: string;
  colorClass: string;
}

// UI State type (for performance - only updates what's needed)
export interface UIState {
  energy: number;
  wave: number;
  playerHealth: number;
  plant: {
    level: number;
    stage: number;
    evolutionProgress: number;
    baseDamage: number;
    damageMultiplier: number;
    attackSpeedMultiplier: number;
  };
  upgrades: {
    damageLevel: number;
    speedLevel: number;
    clickLevel: number;
    energyLevel: number;
    evolutionSpeedLevel: number;
    grassLevel: number;
    grassEvolutions: string[];
  };
  abilities: {
    sunBurst: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
    rootEntangle: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
    poisonCloud: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
    solGenerator: { level: number; cooldown: number; maxCooldown: number; active: boolean; evolutions: string[] };
  };
  resets: number;
  energyMultiplier: number;
  modal: {
    isOpen: boolean;
    type: 'skillEvolution' | 'skillInfo' | null;
    skillId: string | null;
    options: { id: string; name: string; description: string }[];
  };
  waveState: {
    isBoss: boolean;
  };
  settings: {
    lowPerformance: boolean;
  };
}
