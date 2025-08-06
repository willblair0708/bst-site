"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, X } from "lucide-react"

interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 3000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`flex items-center gap-3 rounded-full border px-4 py-2 shadow-lg ${
                toast.type === 'success' 
                  ? 'border-accent-500/20 bg-accent-100/80 text-accent-500' 
                  : 'border-destructive/20 bg-error-100/80 text-destructive-500'
              }`}
              style={{backdropFilter: 'blur(10px)'}}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
              <span className="text-sm font-semibold">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1 -mr-2 rounded-full"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
