import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { type Language, t } from '../i18n'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  destructive?: boolean
  closeOnBackdrop?: boolean
  lang: Language
}

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  destructive = true,
  closeOnBackdrop = false,
  lang,
}: ConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const onCancelRef = useRef(onCancel)
  const onConfirmRef = useRef(onConfirm)
  const cancelBtnRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Keep callback refs up to date without triggering effect re-subscription
  useEffect(() => {
    onCancelRef.current = onCancel
  }, [onCancel])

  useEffect(() => {
    onConfirmRef.current = onConfirm
  }, [onConfirm])

  useEffect(() => {
    if (!open) return

    // Save previously focused element and set initial focus
    previousFocusRef.current = document.activeElement as HTMLElement
    setTimeout(() => {
      cancelBtnRef.current?.focus()
    }, 0)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancelRef.current()
        return
      }

      // Tab focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus only if element is still in DOM
      if (previousFocusRef.current?.isConnected) {
        previousFocusRef.current.focus()
      }
    }
  }, [open])

  if (!open) return null

  const resolvedConfirmText = confirmText ?? t[lang].confirm
  const resolvedCancelText = cancelText ?? t[lang].cancel

  const handleBackdropClick = () => {
    if (closeOnBackdrop) {
      onCancelRef.current()
    }
  }

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#07140f]/85 backdrop-blur-sm" aria-hidden="true" />
      {closeOnBackdrop ? (
        <button
          type="button"
          className="absolute inset-0 cursor-default"
          aria-label={t[lang].closeModal}
          onClick={handleBackdropClick}
        />
      ) : null}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-2xl border border-canopy-line bg-canopy-panel p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2
            id="modal-title"
            className={`font-display text-2xl ${destructive ? 'text-canopy-hp' : 'text-canopy-leaf'}`}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={() => onCancelRef.current()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-canopy-line text-canopy-muted hover:text-canopy-text"
            aria-label={t[lang].closeModal}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p id="modal-description" className="mb-6 text-sm leading-relaxed text-canopy-muted">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            ref={cancelBtnRef}
            onClick={() => onCancelRef.current()}
            className="min-h-11 flex-1 rounded-xl border border-canopy-line bg-canopy-raised font-semibold text-canopy-text"
          >
            {resolvedCancelText}
          </button>
          <button
            type="button"
            onClick={() => onConfirmRef.current()}
            className={`min-h-11 flex-1 rounded-xl font-semibold ${
              destructive
                ? 'bg-canopy-danger text-canopy-on-danger'
                : 'bg-canopy-leaf-btn text-canopy-on-leaf'
            }`}
          >
            {resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
