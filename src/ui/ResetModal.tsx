/**
 * ResetModal Component
 * Modal for prestige/reset with permanent bonuses
 */

import React from 'react';
import { formatNumber } from '../utils/number';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resets: number;
}

export default function ResetModal({
  isOpen,
  onClose,
  onConfirm,
  resets,
}: ResetModalProps) {
  if (!isOpen) return null;

  const startingEnergy = (resets + 1) * 1000;

  return (
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
            <span className="text-xl font-mono font-bold text-white">{resets}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-stone-500 font-bold uppercase text-xs tracking-wider">Starting Energy After Reset</span>
            <span className="text-xl font-mono font-bold text-yellow-400">+{formatNumber(startingEnergy)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all active:scale-95"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
