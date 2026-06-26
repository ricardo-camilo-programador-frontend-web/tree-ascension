import type { Sun } from '../game';

export function drawSuns(ctx: CanvasRenderingContext2D, suns: Sun[], time: number): void {
  for (const s of suns) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(time);
    
    let scale = 1;
    let alpha = 1;
    if (s.life > 5) {
      const fadeProgress = (s.life - 5) / (s.maxLife - 5); // 0 to 1
      alpha = 1 - fadeProgress;
      scale = 1 - fadeProgress * 0.5;
      
      // Blink effect
      if (Math.sin(s.life * 20) > 0) {
        alpha *= 0.5;
      }
    }
    
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    
    // Outer glow
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, 0, s.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner core
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, 0, s.size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // Rays
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      ctx.rotate(Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(s.size * 0.8, 0);
      ctx.lineTo(s.size * 1.2, 0);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}
