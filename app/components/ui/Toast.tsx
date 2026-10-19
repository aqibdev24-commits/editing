'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Loader2 } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'loading';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Omit<Toast, 'id'>>) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return ctx;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: Toast = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      // Auto-dismiss unless loading
      if (toast.type !== 'loading') {
        const duration = toast.duration ?? 3000;
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }

      return id;
    },
    []
  );

  const updateToast = useCallback(
    (id: string, updates: Partial<Omit<Toast, 'id'>>) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );

      // If type changed from loading to something else, auto-dismiss
      if (updates.type && updates.type !== 'loading') {
        const duration = updates.duration ?? 3000;
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastViewportProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  loading: Loader2,
};

const STYLES: Record<ToastType, { container: string; icon: string }> = {
  success: {
    container: 'border-emerald-500/30 bg-emerald-950/90',
    icon: 'text-emerald-400',
  },
  error: {
    container: 'border-red-500/30 bg-red-950/90',
    icon: 'text-red-400',
  },
  info: {
    container: 'border-violet-500/30 bg-violet-950/90',
    icon: 'text-violet-400',
  },
  loading: {
    container: 'border-white/10 bg-slate-900/95',
    icon: 'text-violet-400',
  },
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = ICONS[toast.type];
  const styles = STYLES[toast.type];
  const isSpinning = toast.type === 'loading';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-3 shadow-2xl backdrop-blur-xl ${styles.container}`}
    >
      <Icon
        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${styles.icon} ${
          isSpinning ? 'animate-spin' : ''
        }`}
      />

      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-white">{toast.title}</div>
        {toast.description && (
          <div className="mt-0.5 text-xs text-slate-400">{toast.description}</div>
        )}
      </div>

      {toast.type !== 'loading' && (
        <button
          onClick={() => onDismiss(toast.id)}
          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
}