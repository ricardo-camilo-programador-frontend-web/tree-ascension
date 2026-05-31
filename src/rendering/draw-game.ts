import type { GameState } from '../game';
import { CANVAS_W, CANVAS_H } from '../config/constants';
import { drawPlant } from './draw-plant';
import { drawZombie } from './draw-zombie';
import { drawSuns } from './draw-sun';
import { drawCoins } from './draw-coins';
import { drawProjectiles } from './draw-projectiles';
import { drawParticles, drawFloatingTexts, drawSunBursts, drawPortal } from './draw-fx';

export function drawGame(ctx: CanvasRenderingContext2D, width: number, height: number, state: GameState): void {
  const internalW = CANVAS_W;
  const internalH = CANVAS_H;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  const scale = Math.min(width / internalW, height / internalH);
  const offsetX = (width - internalW * scale) / 2;
  const offsetY = (height - internalH * scale) / 2;
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, internalH);
  bgGradient.addColorStop(0, '#0c0a09');
  bgGradient.addColorStop(1, '#1c1917');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, internalW, internalH);

  // Subtle stars/particles in background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 50; i++) {
    const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * internalW;
    const y = (Math.cos(i * 678.90) * 0.5 + 0.5) * (internalH - 100);
    const size = (Math.sin(state.timers.gameTime + i) * 0.5 + 0.5) * 2;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ground
  let groundColor = '#171717';
  if (state.upgrades.grassLevel > 0) {
    groundColor = state.upgrades.grassEvolutions.includes('poison_grass') ? '#2e1065' : '#064e3b';
  }
  ctx.fillStyle = groundColor;
  ctx.fillRect(0, internalH - 100, internalW, 100);
  
  // Ground texture/grid
  const grassColor = state.upgrades.grassEvolutions.includes('poison_grass') ? '168, 85, 247' : '34, 197, 94';
  ctx.strokeStyle = `rgba(${grassColor}, 0.05)`;
  ctx.lineWidth = 1;
  for (let i = 0; i < internalW; i += 50) {
    ctx.beginPath();
    ctx.moveTo(i, internalH - 100);
    ctx.lineTo(i, internalH);
    ctx.stroke();
  }
  for (let i = internalH - 100; i < internalH; i += 25) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(internalW, i);
    ctx.stroke();
  }

  // Path
  ctx.fillStyle = '#292524';
  ctx.fillRect(0, internalH - 120, internalW, 40);

  // Draw Plant
  drawPlant(ctx, state, internalH);

  // Draw Zombies
  for (const z of state.zombies) {
    drawZombie(ctx, z, state.timers.gameTime, internalW);
  }

  // Draw Suns
  drawSuns(ctx, state.suns, state.timers.gameTime);

  // Draw SunBursts
  drawSunBursts(ctx, state.sunBursts);

  // Draw Portal
  drawPortal(ctx, state, internalW, internalH);

  // Draw Coins
  drawCoins(ctx, state.coins);

  // Draw Projectiles
  drawProjectiles(ctx, state.projectiles);

  // Draw Particles
  drawParticles(ctx, state.particles, state.settings.lowPerformance);

  // Draw Floating Texts
  drawFloatingTexts(ctx, state.floatingTexts, state.settings.lowPerformance);

  ctx.restore();
}
