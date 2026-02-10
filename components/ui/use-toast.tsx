"use client"

import * as React from "react"

type ToastProps = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

const ToastContext = React.createContext<{
  toasts: ToastProps[]
  toast: (toast: ToastProps) => void
}>({
  toasts: [],
  toast: () => {},
})

export function ToastProviderCustom({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = (toast: ToastProps) => {
    setToasts((prev) => [...prev, toast])
  }

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => React.useContext(ToastContext)
