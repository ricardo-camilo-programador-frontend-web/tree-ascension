/**
 * Shop Component
 * Panel for purchasing upgrades and abilities
 */

import React from 'react';
import { Save, RotateCcw, X, ShoppingCart } from 'lucide-react';
import { GameState, buyUpgrade, getUpgradeCostTotal } from '../game';
import { formatNumber } from '../utils/number';
import { t, Language } from '../i18n';
import UpgradeButton from './UpgradeButton';
import AbilityButton from './AbilityButton';
import AdsterraAd from '../components/AdsterraAd';
import {
  Zap, Sword, Clock, MousePointer2, FastForward, Leaf,
  Sun, Wind, Skull, Sparkles
} from 'lucide-react';

interface ShopProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  gameState: React.MutableRefObject<GameState>;
  lang: Language;
  buyMultiplier: number | 'MAX';
  onBuyMultiplierChange: (value: number | 'MAX') => void;
  onSave: () => void;
  onResetClick: () => void;
  onStateUpdate: () => void;
  onSkillInfo: (skillId: string) => void;
  uiState: any;
}

export default function Shop({
  isOpen,
  onClose,
  onToggle,
  gameState,
  lang,
  buyMultiplier,
  onBuyMultiplierChange,
  onSave,
  onResetClick,
  onStateUpdate,
  onSkillInfo,
  uiState,
}: ShopProps) {
  const handleBuy = (type: string) => {
    buyUpgrade(gameState.current, type, buyMultiplier);
    onStateUpdate();
  };

  const getCostInfo = (type: string, level: number) => {
    return getUpgradeCostTotal(type, level, uiState, buyMultiplier);
  };

  const canReset = uiState.wave >= 50 || uiState.plant.level >= 50;

  const containerClasses = isOpen
    ? 'fixed inset-0 z-40 bg-black/60 backdrop-blur-md flex items-center justify-center p-4'
    : 'hidden lg:flex lg:static lg:w-96 lg:bg-stone-900 lg:border-l lg:border-stone-800 lg:flex-col lg:shadow-2xl lg:z-10 lg:flex-shrink-0';

  const innerClasses = isOpen
    ? 'bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl'
    : 'flex flex-col h-full w-full';

  return (
    <>
      {/* Mobile Shop Button */}
      <button
        onClick={onToggle}
        className="lg:hidden absolute bottom-24 right-4 z-30 bg-emerald-600 text-white flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl active:scale-95 transition-transform border border-emerald-400/30 backdrop-blur-md"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="font-bold text-sm uppercase tracking-wider">Shop</span>
      </button>

      {/* Shop Panel */}
      <div className={containerClasses} onClick={() => isOpen && onClose()}>
        <div className={innerClasses} onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="p-4 border-b border-stone-800 bg-stone-900/50 flex justify-between items-center">
            <h2 className="text-lg font-black tracking-tight text-stone-300">{t[lang].upgrades}</h2>
            <div className="flex gap-2">
              <button
                onClick={onSave}
                className="p-2 bg-stone-800 rounded-lg hover:bg-stone-700 text-stone-400 transition-colors"
                title={t[lang].saveGame}
              >
                <Save className="w-4 h-4" />
              </button>
              <div className="relative group">
                <button
                  onClick={onResetClick}
                  disabled={!canReset}
                  className={`p-2 rounded-lg transition-colors ${
                    canReset
                      ? 'bg-stone-800 hover:bg-red-900/50 text-stone-400 hover:text-red-400'
                      : 'bg-stone-900 text-stone-700 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {!canReset && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-black text-xs text-stone-400 p-2 rounded border border-stone-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                    Reset unlocks after Wave 50 or Plant Level 50
                  </div>
                )}
              </div>
              {isOpen && (
                <button
                  onClick={onClose}
                  className="p-2 bg-stone-800 rounded-lg hover:bg-stone-700 text-stone-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Buy Multiplier Toggle */}
            <div className="flex bg-stone-950 rounded-xl p-1 border border-stone-800">
              {(['1', '10', 'MAX'] as const).map(mult => (
                <button
                  key={mult}
                  onClick={() => onBuyMultiplierChange(mult === 'MAX' ? 'MAX' : parseInt(mult))}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    buyMultiplier === (mult === 'MAX' ? 'MAX' : parseInt(mult))
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-stone-500 hover:text-stone-300 hover:bg-stone-900'
                  }`}
                >
                  x{mult}
                </button>
              ))}
            </div>

            {/* Basic Upgrades */}
            <div className="grid grid-cols-1 gap-3">
              {/* Damage */}
              {(() => {
                const info = getCostInfo('damage', uiState.upgrades.damageLevel);
                return (
                  <UpgradeButton
                    icon={<Sword className="w-6 h-6 text-red-400" />}
                    title={t[lang].damage}
                    level={uiState.upgrades.damageLevel}
                    cost={info.cost}
                    count={info.count}
                    canAfford={info.count > 0 && uiState.energy >= info.cost}
                    onClick={() => handleBuy('damage')}
                    onIconClick={() => onSkillInfo('damage')}
                    formatNumber={formatNumber}
                    lang={lang}
                    colorClass="from-red-500/20 to-orange-500/20"
                  />
                );
              })()}

              {/* Speed */}
              {(() => {
                const info = getCostInfo('speed', uiState.upgrades.speedLevel);
                return (
                  <UpgradeButton
                    icon={<Clock className="w-6 h-6 text-emerald-400" />}
                    title={t[lang].attackSpeed}
                    level={uiState.upgrades.speedLevel}
                    cost={info.cost}
                    count={info.count}
                    canAfford={info.count > 0 && uiState.energy >= info.cost}
                    onClick={() => handleBuy('speed')}
                    onIconClick={() => onSkillInfo('speed')}
                    formatNumber={formatNumber}
                    lang={lang}
                    colorClass="from-emerald-500/20 to-teal-500/20"
                  />
                );
              })()}

              {/* Click */}
              {(() => {
                const info = getCostInfo('click', uiState.upgrades.clickLevel);
                return (
                  <UpgradeButton
                    icon={<MousePointer2 className="w-6 h-6 text-blue-400" />}
                    title={t[lang].clickDamage}
                    level={uiState.upgrades.clickLevel}
                    cost={info.cost}
                    count={info.count}
                    canAfford={info.count > 0 && uiState.energy >= info.cost}
                    onClick={() => handleBuy('click')}
                    onIconClick={() => onSkillInfo('click')}
                    formatNumber={formatNumber}
                    lang={lang}
                    colorClass="from-blue-500/20 to-indigo-500/20"
                  />
                );
              })()}

              {/* Energy */}
              {(() => {
                const info = getCostInfo('energy', uiState.upgrades.energyLevel);
                return (
                  <UpgradeButton
                    icon={<Zap className="w-6 h-6 text-yellow-400" />}
                    title={t[lang].energyMultiplier}
                    level={uiState.upgrades.energyLevel}
                    cost={info.cost}
                    count={info.count}
                    canAfford={info.count > 0 && uiState.energy >= info.cost}
                    onClick={() => handleBuy('energy')}
                    onIconClick={() => onSkillInfo('energy')}
                    formatNumber={formatNumber}
                    lang={lang}
                    colorClass="from-yellow-500/20 to-amber-500/20"
                  />
                );
              })()}

              {/* Evolution Speed */}
              {(() => {
                const info = getCostInfo('evolutionSpeed', uiState.upgrades.evolutionSpeedLevel);
                return (
                  <UpgradeButton
                    icon={<FastForward className="w-6 h-6 text-cyan-400" />}
                    title={t[lang].evolutionSpeed}
                    level={uiState.upgrades.evolutionSpeedLevel}
                    cost={info.cost}
                    count={info.count}
                    canAfford={info.count > 0 && uiState.energy >= info.cost}
                    onClick={() => handleBuy('evolutionSpeed')}
                    onIconClick={() => onSkillInfo('evolutionSpeed')}
                    formatNumber={formatNumber}
                    lang={lang}
                    colorClass="from-cyan-500/20 to-blue-500/20"
                  />
                );
              })()}

              {/* Grass */}
              {(() => {
                const info = getCostInfo('grass', uiState.upgrades.grassLevel);
                return (
                  <UpgradeButton
                    icon={<Leaf className="w-6 h-6 text-green-500" />}
                    title={t[lang].grassDamage}
                    level={uiState.upgrades.grassLevel}
                    cost={info.cost}
                    count={info.count}
                    canAfford={info.count > 0 && uiState.energy >= info.cost}
                    onClick={() => handleBuy('grass')}
                    onIconClick={() => onSkillInfo('grass')}
                    formatNumber={formatNumber}
                    lang={lang}
                    colorClass="from-green-500/20 to-lime-500/20"
                  />
                );
              })()}
            </div>

            {/* Abilities */}
            <div>
              <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">{t[lang].abilities}</h3>
              <div className="grid grid-cols-1 gap-3">
                {/* Sun Burst */}
                {(() => {
                  const info = getCostInfo('sunBurst', uiState.abilities.sunBurst.level);
                  return (
                    <AbilityButton
                      icon={<Sun className="w-6 h-6 text-yellow-300" />}
                      title={t[lang].ability1}
                      ability={uiState.abilities.sunBurst}
                      cost={info.cost}
                      count={info.count}
                      canAfford={info.count > 0 && uiState.energy >= info.cost}
                      onClick={() => handleBuy('sunBurst')}
                      onIconClick={() => onSkillInfo('sunBurst')}
                      formatNumber={formatNumber}
                      lang={lang}
                      colorClass="from-yellow-400/30 to-orange-500/30"
                    />
                  );
                })()}

                {/* Root Entangle */}
                {(() => {
                  const info = getCostInfo('rootEntangle', uiState.abilities.rootEntangle.level);
                  return (
                    <AbilityButton
                      icon={<Wind className="w-6 h-6 text-emerald-300" />}
                      title={t[lang].ability2}
                      ability={uiState.abilities.rootEntangle}
                      cost={info.cost}
                      count={info.count}
                      canAfford={info.count > 0 && uiState.energy >= info.cost}
                      onClick={() => handleBuy('rootEntangle')}
                      onIconClick={() => onSkillInfo('rootEntangle')}
                      formatNumber={formatNumber}
                      lang={lang}
                      colorClass="from-emerald-400/30 to-teal-500/30"
                    />
                  );
                })()}

                {/* Poison Cloud */}
                {(() => {
                  const info = getCostInfo('poisonCloud', uiState.abilities.poisonCloud.level);
                  return (
                    <AbilityButton
                      icon={<Skull className="w-6 h-6 text-purple-500" />}
                      title={t[lang].ability3}
                      ability={uiState.abilities.poisonCloud}
                      cost={info.cost}
                      count={info.count}
                      canAfford={info.count > 0 && uiState.energy >= info.cost}
                      onClick={() => handleBuy('poisonCloud')}
                      onIconClick={() => onSkillInfo('poisonCloud')}
                      formatNumber={formatNumber}
                      lang={lang}
                      colorClass="from-purple-500/30 to-fuchsia-600/30"
                    />
                  );
                })()}

                {/* Sol Generator (Unlocks at Plant Level 500) */}
                {uiState.plant.level >= 500 && (() => {
                  const info = getCostInfo('solGenerator', uiState.abilities.solGenerator.level);
                  return (
                    <AbilityButton
                      icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
                      title={t[lang].ability4}
                      ability={uiState.abilities.solGenerator}
                      cost={info.cost}
                      count={info.count}
                      canAfford={info.count > 0 && uiState.energy >= info.cost}
                      onClick={() => handleBuy('solGenerator')}
                      onIconClick={() => onSkillInfo('solGenerator')}
                      formatNumber={formatNumber}
                      lang={lang}
                      colorClass="from-yellow-400/30 to-amber-500/30"
                    />
                  );
                })()}
              </div>
            </div>

            {/* Sidebar Ad */}
            <div className="w-full flex justify-center mt-6 mb-2">
              <AdsterraAd zone="sidebar_banner" width={300} height={250} lazy />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
