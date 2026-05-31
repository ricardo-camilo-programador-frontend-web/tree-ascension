import { useEffect, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
 id: number;
 message: string;
 type: ToastType;
 duration: number;
}

// Module-level store so showToast can be called from non-React contexts
let toasts: Toast[] = [];
let nextId = 0;
let listeners: Array<() => void> = [];

function notifyListeners() {
 listeners.forEach(l => l());
}

export function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
 const id = nextId++;
 const toast: Toast = { id, message, type, duration };
 toasts = [...toasts, toast];
 notifyListeners();
 setTimeout(() => {
 toasts = toasts.filter(t => t.id !== id);
 notifyListeners();
 }, duration);
}

export function useToast() {
 return { showToast };
}

const typeStyles: Record<ToastType, string> = {
 success: 'border-l-4 border-emerald-500',
 error: 'border-l-4 border-red-500',
 info: 'border-l-4 border-blue-500',
};

const typeIconColor: Record<ToastType, string> = {
 success: 'text-emerald-400',
 error: 'text-red-400',
 info: 'text-blue-400',
};

function ToastItem({ toast }: { toast: Toast }) {
 const [show, setShow] = useState(false);

 useEffect(() => {
 requestAnimationFrame(() => setShow(true));
 }, []);

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
 <span className={`text-lg ${typeIconColor[toast.type]}`}>
 {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
 </span>
 <span className="text-sm font-medium">{toast.message}</span>
 </div>
 );
}

export function ToastContainer() {
 const [, forceUpdate] = useState(0);

 useEffect(() => {
 const listener = () => forceUpdate(c => c + 1);
 listeners.push(listener);
 return () => {
 listeners = listeners.filter(l => l !== listener);
 };
 }, []);

 return (
 <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
 {toasts.slice(-3).map(toast => (
 <div key={toast.id} className="pointer-events-auto">
 <ToastItem toast={toast} />
 </div>
 ))}
 </div>
 );
}
