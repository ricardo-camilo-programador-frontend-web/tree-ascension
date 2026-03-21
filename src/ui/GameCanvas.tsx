/**
 * GameCanvas Component
 * Canvas rendering for the game with evolution progress overlay
 */

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { GameState, updateGame, drawGame, handleCanvasClick, INTERNAL_W, INTERNAL_H } from '../game';
import { Sparkles, ShieldAlert } from 'lucide-react';
import { t, Language } from '../i18n';

interface GameCanvasProps {
  gameState: React.MutableRefObject<GameState>;
  lang: Language;
  onStateUpdate: () => void;
}

export interface GameCanvasRef {
  getCanvas: () => HTMLCanvasElement | null;
}

const GameCanvas = forwardRef<GameCanvasRef, GameCanvasProps>(
  ({ gameState, lang, onStateUpdate }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number>();

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    useEffect(() => {
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

      const render = () => {
        updateGame(gameState.current, 0);
        drawGame(ctx, canvas.width, canvas.height, gameState.current);
        animationFrameId.current = requestAnimationFrame(render);
      };
      render();

      return () => {
        window.removeEventListener('resize', resize);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }, [gameState]);

    const handleCanvasClickEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      handleCanvasClick(gameState.current, x, y, canvas.width, canvas.height);
      onStateUpdate();
    };

    const state = gameState.current;
    const totalEvolutions = (state.plant.level - 1) * 5 + (state.plant.stage - 1);
    const requiredProgress = 100 * Math.pow(1.2, totalEvolutions);
    const evoPercent = Math.max(0, Math.min(100, (state.plant.evolutionProgress / requiredProgress) * 100));

    return (
      <div className="flex-1 relative bg-stone-950 overflow-hidden cursor-crosshair flex flex-col">
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
                fontSize: `${Math.random() * 10 + 10}px`,
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

        {state.waveState.isBoss && (
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
    );
  }
);

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
