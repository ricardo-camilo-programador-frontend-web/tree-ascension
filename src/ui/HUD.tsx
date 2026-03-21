/**
 * HUD (Heads-Up Display) Component
 * Displays game status: energy, wave, HP, plant level
 */

import React from 'react';
import { Zap, Settings, Globe } from 'lucide-react';
import { Language, languages } from '../i18n';
import { formatNumber } from '../utils/number';

interface HUDProps {
  energy: number;
  wave: number;
  playerHealth: number;
  plantLevel: number;
  plantStage: number;
  fps: number;
  lang: Language;
  onLangChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSettingsClick: () => void;
}

export default function HUD({
  energy,
  wave,
  playerHealth,
  plantLevel,
  plantStage,
  fps,
  lang,
  onLangChange,
  onSettingsClick,
}: HUDProps) {
  return (
    <header className="bg-stone-900 border-b border-stone-800 p-4 flex justify-between items-center shadow-md z-10">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2 bg-stone-950 px-3 md:px-4 py-1.5 rounded-full border border-stone-800">
          <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-mono text-lg md:text-xl font-bold text-yellow-400">{formatNumber(energy)}</span>
        </div>
        <div className="hidden md:flex items-center gap-1 text-xs text-stone-500 font-mono">
          <span>FPS:</span>
          <span className={fps < 30 ? 'text-red-500' : 'text-emerald-500'}>{fps}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <div className="text-center hidden xs:block">
          <div className="text-[9px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">Wave</div>
          <div className="text-base md:text-xl font-black text-stone-200">{wave}</div>
        </div>
        
        <div className="text-center">
          <div className="text-[9px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">HP</div>
          <div className="text-base md:text-xl font-black text-red-500">{formatNumber(playerHealth)}</div>
        </div>
        
        <div className="text-center">
          <div className="text-[9px] md:text-xs text-stone-500 font-bold uppercase tracking-wider">Plant Lv</div>
          <div className="text-base md:text-xl font-black text-emerald-400">{plantLevel}-{plantStage}</div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={onSettingsClick}
            className="p-1.5 md:p-2 bg-stone-800 rounded hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <Globe className="w-3 h-3 md:w-4 md:h-4 text-stone-400 ml-2" />
          <select
            value={lang}
            onChange={onLangChange}
            className="bg-stone-800 text-stone-200 text-[10px] md:text-xs rounded p-1 border border-stone-700 outline-none max-w-[60px] md:max-w-none"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
