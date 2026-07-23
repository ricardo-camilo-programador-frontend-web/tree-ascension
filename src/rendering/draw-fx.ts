import type { FloatingText, GameState, Particle, SunBurst } from '../game'

export function drawParticles(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  lowPerformance: boolean,
): void {
  for (const p of particles) {
    ctx.fillStyle = p.color
    ctx.globalAlpha = 1 - p.life / p.maxLife
    ctx.beginPath()
    if (lowPerformance) {
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
    } else {
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}

export function drawFloatingTexts(
  ctx: CanvasRenderingContext2D,
  floatingTexts: FloatingText[],
  lowPerformance: boolean,
): void {
  ctx.font = 'bold 20px monospace'
  ctx.textAlign = 'center'
  for (const ft of floatingTexts) {
    ctx.globalAlpha = 1 - ft.life / ft.maxLife

    if (!lowPerformance) {
      ctx.shadowColor = 'black'
      ctx.shadowBlur = 4
      ctx.lineWidth = 3
      ctx.strokeStyle = 'black'
      ctx.strokeText(ft.text, ft.x, ft.y)
      ctx.shadowBlur = 0
    }

    ctx.fillStyle = ft.color
    ctx.fillText(ft.text, ft.x, ft.y)
  }
  ctx.globalAlpha = 1
}

export function drawSunBursts(ctx: CanvasRenderingContext2D, sunBursts: SunBurst[]): void {
  for (const sb of sunBursts) {
    ctx.save()
    ctx.translate(sb.x, sb.y)

    const progress = sb.life / sb.maxLife
    const radius = 50 + progress * 300
    const alpha = 1 - progress

    ctx.globalAlpha = alpha

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
    gradient.addColorStop(0, 'rgba(254, 240, 138, 1)') // #fef08a
    gradient.addColorStop(0.5, 'rgba(250, 204, 21, 0.8)') // #facc15
    gradient.addColorStop(1, 'rgba(234, 179, 8, 0)') // #eab308

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
  }
}

const portalParticleSeeds = Array.from({ length: 15 }, () => ({
  offset: (Math.random() - 0.5) * 1.5,
  yOffset: Math.random(),
  size: 2 + Math.random() * 3,
}))

export function drawPortal(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  internalW: number,
  internalH: number,
): void {
  if (state.waveState.spawned >= state.waveState.totalToSpawn) return

  ctx.save()
  // Portal spans full height of play area (approx 10% width)
  const portalWidth = internalW * 0.1
  const portalHeight = internalH
  ctx.translate(internalW - portalWidth / 2, internalH / 2)

  // Portal glow
  ctx.shadowColor = '#a855f7'
  ctx.shadowBlur = 50

  // Portal body
  const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, portalHeight / 2)
  gradient.addColorStop(0, '#000000')
  gradient.addColorStop(0.3, '#581c87')
  gradient.addColorStop(0.7, '#7e22ce')
  gradient.addColorStop(1, 'transparent')

  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.ellipse(0, 0, portalWidth, portalHeight / 1.5, 0, 0, Math.PI * 2)
  ctx.fill()

  // Subtle particles inside portal
  ctx.fillStyle = '#d8b4fe'
  for (let i = 0; i < portalParticleSeeds.length; i++) {
    const seed = portalParticleSeeds[i]
    const px = seed.offset * portalWidth
    const py = (seed.yOffset - 0.5) * portalHeight * 0.8
    const size = seed.size
    ctx.globalAlpha = 0.5 + Math.sin(state.timers.gameTime * 2 + i) * 0.3
    ctx.beginPath()
    ctx.arc(px, py, size, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.restore()
}
