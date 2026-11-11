import { cn } from '../../ui/cn'

export function Stat({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div className="min-w-[3.25rem] text-center">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-canopy-muted">
        {label}
      </div>
      <div className={cn('font-mono text-base font-bold tabular-nums sm:text-lg', valueClassName)}>
        {value}
      </div>
    </div>
  )
}
