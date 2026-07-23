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
  success: 'border-l-4 border-emerald-500',
  error: 'border-l-4 border-red-500',
  info: 'border-l-4 border-blue-500',
}

const typeIconColor: Record<ToastType, string> = {
  success: 'text-emerald-400',
  error: 'text-red-400',
  info: 'text-blue-400',
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
        bg-stone-800 text-stone-200 border border-stone-700 rounded-lg px-4 py-3 shadow-2xl
        flex items-center gap-3 min-w-[280px] max-w-[400px]
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
        onClick={handleDismiss}
        className="text-stone-500 hover:text-white transition-colors p-0.5 flex-shrink-0"
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
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {currentToasts.slice(-3).map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} />
        </div>
      ))}
    </div>
  )
}
