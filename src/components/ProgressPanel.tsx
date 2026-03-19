/**
 * ProgressPanel Component
 * Displays player progress, achievements, and statistics
 */

import React, { useMemo } from 'react';
import { Trophy, Star, Target, Clock, Zap, Swords, Leaf, TrendingUp, Award, CheckCircle2, Lock } from 'lucide-react';
import { formatNumber } from '../utils/number';
import { Language, t } from '../i18n';

interface ProgressPanelProps {
  lang: Language;
  uiState: {
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
      sunBurst: { level: number; evolutions: string[] };
      rootEntangle: { level: number; evolutions: string[] };
      poisonCloud: { level: number; evolutions: string[] };
      solGenerator: { level: number; evolutions: string[] };
    };
    resets: number;
    energyMultiplier: number;
  };
  totalPlayTime: number;
  onClose: () => void;
}

interface Achievement {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  condition: (state: ProgressPanelProps['uiState']) => boolean;
  reward?: string;
}

const achievements: Achievement[] = [
  {
    id: 'first_wave',
    titleKey: 'achievement1Title',
    descriptionKey: 'achievement1Desc',
    icon: <Target className="w-5 h-5 text-emerald-400" />,
    condition: (state) => state.wave >= 1,
  },
  {
    id: 'wave_10',
    titleKey: 'achievement2Title',
    descriptionKey: 'achievement2Desc',
    icon: <Swords className="w-5 h-5 text-blue-400" />,
    condition: (state) => state.wave >= 10,
  },
  {
    id: 'wave_50',
    titleKey: 'achievement3Title',
    descriptionKey: 'achievement3Desc',
    icon: <Trophy className="w-5 h-5 text-yellow-400" />,
    condition: (state) => state.wave >= 50,
  },
  {
    id: 'wave_100',
    titleKey: 'achievement4Title',
    descriptionKey: 'achievement4Desc',
    icon: <Star className="w-5 h-5 text-purple-400" />,
    condition: (state) => state.wave >= 100,
  },
  {
    id: 'plant_level_10',
    titleKey: 'achievement5Title',
    descriptionKey: 'achievement5Desc',
    icon: <Leaf className="w-5 h-5 text-green-400" />,
    condition: (state) => state.plant.level >= 10,
  },
  {
    id: 'plant_level_50',
    titleKey: 'achievement6Title',
    descriptionKey: 'achievement6Desc',
    icon: <Leaf className="w-5 h-5 text-emerald-400" />,
    condition: (state) => state.plant.level >= 50,
  },
  {
    id: 'plant_level_100',
    titleKey: 'achievement7Title',
    descriptionKey: 'achievement7Desc',
    icon: <Leaf className="w-5 h-5 text-cyan-400" />,
    condition: (state) => state.plant.level >= 100,
  },
  {
    id: 'first_reset',
    titleKey: 'achievement8Title',
    descriptionKey: 'achievement8Desc',
    icon: <TrendingUp className="w-5 h-5 text-orange-400" />,
    condition: (state) => state.resets >= 1,
  },
  {
    id: 'reset_5',
    titleKey: 'achievement9Title',
    descriptionKey: 'achievement9Desc',
    icon: <TrendingUp className="w-5 h-5 text-red-400" />,
    condition: (state) => state.resets >= 5,
  },
  {
    id: 'reset_10',
    titleKey: 'achievement10Title',
    descriptionKey: 'achievement10Desc',
    icon: <Award className="w-5 h-5 text-amber-400" />,
    condition: (state) => state.resets >= 10,
  },
  {
    id: 'energy_1m',
    titleKey: 'achievement11Title',
    descriptionKey: 'achievement11Desc',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    condition: (state) => state.energy >= 1000000,
  },
  {
    id: 'energy_1b',
    titleKey: 'achievement12Title',
    descriptionKey: 'achievement12Desc',
    icon: <Zap className="w-5 h-5 text-yellow-400" />,
    condition: (state) => state.energy >= 1000000000,
  },
  {
    id: 'all_abilities',
    titleKey: 'achievement13Title',
    descriptionKey: 'achievement13Desc',
    icon: <Star className="w-5 h-5 text-pink-400" />,
    condition: (state) => 
      state.abilities.sunBurst.level > 0 && 
      state.abilities.rootEntangle.level > 0 && 
      state.abilities.poisonCloud.level > 0,
  },
  {
    id: 'damage_multiplier_10',
    titleKey: 'achievement14Title',
    descriptionKey: 'achievement14Desc',
    icon: <Swords className="w-5 h-5 text-red-400" />,
    condition: (state) => state.plant.damageMultiplier >= 10,
  },
  {
    id: 'speed_multiplier_5',
    titleKey: 'achievement15Title',
    descriptionKey: 'achievement15Desc',
    icon: <Clock className="w-5 h-5 text-blue-400" />,
    condition: (state) => state.plant.attackSpeedMultiplier >= 5,
  },
];

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

export default function ProgressPanel({ lang, uiState, totalPlayTime, onClose }: ProgressPanelProps) {
  const unlockedAchievements = useMemo(() => {
    return achievements.filter(a => a.condition(uiState));
  }, [uiState]);

  const totalUpgrades = useMemo(() => {
    return (
      uiState.upgrades.damageLevel +
      uiState.upgrades.speedLevel +
      uiState.upgrades.clickLevel +
      uiState.upgrades.energyLevel +
      uiState.upgrades.evolutionSpeedLevel +
      uiState.upgrades.grassLevel +
      uiState.abilities.sunBurst.level +
      uiState.abilities.rootEntangle.level +
      uiState.abilities.poisonCloud.level +
      uiState.abilities.solGenerator.level
    );
  }, [uiState]);

  const totalEvolutions = useMemo(() => {
    return (
      uiState.upgrades.grassEvolutions.length +
      uiState.abilities.sunBurst.evolutions.length +
      uiState.abilities.rootEntangle.evolutions.length +
      uiState.abilities.poisonCloud.evolutions.length +
      uiState.abilities.solGenerator.evolutions.length
    );
  }, [uiState]);

  const progressScore = useMemo(() => {
    const waveScore = Math.min(100, uiState.wave);
    const levelScore = Math.min(100, uiState.plant.level);
    const resetScore = uiState.resets * 10;
    const achievementScore = unlockedAchievements.length * 5;
    const upgradeScore = Math.min(50, totalUpgrades / 2);
    
    return Math.floor(waveScore + levelScore + resetScore + achievementScore + upgradeScore);
  }, [uiState, unlockedAchievements, totalUpgrades]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={onClose}>
      <div 
        className="bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-800 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h2 className="text-2xl font-black text-stone-100 uppercase tracking-wider">
                {t[lang].progressTitle || 'Progress'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-stone-800 hover:bg-stone-700 rounded-lg text-stone-400 hover:text-white transition-colors"
            >
              ✕
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
                <div className="text-xl font-black text-stone-200">{formatPlayTime(totalPlayTime)}</div>
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h3 className="text-lg font-bold text-stone-300 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              {t[lang].achievements || 'Achievements'} ({unlockedAchievements.length}/{achievements.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {achievements.map((achievement) => {
                const isUnlocked = achievement.condition(uiState);
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
                        {isUnlocked ? achievement.icon : <Lock className="w-5 h-5 text-stone-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${isUnlocked ? 'text-stone-100' : 'text-stone-500'}`}>
                            {t[lang][achievement.titleKey as keyof typeof t[Language]] || achievement.id}
                          </span>
                          {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {t[lang][achievement.descriptionKey as keyof typeof t[Language]] || 'Achievement description'}
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
              {unlockedAchievements.length < achievements.length && (
                <div className="bg-stone-950 rounded-xl p-4 border border-stone-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-stone-300 font-bold">{t[lang].milestoneAllAchievements || 'Complete All Achievements'}</span>
                    <span className="text-stone-500 text-sm">{unlockedAchievements.length}/{achievements.length}</span>
                  </div>
                  <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 transition-all"
                      style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
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
