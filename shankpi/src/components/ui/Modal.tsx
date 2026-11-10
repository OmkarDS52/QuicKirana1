import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-warm-900/50 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg animate-slide-up rounded-t-3xl bg-cream p-6 shadow-lift sm:rounded-3xl safe-bottom">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-warm-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="tap-target flex items-center justify-center rounded-xl bg-warm-100 p-2 text-warm-800"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
