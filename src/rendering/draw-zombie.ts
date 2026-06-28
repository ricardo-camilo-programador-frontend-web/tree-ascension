import { CANVAS_W } from '../config/constants'
import type { Zombie } from '../game'

export function drawZombie(
  ctx: CanvasRenderingContext2D,
  z: Zombie,
  time: number,
  _internalW: number = CANVAS_W,
): void {
  ctx.save()
  ctx.translate(z.x, z.y)

  const wobble = Math.sin(time * 10 + z.wobbleOffset) * 5

  const isHit = z.hitTimer !== undefined && z.hitTimer > 0
  if (isHit) {
    ctx.scale(1.1, 0.9) // Squish effect
  }

  ctx.fillStyle = 'rgba(0,0,0,0.5)'
  ctx.beginPath()
  ctx.ellipse(0, 10, z.size * 0.8, z.size * 0.2, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = isHit ? '#ffffff' : z.color
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.rect(-z.size / 2, -z.size + wobble, z.size, z.size)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#ef4444'
  ctx.beginPath()
  ctx.arc(-z.size / 4, -z.size * 0.7 + wobble, z.size * 0.1, 0, Math.PI * 2)
  ctx.fill()

  if (z.type === 'shield') {
    ctx.fillStyle = isHit ? '#e9d5ff' : '#8b5cf6'
    ctx.fillRect(-z.size * 0.8, -z.size * 1.2 + wobble, z.size * 0.4, z.size * 1.4)
    ctx.strokeRect(-z.size * 0.8, -z.size * 1.2 + wobble, z.size * 0.4, z.size * 1.4)
  } else if (z.type === 'tank') {
    ctx.fillStyle = isHit ? '#cbd5e1' : '#64748b'
    ctx.fillRect(-z.size / 2, -z.size + wobble, z.size, z.size * 0.3)
  } else if (z.type === 'boss') {
    // Boss unique visual traits: Glowing eyes and corrupted energy
    ctx.save()
    ctx.translate(0, wobble)

    // Corrupted energy aura
    ctx.globalAlpha = 0.3 + Math.sin(time * 5) * 0.2
    ctx.fillStyle = '#7c3aed'
    ctx.beginPath()
    ctx.arc(0, -z.size / 2, z.size * 0.8, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // Glowing eyes
    ctx.fillStyle = '#ffffff'
    ctx.shadowColor = '#ffffff'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.arc(-z.size / 4, -z.size * 0.7 + wobble, z.size * 0.15, 0, Math.PI * 2)
    ctx.arc(z.size / 4, -z.size * 0.7 + wobble, z.size * 0.15, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  const tier = Math.ceil((z.level || 1) / 4)
  if (tier === 2) {
    ctx.fillStyle = isHit ? '#e2e8f0' : '#94a3b8'
    ctx.beginPath()
    ctx.arc(0, -z.size + wobble, z.size / 2, Math.PI, 0)
    ctx.fill()
    ctx.stroke()
  } else if (tier === 3) {
    ctx.fillStyle = isHit ? '#f5d0fe' : '#d946ef'
    ctx.beginPath()
    ctx.arc(0, -z.size + wobble, z.size / 3, Math.PI, 0)
    ctx.fill()
    ctx.stroke()
  } else if (tier === 4) {
    ctx.fillStyle = '#f8fafc'
    ctx.beginPath()
    ctx.moveTo(-z.size / 4, -z.size + wobble)
    ctx.lineTo(-z.size / 4 - 10, -z.size - 15 + wobble)
    ctx.lineTo(0, -z.size + wobble)
    ctx.fill()
    ctx.stroke()
  } else if (tier === 5) {
    ctx.strokeStyle = isHit ? '#fca5a5' : '#dc2626'
    ctx.lineWidth = 3
    ctx.shadowColor = isHit ? '#fca5a5' : '#dc2626'
    ctx.shadowBlur = 10
    ctx.strokeRect(-z.size / 2 - 5, -z.size + wobble - 5, z.size + 10, z.size + 10)
    ctx.shadowBlur = 0
  }

  // Health Bar above enemy
  const hpPercent = Math.max(0, z.hp / z.maxHp)
  const barWidth = z.size * 1.2
  const barHeight = 4
  const barY = -z.size - 15 + wobble

  // Background (semi-transparent dark)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  ctx.fillRect(-barWidth / 2, barY, barWidth, barHeight)

  // Foreground (color based on health)
  ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.2 ? '#eab308' : '#ef4444'
  ctx.fillRect(-barWidth / 2, barY, barWidth * hpPercent, barHeight)

  // Border
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.lineWidth = 1
  ctx.strokeRect(-barWidth / 2, barY, barWidth, barHeight)

  ctx.restore()
}
