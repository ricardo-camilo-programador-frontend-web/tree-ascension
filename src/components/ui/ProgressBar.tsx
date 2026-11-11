import { cn } from '../../ui/cn'

const tones = {
  leaf: 'bg-canopy-leaf',
  sap: 'bg-canopy-sap',
  info: 'bg-canopy-info',
  hp: 'bg-canopy-hp',
  warn: 'bg-canopy-warn',
} as const

export function ProgressBar({
  value,
  label,
  tone = 'leaf',
}: {
  value: number
  label: string
  tone?: keyof typeof tones
}) {
  const percent = Math.max(0, Math.min(100, value))
  return (
    <div
      className="h-2 overflow-hidden rounded-full border border-canopy-line bg-canopy-bg"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
    >
      <div className={cn('h-full', tones[tone])} style={{ width: `${percent}%` }} />
    </div>
  )
}
