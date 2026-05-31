import React, { useEffect, useRef, useState } from 'react';
import { GameState, createInitialState, updateGame, drawGame, handleCanvasClick, buyUpgrade, getUpgradeCostTotal, INTERNAL_W, INTERNAL_H, resetGame } from './game';
import { saveGame, loadGame, exportSave, importSave, resetSave } from './saveSystem';
import { formatNumber } from './utils/number';
import { fpsCounter } from './utils/performance';
import { getAudioSettings, updateAudioSettings, AudioSettings } from './audio';
import MoringaInfo from './components/MoringaInfo';
import { initGlobalAds } from './ads/adsterra';
import AdsterraAd from './components/AdsterraAd';
import { Zap, Sword, Clock, MousePointer2, Sparkles, ShieldAlert, FastForward, Leaf, Sun, Wind, Skull, Save, Download, RotateCcw, Globe, X, ShoppingCart, Settings, Trophy } from 'lucide-react';
import { t, Language, languages } from './i18n';
import UpgradeButton from './components/UpgradeButton';
import AbilityButton from './components/AbilityButton';
import SettingsModal from './components/SettingsModal';
import ResetModal from './components/ResetModal';
import SkillEvolutionModal from './components/SkillEvolutionModal';
import SkillInfoModal from './components/SkillInfoModal';
import { ToastContainer, showToast } from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import ProgressPanel from './components/ProgressPanel';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lang, setLang] = useState<Language>('en');
  const gameState = useRef<GameState>(createInitialState());
  const [uiState, setUiState] = useState(() => mapStateToUI(gameState.current));
  const [fps, setFps] = useState(0);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [buyMultiplier, setBuyMultiplier] = useState<number | 'MAX'>(1);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [exportString, setExportString] = useState('');
  const [importString, setImportString] = useState('');
  const [importError, setImportError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [audio, setAudio] = useState<AudioSettings>(getAudioSettings());
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void; confirmText?: string; cancelText?: string; destructive?: boolean; lang: Language }>({ open: false, title: '', message: '', onConfirm: () => {}, onCancel: () => {} });
  const [showProgressPanel, setShowProgressPanel] = useState(false);
  const startTimeRef = useRef(Date.now());
  const totalPlayTime = (Date.now() - startTimeRef.current) / 1000;

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

    // Initialize audio settings from localStorage
    const savedAudio = getAudioSettings();
    setAudio(savedAudio);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      fpsCounter.tick();
      // updateGame handles dt internally using Date.now() for background progression
      updateGame(gameState.current, 0);
      drawGame(ctx, canvas.width, canvas.height, gameState.current);

      animationFrameId = requestAnimationFrame(render);
    };
    render(performance.now());

    // UI Sync & Auto-save interval
    const uiInterval = setInterval(() => {
      setUiState(mapStateToUI(gameState.current));
      setFps(fpsCounter.fps);
    }, 100);

    const saveInterval = setInterval(() => {
      saveGame(gameState.current);
    }, 10000); // Save every 10 seconds

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(uiInterval);
      clearInterval(saveInterval);
    };
  }, []);

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLang(newLang);
    localStorage.setItem('idleTD_lang', newLang);
  };

  const handleCanvasClickEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    handleCanvasClick(gameState.current, x, y, canvas.width, canvas.height);
    setUiState(mapStateToUI(gameState.current));
  };

  const handleBuy = (type: string) => {
    buyUpgrade(gameState.current, type, buyMultiplier);
    setUiState(mapStateToUI(gameState.current));
  };

  const getCostInfo = (type: string, level: number) => {
    return getUpgradeCostTotal(type, level, uiState, buyMultiplier);
  };

  const handleManualSave = () => {
    saveGame(gameState.current);
    showToast(t[lang].saveSuccess, 'success');
  };

  const handleExport = () => {
    const str = exportSave(gameState.current);
    setExportString(str);
    setCopySuccess(false);
  };

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportString);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleImport = () => {
    if (!importString) return;
    try {
      const newState = importSave(importString);
      gameState.current = newState;
      setUiState(mapStateToUI(newState));
      saveGame(newState);
      setImportString('');
      setImportError('');
      setShowSettingsModal(false);
      showToast(t[lang].saveImported, 'success');
    } catch (e) {
      setImportError(t[lang].invalidSaveString);
    }
  };

  const handleHardReset = () => {
    setConfirmModal({
      open: true,
      title: t[lang].hardReset,
      message: t[lang].hardResetMessage,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        resetSave();
        window.location.reload();
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, open: false })),
      confirmText: t[lang].wipeSave,
      cancelText: t[lang].cancel,
      destructive: true,
      lang: lang,
    });
  };

  const handleResetClick = () => {
    if (gameState.current.wave >= 50 || gameState.current.plant.level >= 50) {
      setShowResetModal(true);
    }
  };

  const confirmReset = () => {
    const success = resetGame(gameState.current);
    if (success) {
      setShowResetModal(false);
      setUiState(mapStateToUI(gameState.current));
      showToast(`${t[lang].prestigeActivated} +${formatNumber(gameState.current.energy)} ${t[lang].startingEnergy}`, 'info');
    }
  };

  const handleModalSelect = (optionId: string) => {
    const state = gameState.current;
    if (state.modal.type === 'skillEvolution' && state.modal.skillId) {
      const skillId = state.modal.skillId;
      if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(skillId)) {
        state.abilities[skillId as keyof typeof state.abilities].evolutions.push(optionId);
      } else if (skillId === 'grass') {
        state.upgrades.grassEvolutions.push(optionId);
      }
    }
    state.modal.isOpen = false;
    state.modal.type = null;
    state.modal.skillId = null;
    state.modal.options = [];
    setUiState(mapStateToUI(state));
  };

  const handleModalClose = () => {
    const state = gameState.current;
    state.modal.isOpen = false;
    state.modal.type = null;
    state.modal.skillId = null;
    state.modal.options = [];
    setUiState(mapStateToUI(state));
  };

  const handleSkillInfo = (skillId: string) => {
    const state = gameState.current;
    state.modal.isOpen = true;
    state.modal.type = 'skillInfo';
    state.modal.skillId = skillId;
    setUiState(mapStateToUI(state));
  };

  const getSkillName = (id: string | null) => {
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

  const getSkillLevel = (id: string | null) => {
    if (!id) return 0;
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(id)) {
      return uiState.abilities[id as keyof typeof uiState.abilities].level;
    } else if (id === 'grass') {
      return uiState.upgrades.grassLevel;
    } else if (['damage', 'speed', 'click', 'energy', 'evolutionSpeed'].includes(id)) {
      return (uiState.upgrades as any)[id + 'Level'];
    }
    return 0;
  };

  const getSkillEffect = (id: string | null) => {
    if (!id) return '';
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

  const getSkillCooldown = (id: string | null) => {
    if (!id) return 0;
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(id)) {
      const ability = uiState.abilities[id as keyof typeof uiState.abilities];
      if (ability.maxCooldown === 0) return 0;
      // Approximate reduction logic from game.ts
      const reduction = 1 - (0.5 * (1 - Math.exp(-0.01 * ability.level)));
      return Math.max(1, ability.maxCooldown * reduction).toFixed(1);
    }
    return 0;
  };

  const getSkillDescription = (id: string | null) => {
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

  const getSkillEvolutions = (id: string | null) => {
    if (!id) return [];
    if (['sunBurst', 'rootEntangle', 'poisonCloud', 'solGenerator'].includes(id)) {
      return uiState.abilities[id as keyof typeof uiState.abilities].evolutions;
    } else if (id === 'grass') {
      return uiState.upgrades.grassEvolutions;
    }
    return [];
  };

  const formatEvolutionName = (id: string) => {
    return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const totalEvolutions = (uiState.plant.level - 1) * 5 + (uiState.plant.stage - 1);
  const requiredProgress = 100 * Math.pow(1.2, totalEvolutions);
  const evoPercent = Math.max(0, Math.min(100, (uiState.plant.evolutionProgress / requiredProgress) * 100));

  const togglePerformance = () => {
    gameState.current.settings.lowPerformance = !gameState.current.settings.lowPerformance;
    setUiState(mapStateToUI(gameState.current));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    const newSettings = { ...audio, volume };
    setAudio(newSettings);
    updateAudioSettings(newSettings);
  };

  const toggleMute = () => {
    const newSettings = { ...audio, muted: !audio.muted };
    setAudio(newSettings);
    updateAudioSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans overflow-x-hidden select-none">
      {/* Game Section Wrapper */}
      <div className="h-screen flex flex-col flex-shrink-0">
        {/* Header */}
        <header className="bg-stone-900 border-b border-stone-800 p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 bg-stone-950 px-3 md:px-4 py-1.5 rounded-full border border-stone-800">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-mono text-lg md:text-xl font-bold text-yellow-400">{formatNumber(uiState.energy)}</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-xs text-stone-500 font-mono">
            <span>FPS:</span>
            <span className={fps < 30 ? 'text-red-500' : 'text-emerald-500'}>{fps}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-center hidden xs:block">
            <div className="text-[9px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">{t[lang].wave}</div>
            <div className="text-base md:text-xl font-black text-stone-200">{uiState.wave}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">HP</div>
            <div className="text-base md:text-xl font-black text-red-500">
              {formatNumber(uiState.playerHealth)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-[9px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">{t[lang].plantLevel}</div>
            <div className="text-base md:text-xl font-black text-emerald-400">{uiState.plant.level}-{uiState.plant.stage}</div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
             <button 
               onClick={() => setShowSettingsModal(true)}
               className="p-1.5 md:p-2 bg-stone-800 rounded hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
             >
               <Settings className="w-4 h-4 md:w-5 md:h-5" />
             </button>
             <button
               onClick={() => setShowProgressPanel(true)}
               className="p-1.5 md:p-2 bg-stone-800 rounded hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
               title={t[lang].progressBtn || 'Progress'}
             >
               <Trophy className="w-4 h-4 md:w-5 md:h-5" />
             </button>
             <Globe className="w-3 h-3 md:w-4 md:h-4 text-stone-400 ml-2" />
             <select 
               value={lang} 
               onChange={handleLangChange}
               className="bg-stone-800 text-stone-200 text-[10px] md:text-xs rounded p-1 border border-stone-700 outline-none max-w-[60px] md:max-w-none"
             >
               {languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
             </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Settings Modal */}
        {showSettingsModal && (
        <SettingsModal
        audio={audio}
        onToggleMute={toggleMute}
        onVolumeChange={handleVolumeChange}
        lowPerformance={!!uiState.settings?.lowPerformance}
        onTogglePerformance={togglePerformance}
        onManualSave={handleManualSave}
        onExport={handleExport}
        exportString={exportString}
        onCopyExport={handleCopyExport}
        copySuccess={copySuccess}
        importString={importString}
        onImportStringChange={setImportString}
        onImport={handleImport}
        importError={importError}
        onHardReset={handleHardReset}
        onClose={() => setShowSettingsModal(false)}
        lang={lang}
        />
        )}

        {/* Reset Modal */}
        {showResetModal && (
        <ResetModal
        resets={uiState.resets}
        onCancel={() => setShowResetModal(false)}
        onConfirm={confirmReset}
        lang={lang}
        />
        )}

        {/* Modal Overlay */}
        {uiState.modal.isOpen && uiState.modal.type === 'skillEvolution' && (
        <SkillEvolutionModal
        options={uiState.modal.options}
        onSelect={handleModalSelect}
        lang={lang}
        />
        )}

        {uiState.modal.isOpen && uiState.modal.type === 'skillInfo' && (
        <SkillInfoModal
        skillId={uiState.modal.skillId}
        onClose={handleModalClose}
        getSkillName={getSkillName}
        getSkillLevel={getSkillLevel}
        getSkillEffect={getSkillEffect}
        getSkillCooldown={getSkillCooldown}
        getSkillDescription={getSkillDescription}
        getSkillEvolutions={getSkillEvolutions}
        formatEvolutionName={formatEvolutionName}
        lang={lang}
        />
        )}

        {/* Left Side Ad Slot (Desktop) */}
        <div className="hidden lg:block w-32 bg-stone-900 border-r border-stone-800 p-2 flex-shrink-0">
           <div className="w-full h-full bg-stone-950/50 rounded flex items-center justify-center text-stone-700 text-xs text-center border border-dashed border-stone-800">
             Ad Slot<br/>Vertical
           </div>
        </div>

        {/* Game Canvas Area */}
        <div className="flex-1 relative bg-stone-950 overflow-hidden cursor-crosshair flex flex-col">
          
          {/* Top Ad Slot (Mobile/Tablet) */}
          <div className="lg:hidden w-full h-16 bg-stone-900 border-b border-stone-800 flex items-center justify-center text-stone-700 text-xs border-dashed">
             Ad Slot Horizontal
          </div>

          <div className="flex-1 relative w-full h-full">
            {/* Falling Leaves Background Effect (CSS only) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute animate-fall"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-${Math.random() * 20 + 10}%`,
                    animationDuration: `${Math.random() * 5 + 5}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    fontSize: `${Math.random() * 10 + 10}px`
                  }}
                >
                  🍃
                </div>
              ))}
            </div>

            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full block"
              onClick={handleCanvasClickEvent}
            />
            
            {uiState.waveState.isBoss && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-6 py-2 rounded-full animate-pulse pointer-events-none">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                <span className="text-red-500 font-black tracking-widest uppercase">{t[lang].bossWave}</span>
              </div>
            )}
            
            {/* Evolution Progress Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 md:w-96 bg-stone-900/80 backdrop-blur-sm border border-stone-800 p-3 rounded-2xl shadow-2xl pointer-events-none">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-400" /> {t[lang].autoEvolution}
                </span>
                <span className="text-xs font-mono text-blue-400">{evoPercent.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-100 ease-linear"
                  style={{ width: `${evoPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Shop Button */}
        <button 
          onClick={() => setIsShopOpen(true)}
          className="lg:hidden absolute bottom-24 right-4 z-30 bg-emerald-600 text-white flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl active:scale-95 transition-transform border border-emerald-400/30 backdrop-blur-md"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-wider">Shop</span>
        </button>

        {/* Upgrades Panel (Desktop) / Modal (Mobile) */}
        <div className={`
          ${isShopOpen ? 'fixed inset-0 z-40 bg-black/60 backdrop-blur-md flex items-center justify-center p-4' : 'hidden'} 
          lg:flex lg:static lg:w-96 lg:bg-stone-900 lg:border-l lg:border-stone-800 lg:flex-col lg:shadow-2xl lg:z-10 lg:flex-shrink-0
        `} onClick={() => setIsShopOpen(false)}>
          <div 
            className={`
              ${isShopOpen ? 'bg-stone-900 border border-stone-700 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl' : 'flex flex-col h-full w-full'}
            `}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-stone-800 bg-stone-900/50 flex justify-between items-center">
              <h2 className="text-lg font-black tracking-tight text-stone-300">{t[lang].upgrades}</h2>
              <div className="flex gap-2">
                <button onClick={handleManualSave} className="p-2 bg-stone-800 rounded-lg hover:bg-stone-700 text-stone-400 transition-colors" title={t[lang].saveGame}>
                  <Save className="w-4 h-4" />
                </button>
                <div className="relative group">
                  <button 
                    onClick={handleResetClick} 
                    disabled={uiState.wave < 50 && uiState.plant.level < 50}
                    className={`p-2 rounded-lg transition-colors ${
                      uiState.wave >= 50 || uiState.plant.level >= 50
                        ? 'bg-stone-800 hover:bg-red-900/50 text-stone-400 hover:text-red-400' 
                        : 'bg-stone-900 text-stone-700 cursor-not-allowed'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  {uiState.wave < 50 && uiState.plant.level < 50 && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-black text-xs text-stone-400 p-2 rounded border border-stone-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                      Reset unlocks after Wave 50 or Plant Level 50
                    </div>
                  )}
                </div>
                <button onClick={() => setIsShopOpen(false)} className="lg:hidden p-2 bg-stone-800 rounded-lg hover:bg-stone-700 text-stone-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Buy Multiplier Toggle */}
              <div className="flex bg-stone-950 rounded-xl p-1 border border-stone-800">
                {(['1', '10', 'MAX'] as const).map(mult => (
                  <button
                    key={mult}
                    onClick={() => setBuyMultiplier(mult === 'MAX' ? 'MAX' : parseInt(mult))}
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
                      onIconClick={() => handleSkillInfo('damage')}
                      formatNumber={formatNumber}
                      lang={lang}
                      colorClass="from-red-500/20 to-orange-500/20"
                    />
                  );
                })()}
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
                      onIconClick={() => handleSkillInfo('speed')}
                      formatNumber={formatNumber}
                      lang={lang}
                      colorClass="from-emerald-500/20 to-teal-500/20"
                    />
                  );
                })()}
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
                      onIconClick={() => handleSkillInfo('click')}
                      formatNumber={formatNumber}
                      lang={lang}
                      colorClass="from-blue-500/20 to-indigo-500/20"
                    />
                  );
                })()}
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
                      onIconClick={() => handleSkillInfo('energy')}
                      formatNumber={formatNumber}
                      lang={lang}
                      colorClass="from-yellow-500/20 to-amber-500/20"
                    />
                  );
                })()}
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
                      onIconClick={() => handleSkillInfo('evolutionSpeed')}
                      formatNumber={formatNumber}
                      lang={lang}
                      colorClass="from-cyan-500/20 to-blue-500/20"
                    />
                  );
                })()}
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
                      onIconClick={() => handleSkillInfo('grass')}
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
                        onIconClick={() => handleSkillInfo('sunBurst')}
                        formatNumber={formatNumber}
                        lang={lang}
                        colorClass="from-yellow-400/30 to-orange-500/30"
                      />
                    );
                  })()}
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
                        onIconClick={() => handleSkillInfo('rootEntangle')}
                        formatNumber={formatNumber}
                        lang={lang}
                        colorClass="from-emerald-400/30 to-teal-500/30"
                      />
                    );
                  })()}
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
                        onIconClick={() => handleSkillInfo('poisonCloud')}
                        formatNumber={formatNumber}
                        lang={lang}
                        colorClass="from-purple-500/30 to-fuchsia-600/30"
                      />
                    );
                  })()}
                  {(() => {
                    if (uiState.plant.level < 500) return null;
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
                        onIconClick={() => handleSkillInfo('solGenerator')}
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
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-900 p-2 text-center text-[10px] text-stone-600">
        {t[lang].developedBy} <a href="https://github.com/ricardo-camilo-programador-frontend-web" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Ricardo Camilo</a>
      </footer>

      {/* Bottom Banner Ad */}
      <div className="w-full bg-stone-950 border-t border-stone-900 flex justify-center py-2">
        <AdsterraAd zone="bottom_banner" width={320} height={50} lazy />
      </div>
      </div>

      {/* Moringa Info Section */}
      <MoringaInfo lang={lang} />

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Progress Panel */}
      {showProgressPanel && (
        <ProgressPanel
          lang={lang}
          uiState={uiState}
          totalPlayTime={totalPlayTime}
          onClose={() => setShowProgressPanel(false)}
        />
      )}

      {/* Hard Reset Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        destructive={confirmModal.destructive}
        lang={confirmModal.lang}
      />
      </div>
      );
}
