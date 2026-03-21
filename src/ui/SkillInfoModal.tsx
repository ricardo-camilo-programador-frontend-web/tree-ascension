/**
 * SkillInfoModal Component
 * Modal for displaying skill information
 */

import React from 'react';
import { X } from 'lucide-react';
import { formatNumber } from '../utils/number';
import { t, Language } from '../i18n';
import { UIState } from '../types';

interface SkillInfoModalProps {
  isOpen: boolean;
  skillId: string | null;
  uiState: UIState;
  lang: Language;
  onClose: () => void;
}

export default function SkillInfoModal({
  isOpen,
  skillId,
  uiState,
  lang,
  onClose,
}: SkillInfoModalProps) {
  if (!isOpen || !skillId) return null;

  const getSkillName = (id: string) => {
    switch (id) {
      case 'sunBurst': return 'Sun Burst';
      case 'rootEntangle': return 'Root Entangle';
      case 'poisonCloud': return 'Poison Cloud';
      case 'solGenerator': return 'Sol Generator';
      case 'grass': return 'Sharp Grass';
      case 'damage': return 'Plant Damage';
      case 'speed': return 'Attack Speed';
      case 'click': return 'Click Damage';
      case 'energy': return 'Energy Multiplier';
      case 'evolutionSpeed': return 'Evolution Speed';
      default: return 'Unknown Skill';
    }
  };

  const getSkillLevel = (id: string) => {
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(id)) {
      return (uiState.abilities as any)[id].level;
    } else if (id === 'grass') {
      return uiState.upgrades.grassLevel;
    } else if (['damage', 'speed', 'click', 'energy', 'evolutionSpeed'].includes(id)) {
      return (uiState.upgrades as any)[id + 'Level'];
    }
    return 0;
  };

  const getSkillEffect = (id: string) => {
    if (id === 'sunBurst') {
      const dmg = uiState.plant.baseDamage * uiState.plant.damageMultiplier * 5 * Math.pow(1.15, uiState.abilities.sunBurst.level - 1);
      return `${formatNumber(dmg)} Damage`;
    } else if (id === 'rootEntangle') {
      return '50% Slow for 5s';
    } else if (id === 'poisonCloud') {
      const dmg = uiState.plant.baseDamage * uiState.plant.damageMultiplier * 0.5 * Math.pow(1.15, uiState.abilities.poisonCloud.level - 1);
      return `${formatNumber(dmg * 5)} Total Damage`;
    } else if (id === 'solGenerator') {
      return `+${uiState.abilities.solGenerator.level} Sun per spawn`;
    } else if (id === 'grass') {
      const dmg = 5 * Math.pow(1.15, uiState.upgrades.grassLevel);
      return `${formatNumber(dmg)} DPS`;
    } else if (id === 'damage') {
      return `x${formatNumber(uiState.plant.damageMultiplier)}`;
    } else if (id === 'speed') {
      return `x${formatNumber(uiState.plant.attackSpeedMultiplier)}`;
    } else if (id === 'click') {
      const dmg = uiState.plant.baseDamage * uiState.plant.damageMultiplier * 2 * Math.pow(1.15, uiState.upgrades.clickLevel - 1);
      return `${formatNumber(dmg)} Damage`;
    } else if (id === 'energy') {
      return `x${formatNumber(uiState.energyMultiplier)}`;
    } else if (id === 'evolutionSpeed') {
      const speed = 5 * Math.pow(1.3, uiState.upgrades.evolutionSpeedLevel - 1);
      return `${formatNumber(speed)}/s`;
    }
    return '';
  };

  const getSkillCooldown = (id: string) => {
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(id)) {
      const ability = (uiState.abilities as any)[id];
      if (ability.maxCooldown === 0) return 0;
      const reduction = 1 - (0.5 * (1 - Math.exp(-0.01 * ability.level)));
      return Math.max(1, ability.maxCooldown * reduction).toFixed(1);
    }
    return 0;
  };

  const getSkillDescription = (id: string) => {
    switch (id) {
      case 'sunBurst': return 'Unleashes a burst of solar energy damaging all enemies on screen.';
      case 'rootEntangle': return 'Vines erupt from the ground slowing all enemies.';
      case 'poisonCloud': return 'Releases a toxic cloud dealing damage over time to all enemies.';
      case 'solGenerator': return 'Increases the amount of suns generated automatically.';
      case 'grass': return 'Sharp grass covers the ground dealing continuous damage to walking enemies.';
      case 'damage': return 'Increases the base damage of your plant.';
      case 'speed': return 'Increases the attack speed of your plant.';
      case 'click': return 'Increases the damage dealt when you click on enemies.';
      case 'energy': return 'Increases the amount of energy gained from all sources.';
      case 'evolutionSpeed': return 'Increases the speed at which your plant evolves.';
      default: return '';
    }
  };

  const getSkillEvolutions = (id: string) => {
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(id)) {
      return (uiState.abilities as any)[id].evolutions;
    } else if (id === 'grass') {
      return uiState.upgrades.grassEvolutions;
    }
    return [];
  };

  const formatEvolutionName = (id: string) => {
    return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const evolutions = getSkillEvolutions(skillId);

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4 sticky top-0 bg-stone-900 z-10 pb-2">
          <h2 className="text-2xl font-black text-emerald-400">
            {getSkillName(skillId)}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 text-stone-300">
          <div className="flex justify-between border-b border-stone-800 pb-2">
            <span className="text-stone-500">Level</span>
            <span className="font-bold">{getSkillLevel(skillId)}</span>
          </div>

          <div className="flex justify-between border-b border-stone-800 pb-2">
            <span className="text-stone-500">Effect</span>
            <span className="font-bold">{getSkillEffect(skillId)}</span>
          </div>

          <div className="flex justify-between border-b border-stone-800 pb-2">
            <span className="text-stone-500">Cooldown</span>
            <span className="font-bold">{getSkillCooldown(skillId)}s</span>
          </div>

          <div>
            <h3 className="text-stone-500 mb-1">Description</h3>
            <p className="text-sm">{getSkillDescription(skillId)}</p>
          </div>

          {evolutions.length > 0 && (
            <div>
              <h3 className="text-stone-500 mb-1">Unlocked Evolutions</h3>
              <ul className="list-disc list-inside text-sm text-emerald-300">
                {evolutions.map((evo: string) => (
                  <li key={evo}>{formatEvolutionName(evo)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
