/**
 * useGameLoop Hook
 * Custom hook for managing the game loop and state updates
 */

import { useEffect, useRef, useState, useCallback, MutableRefObject } from 'react';
import { GameState, createInitialState, resetGame } from '../game';
import { saveGame, loadGame } from '../saveSystem';
import { fpsCounter } from '../utils/performance';
import { getAudioSettings, AudioSettings } from '../audio';
import { initGlobalAds } from '../ads/adsterra';
import { Language, languages } from '../i18n';

interface UseGameLoopReturn {
  gameState: MutableRefObject<GameState>;
  fps: number;
  audio: AudioSettings;
  lang: Language;
  setLang: (lang: Language) => void;
  updateAudio: (settings: Partial<AudioSettings>) => void;
  triggerStateUpdate: () => void;
}

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

export function useGameLoop(): UseGameLoopReturn {
  const gameState = useRef<GameState>(createInitialState());
  const [fps, setFps] = useState(0);
  const [audio, setAudio] = useState<AudioSettings>(getAudioSettings());
  const [lang, setLang] = useState<Language>('en');
  const [, forceUpdate] = useState({});

  useEffect(() => {
    initGlobalAds();

    // Load saved language
    const savedLang = localStorage.getItem('idleTD_lang') as Language;
    if (savedLang && languages.some(l => l.code === savedLang)) {
      setLang(savedLang);
    }

    // Load saved game state
    const loadedState = loadGame();
    if (loadedState) {
      gameState.current = loadedState;
    }

    // UI Sync & Auto-save interval
    const uiInterval = setInterval(() => {
      fpsCounter.tick();
      setFps(fpsCounter.fps);
    }, 100);

    const saveInterval = setInterval(() => {
      saveGame(gameState.current);
    }, 10000); // Save every 10 seconds

    return () => {
      clearInterval(uiInterval);
      clearInterval(saveInterval);
    };
  }, []);

  const updateAudio = useCallback((settings: Partial<AudioSettings>) => {
    const newSettings = { ...audio, ...settings };
    setAudio(newSettings);
    const { updateAudioSettings } = require('../audio');
    updateAudioSettings(newSettings);
  }, [audio]);

  const handleLangChange = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('idleTD_lang', newLang);
  }, []);

  const triggerStateUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  return {
    gameState,
    fps,
    audio,
    lang,
    setLang: handleLangChange,
    updateAudio,
    triggerStateUpdate,
  };
}

export { mapStateToUI };
