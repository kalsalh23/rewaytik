import { type ReactNode, useEffect } from 'react'

import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div
            className={`relative bg-card rounded-2xl shadow-elevated w-full overflow-hidden ${
              size === 'sm' ? 'max-w-sm' : size === 'md' ? 'max-w-md' : size === 'lg' ? 'max-w-lg' : 'max-w-xl'
            }`}
          >
            {title && (
              <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="p-6">{children}</div>
          </div>
        </div>
      )}
    </>
  )
}
