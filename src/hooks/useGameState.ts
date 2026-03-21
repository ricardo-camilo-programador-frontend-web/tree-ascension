/**
 * useGameState Hook
 * Custom hook for managing UI state and game actions
 */

import { useState, useCallback, useRef, useEffect, MutableRefObject } from 'react';
import { GameState, handleCanvasClick, buyUpgrade, getUpgradeCostTotal, resetGame } from '../game';
import { saveGame, exportSave, importSave, resetSave } from '../saveSystem';
import { t, Language } from '../i18n';

interface UseGameStateProps {
  gameState: MutableRefObject<GameState>;
  lang: Language;
  onStateUpdate: () => void;
}

interface UseGameStateReturn {
  // Modal states
  showResetModal: boolean;
  setShowResetModal: (show: boolean) => void;
  showSettingsModal: boolean;
  setShowSettingsModal: (show: boolean) => void;
  isShopOpen: boolean;
  setIsShopOpen: (open: boolean) => void;

  // Buy multiplier
  buyMultiplier: number | 'MAX';
  setBuyMultiplier: (value: number | 'MAX') => void;

  // UI state
  uiState: any;

  // Actions
  handleManualSave: () => void;
  handleResetClick: () => void;
  confirmReset: () => void;
  handleBuy: (type: string) => void;
  getCostInfo: (type: string, level: number) => { cost: number; count: number };
  handleModalSelect: (optionId: string) => void;
  handleModalClose: () => void;
  handleSkillInfo: (skillId: string) => void;
  togglePerformance: () => void;
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

export function useGameState({
  gameState,
  lang,
  onStateUpdate,
}: UseGameStateProps): UseGameStateReturn {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [buyMultiplier, setBuyMultiplier] = useState<number | 'MAX'>(1);
  const [uiState, setUiState] = useState(() => mapStateToUI(gameState.current));

  // Update UI state
  const updateUIState = useCallback(() => {
    setUiState(mapStateToUI(gameState.current));
  }, [gameState]);

  useEffect(() => {
    updateUIState();
  }, [updateUIState, onStateUpdate]);

  // Actions
  const handleManualSave = useCallback(() => {
    saveGame(gameState.current);
    alert(t[lang].saveGame + ' OK!');
  }, [gameState, lang]);

  const handleResetClick = useCallback(() => {
    if (gameState.current.wave >= 50 || gameState.current.plant.level >= 50) {
      setShowResetModal(true);
    }
  }, [gameState]);

  const confirmReset = useCallback(() => {
    const success = resetGame(gameState.current);
    if (success) {
      setShowResetModal(false);
      updateUIState();
      alert(`Prestige Activated! +${gameState.current.energy} Starting Energy`);
    }
  }, [gameState, updateUIState]);

  const handleBuy = useCallback((type: string) => {
    buyUpgrade(gameState.current, type, buyMultiplier);
    updateUIState();
  }, [gameState, buyMultiplier, updateUIState]);

  const getCostInfo = useCallback((type: string, level: number) => {
    return getUpgradeCostTotal(type, level, uiState, buyMultiplier);
  }, [uiState, buyMultiplier]);

  const handleModalSelect = useCallback((optionId: string) => {
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
    updateUIState();
  }, [gameState, updateUIState]);

  const handleModalClose = useCallback(() => {
    const state = gameState.current;
    state.modal.isOpen = false;
    state.modal.type = null;
    state.modal.skillId = null;
    state.modal.options = [];
    updateUIState();
  }, [gameState, updateUIState]);

  const handleSkillInfo = useCallback((skillId: string) => {
    const state = gameState.current;
    state.modal.isOpen = true;
    state.modal.type = 'skillInfo';
    state.modal.skillId = skillId;
    updateUIState();
  }, [gameState, updateUIState]);

  const togglePerformance = useCallback(() => {
    gameState.current.settings.lowPerformance = !gameState.current.settings.lowPerformance;
    updateUIState();
  }, [gameState, updateUIState]);

  return {
    showResetModal,
    setShowResetModal,
    showSettingsModal,
    setShowSettingsModal,
    isShopOpen,
    setIsShopOpen,
    buyMultiplier,
    setBuyMultiplier,
    uiState,
    handleManualSave,
    handleResetClick,
    confirmReset,
    handleBuy,
    getCostInfo,
    handleModalSelect,
    handleModalClose,
    handleSkillInfo,
    togglePerformance,
  };
}
