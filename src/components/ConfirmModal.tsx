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
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-stone-900 border border-stone-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="flex justify-between items-start mb-4">
          <h2
            id="modal-title"
            className={`text-xl font-black ${destructive ? 'text-red-400' : 'text-emerald-400'}`}
          >
            {title}
          </h2>
          <button
            onClick={() => onCancelRef.current()}
            className="text-stone-500 hover:text-white transition-colors"
            aria-label={t[lang].closeModal}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p id="modal-description" className="text-stone-300 text-sm mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            ref={cancelBtnRef}
            onClick={() => onCancelRef.current()}
            className="flex-1 py-2.5 rounded-xl font-bold bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
          >
            {resolvedCancelText}
          </button>
          <button
            onClick={() => onConfirmRef.current()}
            className={`flex-1 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${
              destructive
                ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'
            }`}
          >
            {resolvedConfirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
