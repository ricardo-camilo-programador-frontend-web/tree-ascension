import type { GameState } from '../game';
import { CANVAS_H } from '../config/constants';
import { formatNumber } from '../utils/number';

export function drawPlant(ctx: CanvasRenderingContext2D, state: GameState, internalH: number = CANVAS_H): void {
  const { level, stage, evolutionProgress } = state.plant;
  const x = 150;
  const y = internalH - 100;
  const time = state.timers.gameTime;
  const breathe = Math.sin(time * 4) * (2 + stage * 0.5);

  ctx.save();
  ctx.translate(x, y);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 10, 40 + stage * 5, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  const tier = Math.ceil(level / 4);
  // Subtle and gradual size increase based on level, capped at 1.5x
  const levelScale = Math.min(1.5, 1 + (level - 1) * 0.02);
  const sizeMultiplier = levelScale * (1 + (stage - 1) * 0.1);

  ctx.scale(sizeMultiplier, sizeMultiplier);

  if (tier === 1) {
    // Sprout
    ctx.fillStyle = '#4ade80';
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -20 - breathe, 25, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(-20, -30 - breathe, 15, 8, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.arc(-8, -25 - breathe, 4, 0, Math.PI * 2);
    ctx.arc(12, -25 - breathe, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (tier === 2) {
    // Flower
    ctx.fillStyle = '#16a34a';
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 3;
    ctx.fillRect(-10, -40, 20, 40);
    ctx.strokeRect(-10, -40, 20, 40);

    ctx.fillStyle = '#ec4899';
    for (let i = 0; i < 6; i++) {
      ctx.save();
      ctx.translate(0, -40 - breathe);
      ctx.rotate((i * Math.PI * 2) / 6 + time);
      ctx.beginPath();
      ctx.ellipse(20, 0, 15, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(0, -40 - breathe, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (tier === 3) {
    // Bark/Tree
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(-15, -60 - breathe);
    ctx.lineTo(15, -60 - breathe);
    ctx.lineTo(20, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(0, -70 - breathe, 30, 0, Math.PI * 2);
    ctx.arc(-20, -60 - breathe, 25, 0, Math.PI * 2);
    ctx.arc(20, -60 - breathe, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#a3e635';
    ctx.shadowColor = '#a3e635';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(-8, -40 - breathe, 4, 0, Math.PI * 2);
    ctx.arc(12, -40 - breathe, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  } else if (tier === 4) {
    // Magic
    ctx.fillStyle = '#4c1d95';
    ctx.strokeStyle = '#2e1065';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, -40 - breathe, 25, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, -80 - breathe);
    ctx.lineTo(0, 0);
    ctx.moveTo(-15, -40 - breathe);
    ctx.lineTo(15, -40 - breathe);
    ctx.stroke();
    ctx.shadowBlur = 0;
  } else {
    // Mythical
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, -50 - breathe, 35, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.ellipse(0, -110 - breathe + Math.sin(time * 2) * 10, 40, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.restore();

  // Evolution Progress Bar
  const totalEvolutions = (level - 1) * 5 + (stage - 1);
  const requiredProgress = 100 * Math.pow(1.2, totalEvolutions);
  const evoPercent = Math.max(0, Math.min(1, evolutionProgress / requiredProgress));
  
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(x - 40, y + 32, 80, 6);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(x - 40, y + 32, 80 * evoPercent, 6);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 40, y + 32, 80, 6);

  // HP Bar
  const hpPercent = Math.max(0, state.playerHealth / state.maxPlayerHealth);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(x - 40, y + 20, 80, 8);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(x - 40, y + 20, 80 * hpPercent, 8);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.strokeRect(x - 40, y + 20, 80, 8);

  // HP Text
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`HP: ${formatNumber(state.playerHealth)} / ${formatNumber(state.maxPlayerHealth)}`, x, y + 45);
}
