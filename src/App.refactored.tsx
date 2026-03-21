/**
 * Tree Ascension - Idle Tower Defense
 * Main Application Component (Refactored)
 * 
 * This component orchestrates the game UI using modular components.
 * Original: 1021 lines → Target: ~150-200 lines
 */

import React, { useEffect, useCallback } from 'react';
import { GameState, createInitialState } from './game';
import { saveGame, loadGame } from './saveSystem';
import { fpsCounter } from './utils/performance';
import { getAudioSettings, updateAudioSettings, AudioSettings } from './audio';
import { initGlobalAds } from './ads/adsterra';
import { t, Language, languages } from './i18n';
import { formatNumber } from './utils/number';

// UI Components
import HUD from './ui/HUD';
import Shop from './ui/Shop';
import SettingsModal from './ui/SettingsModal';
import ResetModal from './ui/ResetModal';
import EvolutionModal from './ui/EvolutionModal';
import SkillInfoModal from './ui/SkillInfoModal';
import GameCanvas from './ui/GameCanvas';
import Footer from './ui/Footer';
import AdBanner from './ui/AdBanner';
import MoringaInfo from './components/MoringaInfo';

// Optimized UI state mapper
const mapStateToUI = (state: GameState) => ({
  energy: state.energy,
  wave: state.wave,
  playerHealth: state.playerHealth,
  plant: {
    level: state.plant.level,
    stage: state.plant.stage,
    evolutionProgress: state.plant.evolutionProgress,
    baseDamage: state.plant.baseDamage,
    damageMultiplier: state.plant.damageMultiplier,
    attackSpeedMultiplier: state.plant.attackSpeedMultiplier,
  },
  upgrades: state.upgrades,
  abilities: state.abilities,
  resets: state.resets,
  energyMultiplier: state.energyMultiplier,
  modal: state.modal,
  waveState: {
    isBoss: state.waveState.isBoss,
  },
  settings: state.settings,
});

export default function App() {
  const gameState = React.useRef<GameState>(createInitialState());
  const [lang, setLang] = React.useState<Language>('en');
  const [uiState, setUiState] = React.useState(() => mapStateToUI(gameState.current));
  const [fps, setFps] = React.useState(0);
  const [isShopOpen, setIsShopOpen] = React.useState(false);
  const [buyMultiplier, setBuyMultiplier] = React.useState<number | 'MAX'>(1);
  const [showResetModal, setShowResetModal] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [audio, setAudio] = React.useState<AudioSettings>(getAudioSettings());

  // Initialize game
  useEffect(() => {
    initGlobalAds();

    const savedLang = localStorage.getItem('idleTD_lang') as Language;
    if (savedLang && languages.some(l => l.code === savedLang)) {
      setLang(savedLang);
    }

    const loadedState = loadGame();
    if (loadedState) {
      gameState.current = loadedState;
      setUiState(mapStateToUI(loadedState));
    }

    const uiInterval = setInterval(() => {
      setUiState(mapStateToUI(gameState.current));
      setFps(fpsCounter.fps);
    }, 100);

    const saveInterval = setInterval(() => {
      saveGame(gameState.current);
    }, 10000);

    return () => {
      clearInterval(uiInterval);
      clearInterval(saveInterval);
    };
  }, []);

  // Handlers
  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLang(newLang);
    localStorage.setItem('idleTD_lang', newLang);
  };

  const triggerStateUpdate = useCallback(() => {
    setUiState(mapStateToUI(gameState.current));
  }, []);

  const handleManualSave = () => {
    saveGame(gameState.current);
    alert(t[lang].saveGame + ' OK!');
  };

  const handleResetClick = () => {
    if (gameState.current.wave >= 50 || gameState.current.plant.level >= 50) {
      setShowResetModal(true);
    }
  };

  const confirmReset = () => {
    const { resetGame } = require('./game');
    const success = resetGame(gameState.current);
    if (success) {
      setShowResetModal(false);
      setUiState(mapStateToUI(gameState.current));
      alert(`Prestige Activated! +${formatNumber(gameState.current.energy)} Starting Energy`);
    }
  };

  const handleModalSelect = (optionId: string) => {
    const state = gameState.current;
    if (state.modal.type === 'skillEvolution' && state.modal.skillId) {
      const skillId = state.modal.skillId;
      if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(skillId)) {
        (state.abilities as any)[skillId].evolutions.push(optionId);
      } else if (skillId === 'grass') {
        state.upgrades.grassEvolutions.push(optionId);
      }
    }
    state.modal.isOpen = false;
    state.modal.type = null;
    state.modal.skillId = null;
    state.modal.options = [];
    triggerStateUpdate();
  };

  const handleModalClose = () => {
    const state = gameState.current;
    state.modal.isOpen = false;
    state.modal.type = null;
    state.modal.skillId = null;
    state.modal.options = [];
    triggerStateUpdate();
  };

  const handleSkillInfo = (skillId: string) => {
    const state = gameState.current;
    state.modal.isOpen = true;
    state.modal.type = 'skillInfo';
    state.modal.skillId = skillId;
    triggerStateUpdate();
  };

  const togglePerformance = () => {
    gameState.current.settings.lowPerformance = !gameState.current.settings.lowPerformance;
    triggerStateUpdate();
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans overflow-x-hidden select-none">
      {/* Game Section Wrapper */}
      <div className="h-screen flex flex-col flex-shrink-0">
        {/* Header */}
        <HUD
          energy={uiState.energy}
          wave={uiState.wave}
          playerHealth={uiState.playerHealth}
          plantLevel={uiState.plant.level}
          plantStage={uiState.plant.stage}
          fps={fps}
          lang={lang}
          onLangChange={handleLangChange}
          onSettingsClick={() => setShowSettingsModal(true)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Modals */}
          <SettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            gameState={gameState}
            lowPerformance={uiState.settings.lowPerformance}
            onTogglePerformance={togglePerformance}
            onSave={handleManualSave}
          />

          <ResetModal
            isOpen={showResetModal}
            onClose={() => setShowResetModal(false)}
            onConfirm={confirmReset}
            resets={uiState.resets}
          />

          <EvolutionModal
            isOpen={uiState.modal.isOpen && uiState.modal.type === 'skillEvolution'}
            options={uiState.modal.options}
            onSelect={handleModalSelect}
          />

          <SkillInfoModal
            isOpen={uiState.modal.isOpen && uiState.modal.type === 'skillInfo'}
            skillId={uiState.modal.skillId}
            uiState={uiState}
            lang={lang}
            onClose={handleModalClose}
          />

          {/* Left Side Ad Slot (Desktop) */}
          <AdBanner zone="left_vertical" width={160} height={600} position="left" />

          {/* Game Canvas Area */}
          <GameCanvas
            gameState={gameState}
            lang={lang}
            onStateUpdate={triggerStateUpdate}
          />

          {/* Shop Panel */}
          <Shop
            isOpen={isShopOpen}
            onClose={() => setIsShopOpen(false)}
            onToggle={() => setIsShopOpen(!isShopOpen)}
            gameState={gameState}
            lang={lang}
            buyMultiplier={buyMultiplier}
            onBuyMultiplierChange={setBuyMultiplier}
            onSave={handleManualSave}
            onResetClick={handleResetClick}
            onStateUpdate={triggerStateUpdate}
            onSkillInfo={handleSkillInfo}
            uiState={uiState}
          />
        </main>

        {/* Footer */}
        <Footer lang={lang} />

        {/* Bottom Banner Ad */}
        <AdBanner zone="bottom_banner" width={320} height={50} position="bottom" />
      </div>

      {/* Moringa Info Section */}
      <MoringaInfo />
    </div>
  );
}
