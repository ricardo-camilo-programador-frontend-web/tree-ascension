/**
 * ProgressPanel Component
 * Displays player progress, achievements, and statistics.
 *
 * Play time is derived from `uiState.gameTime` (accumulated in the game loop
 * via `state.timers.gameTime`) so it persists across modal open/close cycles.
 *
 * Achievement unlock state is persisted in `uiState.unlockedAchievements`
 * (sourced from `GameState.unlockedAchievements`). Once an achievement is
 * unlocked it can NEVER be "un-earned", even if the triggering condition
 * becomes false later (e.g. spending energy below a threshold).
 */

import React, { useMemo, useEffect, useRef, useCallback } from 'react';
import { Trophy, Star, Target, Clock, Zap, Sword, Leaf, TrendingUp, Award, CheckCircle2, Lock, X } from 'lucide-react';
import { formatNumber } from '../utils/number';
import type { Language, TranslationSet } from '../i18n/types';
import { t } from '../i18n';
import { ACHIEVEMENTS, type AchievementDef } from '../achievements';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProgressPanelProps {
  lang: Language;
  uiState: {
    energy: number;
    wave: number;
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
      sunBurst: { level: number; evolutions: string[] };
      rootEntangle: { level: number; evolutions: string[] };
      poisonCloud: { level: number; evolutions: string[] };
      solGenerator: { level: number; evolutions: string[] };
    };
    resets: number;
    /** Accumulated game time in seconds, tracked in the game loop */
    gameTime: number;
    /**
     * Persisted set of achievement IDs that have been permanently unlocked.
     * Sourced from `GameState.unlockedAchievements`.
     */
    unlockedAchievements: string[];
  };
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Icon map — maps achievement IDs to their Lucide icons for rendering.
// This is the only part of achievements that belongs in the UI layer.
// ---------------------------------------------------------------------------

const achievementIcons: Record<string, React.ReactNode> = {
  first_wave: <Target className="w-5 h-5 text-emerald-400" />,
  wave_10: <Sword className="w-5 h-5 text-blue-400" />,
  wave_50: <Trophy className="w-5 h-5 text-yellow-400" />,
  wave_100: <Star className="w-5 h-5 text-purple-400" />,
  plant_level_10: <Leaf className="w-5 h-5 text-green-400" />,
  plant_level_50: <Leaf className="w-5 h-5 text-emerald-400" />,
  plant_level_100: <Leaf className="w-5 h-5 text-cyan-400" />,
  first_reset: <TrendingUp className="w-5 h-5 text-orange-400" />,
  reset_5: <TrendingUp className="w-5 h-5 text-red-400" />,
  reset_10: <Award className="w-5 h-5 text-amber-400" />,
  energy_1m: <Zap className="w-5 h-5 text-yellow-400" />,
  energy_1b: <Zap className="w-5 h-5 text-yellow-400" />,
  all_abilities: <Star className="w-5 h-5 text-pink-400" />,
  damage_multiplier_10: <Sword className="w-5 h-5 text-red-400" />,
  speed_multiplier_5: <Clock className="w-5 h-5 text-blue-400" />,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatPlayTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProgressPanel({ lang, uiState, onClose }: ProgressPanelProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Body scroll lock while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus management: save previous focus, focus close button on mount, restore on unmount
  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();
    return () => {
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Focus trap + Escape
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === modalRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || active === modalRef.current)) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose]);

  // Use the PERSISTED unlock set — not recomputed from conditions
  const unlockedSet = useMemo(() => {
    return new Set(uiState.unlockedAchievements);
  }, [uiState.unlockedAchievements]);

  const unlockedCount = unlockedSet.size;

  // Sum all upgrade + ability levels using Object.values for DRY
  const totalUpgrades = useMemo(() => {
    const upgradeLevels = Object.values(uiState.upgrades)
      .filter((v): v is number => typeof v === 'number');
    const abilityLevels = Object.values(uiState.abilities)
      .map(a => a.level);
    return [...upgradeLevels, ...abilityLevels].reduce((sum, v) => sum + v, 0);
  }, [uiState]);

  const totalEvolutions = useMemo(() => {
    return (
      uiState.upgrades.grassEvolutions.length +
      Object.values(uiState.abilities)
        .reduce((sum, a) => sum + a.evolutions.length, 0)
    );
  }, [uiState]);

  /**
   * Progress Score — composite metric (max ~500 before uncapped resets):
   *   Wave:       capped at 100 (wave 100 = full points)
   *   Level:      capped at 100 (plant level 100 = full points)
   *   Resets:     10 pts each, uncapped (rewards prestige)
   *   Achievements: 5 pts each (15 × 5 = 75 max)
   *   Upgrades:   capped at 50 (totalUpgrades / 2, maxes at 100 upgrades)
   */
  const progressScore = useMemo(() => {
    const waveScore = Math.min(100, uiState.wave);
    const levelScore = Math.min(100, uiState.plant.level);
    const resetScore = uiState.resets * 10;
    const achievementScore = unlockedCount * 5;
    const upgradeScore = Math.min(50, totalUpgrades / 2);
    
    return Math.floor(waveScore + levelScore + resetScore + achievementScore + upgradeScore);
  }, [uiState, unlockedCount, totalUpgrades]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-panel-title"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl outline-none"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-800 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h2 id="progress-panel-title" className="text-2xl font-black text-stone-100 uppercase tracking-wider">
                {t[lang].progressTitle || 'Progress'}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label={t[lang].close || 'Close'}
              className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Progress Score */}
          <div className="mt-4 bg-stone-950 rounded-xl p-4 border border-stone-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-stone-400 font-bold uppercase text-sm tracking-wider">
                {t[lang].progressScore || 'Progress Score'}
              </span>
              <span className="text-2xl font-black text-emerald-400">{progressScore}</span>
            </div>
            <div className="h-3 bg-stone-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.min(100, progressScore / 5)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6 space-y-6">
          
          {/* Statistics */}
          <section>
            <h3 className="text-lg font-bold text-stone-300 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              {t[lang].statistics || 'Statistics'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{t[lang].wave}</div>
                <div className="text-xl font-black text-stone-200">{uiState.wave}</div>
              </div>
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{t[lang].plantLevel}</div>
                <div className="text-xl font-black text-emerald-400">{uiState.plant.level}-{uiState.plant.stage}</div>
              </div>
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{t[lang].resets || 'Resets'}</div>
                <div className="text-xl font-black text-orange-400">{uiState.resets}</div>
              </div>
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{t[lang].energy || 'Energy'}</div>
                <div className="text-xl font-black text-yellow-400">{formatNumber(uiState.energy)}</div>
              </div>
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{t[lang].totalUpgrades || 'Total Upgrades'}</div>
                <div className="text-xl font-black text-blue-400">{totalUpgrades}</div>
              </div>
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{t[lang].evolutions || 'Evolutions'}</div>
                <div className="text-xl font-black text-purple-400">{totalEvolutions}</div>
              </div>
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{t[lang].damageMultiplier || 'Damage Mult'}</div>
                <div className="text-xl font-black text-red-400">x{formatNumber(uiState.plant.damageMultiplier)}</div>
              </div>
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{t[lang].speedMultiplier || 'Speed Mult'}</div>
                <div className="text-xl font-black text-cyan-400">x{formatNumber(uiState.plant.attackSpeedMultiplier)}</div>
              </div>
              <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">{t[lang].playTime || 'Play Time'}</div>
                <div className="text-xl font-black text-stone-200">{formatPlayTime(uiState.gameTime)}</div>
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h3 className="text-lg font-bold text-stone-300 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              {t[lang].achievements || 'Achievements'} ({unlockedCount}/{ACHIEVEMENTS.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = unlockedSet.has(achievement.id);
                return (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isUnlocked 
                        ? 'bg-stone-800/50 border-yellow-500/30' 
                        : 'bg-stone-950/50 border-stone-800 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isUnlocked ? 'bg-yellow-500/20' : 'bg-stone-800'}`}>
                        {isUnlocked
                          ? (achievementIcons[achievement.id] ?? <Star className="w-5 h-5 text-stone-400" />)
                          : <Lock className="w-5 h-5 text-stone-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isUnlocked ? 'text-stone-100' : 'text-stone-500'}`}>
                            {t[lang][achievement.titleKey as keyof TranslationSet] || achievement.id}
                          </span>
                          {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {t[lang][achievement.descriptionKey as keyof TranslationSet] || 'Achievement description'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Milestones */}
          <section>
            <h3 className="text-lg font-bold text-stone-300 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              {t[lang].milestones || 'Next Milestones'}
            </h3>
            <div className="space-y-3">
              {uiState.wave < 50 && (
                <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-stone-300 font-bold">{t[lang].milestoneWave50 || 'Reach Wave 50'}</span>
                    <span className="text-stone-500 text-sm">{uiState.wave}/50</span>
                  </div>
                  <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${(uiState.wave / 50) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {uiState.plant.level < 50 && (
                <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-stone-300 font-bold">{t[lang].milestonePlant50 || 'Reach Plant Level 50'}</span>
                    <span className="text-stone-500 text-sm">{uiState.plant.level}/50</span>
                  </div>
                  <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-500 transition-all"
                      style={{ width: `${(uiState.plant.level / 50) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {uiState.resets < 1 && (
                <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-stone-300 font-bold">{t[lang].milestoneFirstReset || 'First Prestige Reset'}</span>
                    <span className="text-stone-500 text-sm">{t[lang].locked || 'Locked'}</span>
                  </div>
                  <p className="text-xs text-stone-500">{t[lang].milestoneFirstResetDesc || 'Reach Wave 50 or Plant Level 50 to unlock'}</p>
                </div>
              )}
              {unlockedCount < ACHIEVEMENTS.length && (
                <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-stone-300 font-bold">{t[lang].milestoneAllAchievements || 'Complete All Achievements'}</span>
                    <span className="text-stone-500 text-sm">{unlockedCount}/{ACHIEVEMENTS.length}</span>
                  </div>
                  <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 transition-all"
                      style={{ width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/50">
          <button
            onClick={onClose}
            className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl font-bold transition-colors"
          >
            {t[lang].close || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
