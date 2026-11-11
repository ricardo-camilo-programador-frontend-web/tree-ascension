import { cn } from '../../ui/cn'

export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="flex rounded-xl border border-canopy-line bg-canopy-bg p-1">
      <legend className="sr-only">{label}</legend>
      {options.map(option => {
        const selected = option.value === value
        return (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'min-h-10 flex-1 rounded-lg text-xs font-bold',
              selected
                ? 'bg-canopy-leaf-btn text-canopy-on-leaf'
                : 'text-canopy-muted hover:bg-canopy-raised hover:text-canopy-text',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </fieldset>
  )
}
