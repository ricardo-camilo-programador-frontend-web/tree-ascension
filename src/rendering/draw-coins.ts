import type { Coin } from '../game';

export function drawCoins(ctx: CanvasRenderingContext2D, coins: Coin[]): void {
  for (const c of coins) {
    ctx.fillStyle = '#eab308'; // Yellow
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ca8a04';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', c.x, c.y);
  }
}
