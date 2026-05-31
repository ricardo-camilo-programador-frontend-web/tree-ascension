import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
 open: boolean;
 title: string;
 message: string;
 onConfirm: () => void;
 onCancel: () => void;
 confirmText?: string;
 cancelText?: string;
 destructive?: boolean;
 lang: string;
}

export default function ConfirmModal({
 open,
 title,
 message,
 onConfirm,
 onCancel,
 confirmText = 'Confirm',
 cancelText = 'Cancel',
 destructive = true,
 lang,
}: ConfirmModalProps) {
 const modalRef = useRef<HTMLDivElement>(null);
 
 useEffect(() => {
 if (!open) return;
 
 const handleEscape = (e: KeyboardEvent) => {
 if (e.key === 'Escape') {
 onCancel();
 }
 };
 
 const handleFocusTrap = (e: FocusEvent) => {
 if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
 e.preventDefault();
 modalRef.current.focus();
 }
 };
 
 document.addEventListener('keydown', handleEscape);
 document.addEventListener('focusin', handleFocusTrap);
 
 return () => {
 document.removeEventListener('keydown', handleEscape);
 document.removeEventListener('focusin', handleFocusTrap);
 };
 }, [open, onCancel]);
 
 if (!open) return null;
 
 return (
 <div
 className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/90 backdrop-blur-md"
 onClick={onCancel}
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
 <h2 id="modal-title" className={`text-xl font-black ${destructive ? 'text-red-400' : 'text-emerald-400'}`}>
 {title}
 </h2>
 <button onClick={onCancel} className="text-stone-500 hover:text-white transition-colors" aria-label="Close modal">
 <X className="w-5 h-5" />
 </button>
 </div>
 <p id="modal-description" className="text-stone-300 text-sm mb-6 leading-relaxed">{message}</p>
 <div className="flex gap-3">
 <button
 onClick={onCancel}
 className="flex-1 py-2.5 rounded-xl font-bold bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-white transition-colors"
 >
 {cancelText}
 </button>
 <button
 onClick={onConfirm}
 className={`flex-1 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${
 destructive
 ? 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20'
 : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20'
 }`}
 >
 {confirmText}
 </button>
 </div>
 </div>
 </div>
 );
}
