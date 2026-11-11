import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../ui/cn'

const variants = {
  primary:
    'bg-canopy-leaf-btn text-canopy-on-leaf hover:brightness-110 disabled:bg-canopy-bg disabled:text-canopy-muted',
  sap: 'bg-canopy-sap text-canopy-ink hover:brightness-105 disabled:bg-canopy-bg disabled:text-canopy-muted',
  secondary:
    'border border-canopy-line bg-canopy-raised text-canopy-text hover:border-canopy-leaf disabled:text-canopy-muted',
  danger:
    'bg-canopy-danger text-canopy-on-danger hover:brightness-110 disabled:bg-canopy-bg disabled:text-canopy-muted',
  ghost: 'bg-transparent text-canopy-muted hover:bg-canopy-raised hover:text-canopy-text',
} as const

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
}

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
