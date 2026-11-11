import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../ui/cn'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

export function IconButton({ label, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-canopy-line bg-canopy-raised text-canopy-muted hover:border-canopy-leaf hover:text-canopy-text disabled:cursor-not-allowed disabled:text-canopy-line',
        className,
      )}
      {...props}
    />
  )
}
