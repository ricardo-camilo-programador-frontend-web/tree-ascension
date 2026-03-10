import React, { useEffect, useRef, useState } from 'react';
import { GameState, createInitialState, updateGame, drawGame, handleCanvasClick, buyUpgrade, getUpgradeCostTotal, INTERNAL_W, INTERNAL_H, resetGame } from './game';
import { saveGame, loadGame, exportSave, importSave, resetSave } from './saveSystem';
import { formatNumber } from './utils/number';
import { fpsCounter } from './utils/performance';
import { getAudioSettings, updateAudioSettings, AudioSettings } from './audio';
import MoringaInfo from './components/MoringaInfo';
import { initGlobalAds } from './ads/adsterra';
import AdsterraAd from './components/AdsterraAd';
import { Zap, Sword, Clock, MousePointer2, Sparkles, ShieldAlert, FastForward, Leaf, Sun, Wind, Skull, Save, Download, RotateCcw, Globe, X, ShoppingCart, Settings, Upload, Copy, Check, Monitor, Volume2, VolumeX } from 'lucide-react';
import { t, Language, languages } from './i18n';

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
    alert(t[lang].saveGame + ' OK!');
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
      alert('Save imported successfully!');
    } catch (e) {
      setImportError('Invalid save string');
    }
  };

  const handleHardReset = () => {
    if (confirm('Are you sure? This will wipe your save completely!')) {
      resetSave();
      window.location.reload();
    }
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
      alert(`Prestige Activated! +${formatNumber(gameState.current.energy)} Starting Energy`);
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

      {/* Top Banner Ad */}
      <div className="w-full bg-stone-950 border-b border-stone-800 flex justify-center py-2 hidden md:flex">
        <AdsterraAd zone="top_banner" width={728} height={90} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Settings Modal */}
        {showSettingsModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md" onClick={() => setShowSettingsModal(false)}>
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-4 sticky top-0 bg-stone-900 z-10">
                <h2 className="text-2xl font-black text-stone-200 uppercase tracking-wider">Settings</h2>
                <button onClick={() => setShowSettingsModal(false)} className="text-stone-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Audio Settings */}
                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="font-bold text-stone-300">Audio</div>
                    <button 
                      onClick={toggleMute}
                      className={`p-2 rounded-lg transition-colors ${audio.muted ? 'bg-red-900/50 text-red-400' : 'bg-stone-800 text-stone-400'}`}
                    >
                      {audio.muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-stone-500 font-bold uppercase">
                      <span>Volume</span>
                      <span>{Math.round(audio.volume * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={audio.volume}
                      onChange={handleVolumeChange}
                      className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                </div>

                {/* Performance Mode */}
                <div className="flex items-center justify-between p-4 bg-stone-950 rounded-xl border border-stone-800">
                  <div>
                    <div className="font-bold text-stone-300">Low Performance Mode</div>
                    <div className="text-xs text-stone-500">Reduces visual effects for better performance</div>
                  </div>
                  <button 
                    onClick={togglePerformance}
                    className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
                      uiState.settings?.lowPerformance 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    {uiState.settings?.lowPerformance ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Save Now */}
                <div className="flex items-center justify-between p-4 bg-stone-950 rounded-xl border border-stone-800">
                  <div>
                    <div className="font-bold text-stone-300">Manual Save</div>
                    <div className="text-xs text-stone-500">Save your progress immediately</div>
                  </div>
                  <button 
                    onClick={handleManualSave}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save
                  </button>
                </div>

                {/* Export */}
                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-stone-300">Export Save</div>
                      <div className="text-xs text-stone-500">Get a code to transfer your save</div>
                    </div>
                    <button 
                      onClick={handleExport}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Generate
                    </button>
                  </div>
                  {exportString && (
                    <div className="mt-3 relative">
                      <textarea 
                        readOnly 
                        value={exportString}
                        className="w-full h-24 bg-black border border-stone-700 rounded-lg p-2 text-xs font-mono text-stone-400 resize-none focus:outline-none focus:border-blue-500"
                      />
                      <button 
                        onClick={handleCopyExport}
                        className="absolute top-2 right-2 p-1.5 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copySuccess ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Import */}
                <div className="p-4 bg-stone-950 rounded-xl border border-stone-800">
                  <div className="mb-3">
                    <div className="font-bold text-stone-300">Import Save</div>
                    <div className="text-xs text-stone-500">Paste your save code here</div>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={importString}
                      onChange={(e) => setImportString(e.target.value)}
                      placeholder="Paste save string..."
                      className="flex-1 bg-black border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-emerald-500"
                    />
                    <button 
                      onClick={handleImport}
                      className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg font-bold flex items-center gap-2 border border-stone-700"
                    >
                      <Upload className="w-4 h-4" /> Import
                    </button>
                  </div>
                  {importError && (
                    <div className="mt-2 text-xs text-red-500 font-bold">{importError}</div>
                  )}
                </div>

                {/* Hard Reset */}
                <div className="flex items-center justify-between p-4 bg-red-950/20 rounded-xl border border-red-900/30">
                  <div>
                    <div className="font-bold text-red-400">Hard Reset</div>
                    <div className="text-xs text-red-500/70">Wipe all progress permanently</div>
                  </div>
                  <button 
                    onClick={handleHardReset}
                    className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-800 rounded-lg font-bold flex items-center gap-2"
                  >
                    <Skull className="w-4 h-4" /> Wipe Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reset Modal */}
        {showResetModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all text-center max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 uppercase tracking-widest">
                Prestige Reset
              </h2>
              <p className="text-stone-300 mb-6 text-lg">
                Reset your progress and start again with permanent bonuses.
              </p>
              
              <div className="bg-stone-950 rounded-xl p-4 mb-8 border border-stone-800 space-y-3">
                <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="text-stone-500 font-bold uppercase text-xs tracking-wider">Current Resets</span>
                  <span className="text-xl font-mono font-bold text-white">{uiState.resets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-bold uppercase text-xs tracking-wider">Starting Energy After Reset</span>
                  <span className="text-xl font-mono font-bold text-yellow-400">+{formatNumber((uiState.resets + 1) * 1000)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReset}
                  className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all active:scale-95"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        {uiState.modal.isOpen && uiState.modal.type === 'skillEvolution' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-black text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Skill Evolution!
              </h2>
              <p className="text-stone-400 text-center text-sm mb-6">
                Choose an upgrade path for your skill.
              </p>
              <div className="flex flex-col gap-3">
                {uiState.modal.options.map((opt: any) => (
                  <button
                    key={opt.id}
                    onClick={() => handleModalSelect(opt.id)}
                    className="p-4 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-emerald-500 rounded-xl text-left transition-all group"
                  >
                    <div className="font-bold text-emerald-400 group-hover:text-emerald-300 mb-1">{opt.name}</div>
                    <div className="text-xs text-stone-400 group-hover:text-stone-300">{opt.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {uiState.modal.isOpen && uiState.modal.type === 'skillInfo' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => handleModalClose()}>
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4 sticky top-0 bg-stone-900 z-10 pb-2">
                <h2 className="text-2xl font-black text-emerald-400">
                  {getSkillName(uiState.modal.skillId)}
                </h2>
                <button onClick={() => handleModalClose()} className="text-stone-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 text-stone-300">
                <div className="flex justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-500">Level</span>
                  <span className="font-bold">{getSkillLevel(uiState.modal.skillId)}</span>
                </div>
                
                <div className="flex justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-500">Effect</span>
                  <span className="font-bold">{getSkillEffect(uiState.modal.skillId)}</span>
                </div>
                
                <div className="flex justify-between border-b border-stone-800 pb-2">
                  <span className="text-stone-500">Cooldown</span>
                  <span className="font-bold">{getSkillCooldown(uiState.modal.skillId)}s</span>
                </div>
                
                <div>
                  <h3 className="text-stone-500 mb-1">Description</h3>
                  <p className="text-sm">{getSkillDescription(uiState.modal.skillId)}</p>
                </div>
                
                {getSkillEvolutions(uiState.modal.skillId).length > 0 && (
                  <div>
                    <h3 className="text-stone-500 mb-1">Unlocked Evolutions</h3>
                    <ul className="list-disc list-inside text-sm text-emerald-300">
                      {getSkillEvolutions(uiState.modal.skillId).map((evo: string) => (
                        <li key={evo}>{formatEvolutionName(evo)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
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

      {/* Bottom Banner Ad */}
      <div className="w-full bg-stone-950 border-t border-stone-900 flex justify-center py-2">
        <AdsterraAd zone="bottom_banner" width={320} height={50} lazy />
      </div>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-900 p-2 text-center text-[10px] text-stone-600">
        {t[lang].developedBy} <a href="https://github.com/ricardo-camilo-programador-frontend-web" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Ricardo Camilo</a>
      </footer>
      </div>

      {/* Moringa Info Section */}
      <MoringaInfo />
    </div>
  );
}

function UpgradeButton({ icon, title, level, cost, count, canAfford, onClick, onIconClick, formatNumber, lang, colorClass }: any) {
  return (
    <div
      className={`relative w-full flex flex-col p-4 rounded-2xl border transition-all duration-200 text-left overflow-hidden group ${
        canAfford
          ? 'bg-stone-800/50 border-stone-700 hover:bg-stone-700/80 hover:border-stone-500 shadow-lg'
          : 'bg-stone-900/30 border-stone-800 opacity-50'
      }`}
    >
      {/* Background Gradient */}
      {canAfford && (
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      )}

      {/* Line 1: Icon + Name */}
      <div className="flex items-center gap-3 relative z-10 mb-2">
        <div 
          className={`p-2 bg-stone-950 rounded-xl border border-stone-800 transition-all shadow-inner ${onIconClick ? 'cursor-pointer hover:bg-stone-800 hover:border-stone-600 hover:scale-110' : ''}`}
          onClick={(e) => {
            if (onIconClick) {
              e.stopPropagation();
              onIconClick();
            }
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' })}
        </div>
        <div className="font-bold text-stone-100 text-base leading-tight group-hover:text-white transition-colors">{title}</div>
      </div>
      
      {/* Line 2: Level */}
      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest relative z-10 mb-3 ml-1">
        {t[lang].level} {level}
      </div>

      {/* Line 3: Upgrade Button */}
      <button
        onClick={onClick}
        disabled={!canAfford}
        className={`relative z-10 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border font-bold transition-all active:scale-[0.98] ${
          canAfford 
            ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-400/50' 
            : 'bg-stone-900/50 border-stone-800 text-stone-500 cursor-not-allowed'
        }`}
      >
        <span className="text-sm uppercase tracking-wider">{t[lang].upgrades} {count > 1 ? `x${count}` : ''}</span>
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-lg border border-black/50">
          <Zap className={`w-3.5 h-3.5 ${canAfford ? 'text-yellow-400 fill-yellow-400/20' : 'text-stone-600'}`} />
          <span className={`font-mono font-black text-sm ${canAfford ? 'text-yellow-400' : 'text-stone-500'}`}>
            {formatNumber(cost)}
          </span>
        </div>
      </button>
    </div>
  );
}

function AbilityButton({ icon, title, ability, cost, count, canAfford, onClick, onIconClick, formatNumber, lang, colorClass }: any) {
  const isUnlocked = ability.level > 0;
  const cooldownPercent = isUnlocked ? Math.max(0, (ability.cooldown / ability.maxCooldown) * 100) : 0;

  return (
    <div
      className={`relative w-full flex flex-col p-4 rounded-2xl border transition-all duration-200 text-left overflow-hidden group ${
        canAfford
          ? 'bg-stone-800/50 border-stone-700 hover:bg-stone-700/80 hover:border-stone-500 shadow-lg'
          : 'bg-stone-900/30 border-stone-800 opacity-50'
      }`}
    >
      {/* Background Gradient */}
      {canAfford && (
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      )}

      {/* Cooldown overlay */}
      {isUnlocked && ability.cooldown > 0 && (
        <div 
          className="absolute inset-0 bg-emerald-500/10 z-0 transition-all duration-100 ease-linear pointer-events-none" 
          style={{ width: `${cooldownPercent}%` }}
        />
      )}
      
      {/* Line 1: Icon + Name */}
      <div className="flex items-center gap-3 relative z-10 mb-2">
        <div 
          className={`p-2 rounded-xl border transition-all shadow-inner ${isUnlocked ? 'bg-stone-900 border-stone-700' : 'bg-stone-950 border-stone-800 grayscale opacity-50'} ${onIconClick ? 'cursor-pointer hover:bg-stone-800 hover:border-stone-600 hover:scale-110' : ''}`}
          onClick={(e) => {
            if (onIconClick) {
              e.stopPropagation();
              onIconClick();
            }
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' })}
        </div>
        <div className="font-bold text-stone-100 text-base leading-tight group-hover:text-white transition-colors">{title}</div>
      </div>
      
      {/* Line 2: Level */}
      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest relative z-10 mb-3 ml-1">
        {isUnlocked ? `${t[lang].level} ${ability.level}` : 'Locked'}
      </div>
      
      {/* Line 3: Upgrade Button */}
      <button
        onClick={onClick}
        disabled={!canAfford}
        className={`relative z-10 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border font-bold transition-all active:scale-[0.98] ${
          canAfford 
            ? 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-400/50' 
            : 'bg-stone-900/50 border-stone-800 text-stone-500 cursor-not-allowed'
        }`}
      >
        <span className="text-sm uppercase tracking-wider">{isUnlocked ? t[lang].upgrades : 'Unlock'} {count > 1 ? `x${count}` : ''}</span>
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded-lg border border-black/50">
          <Zap className={`w-3.5 h-3.5 ${canAfford ? 'text-yellow-400 fill-yellow-400/20' : 'text-stone-600'}`} />
          <span className={`font-mono font-black text-sm ${canAfford ? 'text-yellow-400' : 'text-stone-500'}`}>
            {formatNumber(cost)}
          </span>
        </div>
      </button>
    </div>
  );
}
