import React, { useEffect, useRef, useState } from 'react';
import { GameState, createInitialState, updateGame, drawGame, handleCanvasClick, buyUpgrade, getUpgradeCost, INTERNAL_W, INTERNAL_H, saveGame, loadGame, formatNumber } from './game';
import { Zap, Sword, Clock, MousePointer2, Sparkles, ShieldAlert, FastForward, Leaf, Sun, Wind, Skull, Save, Download, RotateCcw, Globe, X, ShoppingCart } from 'lucide-react';
import { t, Language, languages } from './i18n';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lang, setLang] = useState<Language>('en');
  const gameState = useRef<GameState>(createInitialState());
  const [uiState, setUiState] = useState(() => JSON.parse(JSON.stringify(gameState.current)));
  const [isShopOpen, setIsShopOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('idleTD_lang') as Language;
    if (savedLang && languages.some(l => l.code === savedLang)) {
      setLang(savedLang);
    }
    
    const loadedState = loadGame();
    if (loadedState) {
      gameState.current = loadedState;
      setUiState(JSON.parse(JSON.stringify(loadedState)));
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
      // updateGame handles dt internally using Date.now() for background progression
      updateGame(gameState.current, 0);
      drawGame(ctx, canvas.width, canvas.height, gameState.current);

      animationFrameId = requestAnimationFrame(render);
    };
    render(performance.now());

    // UI Sync & Auto-save interval
    const uiInterval = setInterval(() => {
      setUiState(JSON.parse(JSON.stringify(gameState.current)));
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
    setUiState(JSON.parse(JSON.stringify(gameState.current)));
  };

  const handleBuy = (type: string) => {
    buyUpgrade(gameState.current, type);
    setUiState(JSON.parse(JSON.stringify(gameState.current)));
  };

  const handleManualSave = () => {
    saveGame(gameState.current);
    alert(t[lang].saveGame + ' OK!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      localStorage.removeItem('idleTD_save');
      gameState.current = createInitialState();
      setUiState(JSON.parse(JSON.stringify(gameState.current)));
    }
  };

  const handleModalSelect = (optionId: string) => {
    const state = gameState.current;
    if (state.modal.type === 'skillEvolution' && state.modal.skillId) {
      const skillId = state.modal.skillId;
      if (['sunBurst', 'rootEntangle', 'poisonCloud'].includes(skillId)) {
        state.abilities[skillId as keyof typeof state.abilities].evolutions.push(optionId);
      } else if (skillId === 'grass') {
        state.abilities.sunBurst.evolutions.push(optionId);
      }
    }
    state.modal.isOpen = false;
    state.modal.type = null;
    state.modal.skillId = null;
    state.modal.options = [];
    setUiState(JSON.parse(JSON.stringify(state)));
  };

  const handleModalClose = () => {
    const state = gameState.current;
    state.modal.isOpen = false;
    state.modal.type = null;
    state.modal.skillId = null;
    state.modal.options = [];
    setUiState(JSON.parse(JSON.stringify(state)));
  };

  const handleSkillInfo = (skillId: string) => {
    const state = gameState.current;
    state.modal.isOpen = true;
    state.modal.type = 'skillInfo';
    state.modal.skillId = skillId;
    setUiState(JSON.parse(JSON.stringify(state)));
  };

  const getSkillName = (id: string | null) => {
    switch (id) {
      case 'sunBurst': return 'Sun Burst';
      case 'rootEntangle': return 'Root Entangle';
      case 'poisonCloud': return 'Poison Cloud';
      case 'grass': return 'Sharp Grass';
      default: return 'Unknown Skill';
    }
  };

  const getSkillLevel = (id: string | null) => {
    if (!id) return 0;
    if (['sunBurst', 'rootEntangle', 'poisonCloud'].includes(id)) {
      return uiState.abilities[id as keyof typeof uiState.abilities].level;
    } else if (id === 'grass') {
      return uiState.upgrades.grassLevel;
    }
    return 0;
  };

  const getSkillEffect = (id: string | null) => {
    if (!id) return '';
    if (id === 'sunBurst') {
      const dmg = uiState.plant.baseDamage * uiState.plant.damageMultiplier * 5 * uiState.abilities.sunBurst.level;
      return `${formatNumber(dmg)} Damage`;
    } else if (id === 'rootEntangle') {
      return '50% Slow for 5s';
    } else if (id === 'poisonCloud') {
      const dmg = uiState.plant.baseDamage * uiState.plant.damageMultiplier * 0.5 * uiState.abilities.poisonCloud.level;
      return `${formatNumber(dmg * 5)} Total Damage`;
    } else if (id === 'grass') {
      const dmg = 5 * Math.pow(1.2, uiState.upgrades.grassLevel);
      return `${formatNumber(dmg)} DPS`;
    }
    return '';
  };

  const getSkillCooldown = (id: string | null) => {
    if (!id) return 0;
    if (['sunBurst', 'rootEntangle', 'poisonCloud'].includes(id)) {
      const ability = uiState.abilities[id as keyof typeof uiState.abilities];
      // We don't have getCooldownForLevel exported directly to UI easily without duplicating logic, 
      // but we can approximate or just show maxCooldown for now.
      return ability.maxCooldown.toFixed(1);
    }
    return 0;
  };

  const getSkillDescription = (id: string | null) => {
    switch (id) {
      case 'sunBurst': return 'Unleashes a burst of solar energy damaging all enemies on screen.';
      case 'rootEntangle': return 'Vines erupt from the ground slowing all enemies.';
      case 'poisonCloud': return 'Releases a toxic cloud dealing damage over time to all enemies.';
      case 'grass': return 'Sharp grass covers the ground dealing continuous damage to walking enemies.';
      default: return '';
    }
  };

  const getSkillEvolutions = (id: string | null) => {
    if (!id) return [];
    if (['sunBurst', 'rootEntangle', 'poisonCloud'].includes(id)) {
      return uiState.abilities[id as keyof typeof uiState.abilities].evolutions;
    } else if (id === 'grass') {
      // Hacky way we stored grass evolutions
      return uiState.abilities.sunBurst.evolutions.filter((e: string) => ['poison_grass', 'faster_ticks', 'slow_thorns'].includes(e));
    }
    return [];
  };

  const formatEvolutionName = (id: string) => {
    return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const totalEvolutions = (uiState.plant.level - 1) * 5 + (uiState.plant.stage - 1);
  const requiredProgress = 100 * Math.pow(1.2, totalEvolutions);
  const evoPercent = Math.max(0, Math.min(100, (uiState.plant.evolutionProgress / requiredProgress) * 100));

  return (
    <div className="h-screen w-screen bg-stone-950 text-stone-100 flex flex-col font-sans overflow-hidden select-none">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-800 p-4 flex justify-between items-center shadow-md z-10">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2 bg-stone-950 px-3 md:px-4 py-1.5 rounded-full border border-stone-800">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-mono text-lg md:text-xl font-bold text-yellow-400">{formatNumber(uiState.energy)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="text-center hidden xs:block">
            <div className="text-[9px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">{t[lang].wave}</div>
            <div className="text-base md:text-xl font-black text-stone-200">{uiState.wave}</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">{t[lang].plantLevel}</div>
            <div className="text-base md:text-xl font-black text-emerald-400">{uiState.plant.level}-{uiState.plant.stage}</div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
             <Globe className="w-3 h-3 md:w-4 md:h-4 text-stone-400" />
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
        
        {/* Modal Overlay */}
        {uiState.modal.isOpen && uiState.modal.type === 'skillEvolution' && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all">
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
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
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
                <button onClick={handleReset} className="p-2 bg-stone-800 rounded-lg hover:bg-red-900/50 text-stone-400 hover:text-red-400 transition-colors" title={t[lang].resetGame}>
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={() => setIsShopOpen(false)} className="lg:hidden p-2 bg-stone-800 rounded-lg hover:bg-stone-700 text-stone-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Basic Upgrades */}
              <div className="grid grid-cols-1 gap-3">
                <UpgradeButton
                  icon={<Sword className="w-6 h-6 text-red-400" />}
                  title={t[lang].damage}
                  level={uiState.upgrades.damageLevel}
                  cost={getUpgradeCost('damage', uiState.upgrades.damageLevel, uiState)}
                  canAfford={uiState.energy >= getUpgradeCost('damage', uiState.upgrades.damageLevel, uiState)}
                  onClick={() => handleBuy('damage')}
                  onIconClick={() => handleSkillInfo('damage')}
                  formatNumber={formatNumber}
                  lang={lang}
                  colorClass="from-red-500/20 to-orange-500/20"
                />
                <UpgradeButton
                  icon={<Clock className="w-6 h-6 text-emerald-400" />}
                  title={t[lang].attackSpeed}
                  level={uiState.upgrades.speedLevel}
                  cost={getUpgradeCost('speed', uiState.upgrades.speedLevel, uiState)}
                  canAfford={uiState.energy >= getUpgradeCost('speed', uiState.upgrades.speedLevel, uiState)}
                  onClick={() => handleBuy('speed')}
                  onIconClick={() => handleSkillInfo('speed')}
                  formatNumber={formatNumber}
                  lang={lang}
                  colorClass="from-emerald-500/20 to-teal-500/20"
                />
                <UpgradeButton
                  icon={<MousePointer2 className="w-6 h-6 text-purple-400" />}
                  title={t[lang].clickDamage}
                  level={uiState.upgrades.clickLevel}
                  cost={getUpgradeCost('click', uiState.upgrades.clickLevel, uiState)}
                  canAfford={uiState.energy >= getUpgradeCost('click', uiState.upgrades.clickLevel, uiState)}
                  onClick={() => handleBuy('click')}
                  onIconClick={() => handleSkillInfo('click')}
                  formatNumber={formatNumber}
                  lang={lang}
                  colorClass="from-purple-500/20 to-fuchsia-500/20"
                />
                <UpgradeButton
                  icon={<Zap className="w-6 h-6 text-yellow-400" />}
                  title={t[lang].energyMultiplier}
                  level={uiState.upgrades.energyLevel}
                  cost={getUpgradeCost('energy', uiState.upgrades.energyLevel, uiState)}
                  canAfford={uiState.energy >= getUpgradeCost('energy', uiState.upgrades.energyLevel, uiState)}
                  onClick={() => handleBuy('energy')}
                  onIconClick={() => handleSkillInfo('energy')}
                  formatNumber={formatNumber}
                  lang={lang}
                  colorClass="from-yellow-500/20 to-amber-500/20"
                />
                <UpgradeButton
                  icon={<FastForward className="w-6 h-6 text-cyan-400" />}
                  title={t[lang].evolutionSpeed}
                  level={uiState.upgrades.evolutionSpeedLevel}
                  cost={getUpgradeCost('evolutionSpeed', uiState.upgrades.evolutionSpeedLevel, uiState)}
                  canAfford={uiState.energy >= getUpgradeCost('evolutionSpeed', uiState.upgrades.evolutionSpeedLevel, uiState)}
                  onClick={() => handleBuy('evolutionSpeed')}
                  onIconClick={() => handleSkillInfo('evolutionSpeed')}
                  formatNumber={formatNumber}
                  lang={lang}
                  colorClass="from-cyan-500/20 to-blue-500/20"
                />
                <UpgradeButton
                  icon={<Leaf className="w-6 h-6 text-green-500" />}
                  title={t[lang].grassDamage}
                  level={uiState.upgrades.grassLevel}
                  cost={getUpgradeCost('grass', uiState.upgrades.grassLevel, uiState)}
                  canAfford={uiState.energy >= getUpgradeCost('grass', uiState.upgrades.grassLevel, uiState)}
                  onClick={() => handleBuy('grass')}
                  onIconClick={() => handleSkillInfo('grass')}
                  formatNumber={formatNumber}
                  lang={lang}
                  colorClass="from-green-500/20 to-lime-500/20"
                />
              </div>

              {/* Abilities */}
              <div>
                <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">{t[lang].abilities}</h3>
                <div className="grid grid-cols-1 gap-3">
                  <AbilityButton
                    icon={<Sun className="w-6 h-6 text-yellow-300" />}
                    title={t[lang].ability1}
                    ability={uiState.abilities.sunBurst}
                    cost={getUpgradeCost('sunBurst', uiState.abilities.sunBurst.level, uiState)}
                    canAfford={uiState.energy >= getUpgradeCost('sunBurst', uiState.abilities.sunBurst.level, uiState)}
                    onClick={() => handleBuy('sunBurst')}
                    onIconClick={() => handleSkillInfo('sunBurst')}
                    formatNumber={formatNumber}
                    lang={lang}
                    colorClass="from-yellow-400/30 to-orange-500/30"
                  />
                  <AbilityButton
                    icon={<Wind className="w-6 h-6 text-emerald-300" />}
                    title={t[lang].ability2}
                    ability={uiState.abilities.rootEntangle}
                    cost={getUpgradeCost('rootEntangle', uiState.abilities.rootEntangle.level, uiState)}
                    canAfford={uiState.energy >= getUpgradeCost('rootEntangle', uiState.abilities.rootEntangle.level, uiState)}
                    onClick={() => handleBuy('rootEntangle')}
                    onIconClick={() => handleSkillInfo('rootEntangle')}
                    formatNumber={formatNumber}
                    lang={lang}
                    colorClass="from-emerald-400/30 to-teal-500/30"
                  />
                  <AbilityButton
                    icon={<Skull className="w-6 h-6 text-purple-500" />}
                    title={t[lang].ability3}
                    ability={uiState.abilities.poisonCloud}
                    cost={getUpgradeCost('poisonCloud', uiState.abilities.poisonCloud.level, uiState)}
                    canAfford={uiState.energy >= getUpgradeCost('poisonCloud', uiState.abilities.poisonCloud.level, uiState)}
                    onClick={() => handleBuy('poisonCloud')}
                    onIconClick={() => handleSkillInfo('poisonCloud')}
                    formatNumber={formatNumber}
                    lang={lang}
                    colorClass="from-purple-500/30 to-fuchsia-600/30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-950 border-t border-stone-900 p-2 text-center text-[10px] text-stone-600">
        {t[lang].developedBy} <a href="https://github.com/ricardo-camilo-programador-frontend-web" target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline">Ricardo Camilo</a>
      </footer>
    </div>
  );
}

function UpgradeButton({ icon, title, level, cost, canAfford, onClick, onIconClick, formatNumber, lang, colorClass }: any) {
  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left relative overflow-hidden group ${
        canAfford
          ? 'bg-stone-800/50 border-stone-700 hover:bg-stone-700/80 hover:border-stone-500 active:scale-[0.98] shadow-lg'
          : 'bg-stone-900/30 border-stone-800 opacity-50 cursor-not-allowed'
      }`}
    >
      {/* Background Gradient */}
      {canAfford && (
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      )}

      <div className="flex items-center gap-4 relative z-10">
        <div 
          className={`p-3 bg-stone-950 rounded-xl border border-stone-800 transition-all shadow-inner ${onIconClick ? 'cursor-pointer hover:bg-stone-800 hover:border-stone-600 hover:scale-110' : ''}`}
          onClick={(e) => {
            if (onIconClick) {
              e.stopPropagation();
              onIconClick();
            }
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' })}
        </div>
        <div>
          <div className="font-bold text-stone-100 text-base leading-tight mb-0.5 group-hover:text-white transition-colors">{title}</div>
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{t[lang].level} {level}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800 relative z-10 shadow-sm">
        <Zap className={`w-3.5 h-3.5 ${canAfford ? 'text-yellow-400 fill-yellow-400/20' : 'text-stone-600'}`} />
        <span className={`font-mono font-black text-sm ${canAfford ? 'text-yellow-400' : 'text-stone-500'}`}>
          {formatNumber(cost)}
        </span>
      </div>
    </button>
  );
}

function AbilityButton({ icon, title, ability, cost, canAfford, onClick, onIconClick, formatNumber, lang, colorClass }: any) {
  const isUnlocked = ability.level > 0;
  const cooldownPercent = isUnlocked ? Math.max(0, (ability.cooldown / ability.maxCooldown) * 100) : 0;

  return (
    <button
      onClick={onClick}
      disabled={!canAfford}
      className={`relative w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 text-left overflow-hidden group ${
        canAfford
          ? 'bg-stone-800/50 border-stone-700 hover:bg-stone-700/80 hover:border-stone-500 active:scale-[0.98] shadow-lg'
          : 'bg-stone-900/30 border-stone-800 opacity-50 cursor-not-allowed'
      }`}
    >
      {/* Background Gradient */}
      {canAfford && (
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      )}

      {/* Cooldown overlay */}
      {isUnlocked && ability.cooldown > 0 && (
        <div 
          className="absolute inset-0 bg-emerald-500/10 z-0 transition-all duration-100 ease-linear" 
          style={{ width: `${cooldownPercent}%` }}
        />
      )}
      
      <div className="flex items-center gap-4 z-10">
        <div 
          className={`p-3 rounded-xl border transition-all shadow-inner ${isUnlocked ? 'bg-stone-900 border-stone-700' : 'bg-stone-950 border-stone-800 grayscale opacity-50'} ${onIconClick ? 'cursor-pointer hover:bg-stone-800 hover:border-stone-600 hover:scale-110' : ''}`}
          onClick={(e) => {
            if (onIconClick) {
              e.stopPropagation();
              onIconClick();
            }
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' })}
        </div>
        <div>
          <div className="font-bold text-stone-100 text-base leading-tight mb-0.5 group-hover:text-white transition-colors">{title}</div>
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
            {isUnlocked ? `${t[lang].level} ${ability.level}` : 'Locked'}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800 z-10 shadow-sm">
        <Zap className={`w-3.5 h-3.5 ${canAfford ? 'text-yellow-400 fill-yellow-400/20' : 'text-stone-600'}`} />
        <span className={`font-mono font-black text-sm ${canAfford ? 'text-yellow-400' : 'text-stone-500'}`}>
          {formatNumber(cost)}
        </span>
      </div>
    </button>
  );
}
