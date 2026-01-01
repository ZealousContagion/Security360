"use client"

import * as React from "react"
import { Toast, ToastVariant } from "./Toast"

interface ToastMessage {
    id: string
    title: string
    description?: string
    variant?: ToastVariant
}

interface ToastContextType {
    toast: (message: Omit<ToastMessage, "id">) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastMessage[]>([])

    const toast = React.useCallback((message: Omit<ToastMessage, "id">) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { ...message, id }])
    }, [])

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] gap-2">
                {toasts.map((t) => (
                    <Toast key={t.id} {...t} onClose={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
