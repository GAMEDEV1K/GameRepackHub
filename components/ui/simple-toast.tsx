"use client"

import React, { useState, useEffect } from 'react'
// Using React directly to avoid TypeScript errors
type ReactNode = React.ReactNode

type ToastProps = {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
  onClose: () => void
}

export const Toast = ({ id, title, message, type, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-700'
      case 'error':
        return 'bg-red-600 border-red-700'
      case 'info':
      default:
        return 'bg-blue-600 border-blue-700'
    }
  }

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded shadow-lg border-l-4 text-white ${getTypeStyles()} transition-all duration-300 ease-in-out transform translate-y-0 opacity-100 max-w-md z-50`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <div>
          {title && <h3 className="font-bold mb-1">{title}</h3>}
          <p>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

type ToastContextType = {
  showToast: (message: string, type: 'success' | 'error' | 'info', title?: string, duration?: number) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

type ToastItem = {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  title?: string
  duration?: number
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = (message: string, type: 'success' | 'error' | 'info', title?: string, duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prevToasts) => [...prevToasts, { id, message, type, title, duration }])
  }

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            title={toast.title}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
