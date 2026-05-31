import React from 'react';
import { Save, Download, Skull, Upload, Copy, Check, Monitor, Volume2, VolumeX, X } from 'lucide-react';
import { AudioSettings } from '../audio';

export interface SettingsModalProps {
  audio: AudioSettings;
  onToggleMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  lowPerformance: boolean;
  onTogglePerformance: () => void;
  onManualSave: () => void;
  onExport: () => void;
  exportString: string;
  onCopyExport: () => void;
  copySuccess: boolean;
  importString: string;
  onImportStringChange: (v: string) => void;
  onImport: () => void;
  importError: string;
  onHardReset: () => void;
  onClose: () => void;
}

export default function SettingsModal({
  audio,
  onToggleMute,
  onVolumeChange,
  lowPerformance,
  onTogglePerformance,
  onManualSave,
  onExport,
  exportString,
  onCopyExport,
  copySuccess,
  importString,
  onImportStringChange,
  onImport,
  importError,
  onHardReset,
  onClose,
}: SettingsModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-4 sticky top-0 bg-stone-900 z-10">
          <h2 className="text-2xl font-black text-stone-200 uppercase tracking-wider">Settings</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Audio Settings */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-stone-300">Audio</div>
              <button
                onClick={onToggleMute}
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
                onChange={onVolumeChange}
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
              onClick={onTogglePerformance}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
                lowPerformance
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-800 text-stone-400'
              }`}
            >
              <Monitor className="w-4 h-4" />
              {lowPerformance ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Save Now */}
          <div className="flex items-center justify-between p-4 bg-stone-950 rounded-xl border border-stone-800">
            <div>
              <div className="font-bold text-stone-300">Manual Save</div>
              <div className="text-xs text-stone-500">Save your progress immediately</div>
            </div>
            <button
              onClick={onManualSave}
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
                onClick={onExport}
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
                  onClick={onCopyExport}
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
                onChange={(e) => onImportStringChange(e.target.value)}
                placeholder="Paste save string..."
                className="flex-1 bg-black border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={onImport}
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
              onClick={onHardReset}
              className="px-4 py-2 bg-red-900/50 hover:bg-red-800/50 text-red-400 border border-red-800 rounded-lg font-bold flex items-center gap-2"
            >
              <Skull className="w-4 h-4" /> Wipe Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
