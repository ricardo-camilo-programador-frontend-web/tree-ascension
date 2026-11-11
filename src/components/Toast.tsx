import { X } from 'lucide-react'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
  duration: number
}

// Encapsulated module-level store
let toasts: Toast[] = []
let nextId = 0
let listeners: Array<() => void> = []

function notifyListeners() {
  for (const l of listeners) l()
}

const MAX_TOASTS = 5

export function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
  const id = nextId++
  const toast: Toast = { id, message, type, duration }
  toasts = [...toasts.slice(-(MAX_TOASTS - 1)), toast]
  notifyListeners()
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    notifyListeners()
  }, duration)
}

export function dismissToast(id: number) {
  toasts = toasts.filter(t => t.id !== id)
  notifyListeners()
}

const typeStyles: Record<ToastType, string> = {
  success: 'border-l-4 border-canopy-leaf',
  error: 'border-l-4 border-canopy-hp',
  info: 'border-l-4 border-canopy-info',
}

const typeIconColor: Record<ToastType, string> = {
  success: 'text-canopy-leaf',
  error: 'text-canopy-hp',
  info: 'text-canopy-info',
}

function ToastItem({ toast }: { toast: Toast }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setShow(true))
  }, [])

  const handleDismiss = useCallback(() => {
    dismissToast(toast.id)
  }, [toast.id])

  return (
    <div
      className={`
        ${typeStyles[toast.type]}
        bg-canopy-panel text-canopy-text border border-canopy-line rounded-xl px-4 py-3 shadow-2xl
        flex items-center gap-3 min-w-0 w-[min(24rem,calc(100vw-2rem))] min-h-11
        transition-all duration-300 ease-out
        ${show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
      `}
      role="status"
      aria-live="polite"
    >
      <span className={`text-lg ${typeIconColor[toast.type]}`} aria-hidden="true">
        {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
      </span>
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button
        type="button"
        onClick={handleDismiss}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-canopy-muted hover:text-canopy-text"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function subscribeToasts(callback: () => void) {
  listeners.push(callback)
  return () => {
    listeners = listeners.filter(l => l !== callback)
  }
}

function getToastsSnapshot() {
  return toasts
}

export function ToastContainer() {
  const currentToasts = useSyncExternalStore(subscribeToasts, getToastsSnapshot)

  return (
    <div className="pointer-events-none fixed top-20 left-1/2 z-[9999] flex w-[min(24rem,calc(100vw-1.5rem))] -translate-x-1/2 flex-col gap-2">
      {currentToasts.slice(-3).map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  )
}
