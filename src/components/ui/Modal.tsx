import { X } from 'lucide-react'
import { type ReactNode, useEffect, useId, useRef } from 'react'
import { cn } from '../../ui/cn'
import { IconButton } from './IconButton'

export function Modal({
  title,
  onClose,
  closeLabel,
  children,
  className,
  closeOnBackdrop = true,
  showClose = true,
}: {
  title: string
  onClose: () => void
  closeLabel: string
  children: ReactNode
  className?: string
  closeOnBackdrop?: boolean
  showClose?: boolean
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [])

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#07140f]/85 backdrop-blur-sm" aria-hidden="true" />
      {closeOnBackdrop && (
        <button
          type="button"
          className="absolute inset-0 cursor-default"
          aria-label={closeLabel}
          onClick={onClose}
        />
      )}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-canopy-line bg-canopy-panel p-5 shadow-2xl outline-none',
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-canopy-line pb-3">
          <h2 id={titleId} className="font-display text-2xl text-canopy-text">
            {title}
          </h2>
          {showClose ? (
            <IconButton label={closeLabel} onClick={onClose}>
              <X className="h-5 w-5" />
            </IconButton>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  )
}
