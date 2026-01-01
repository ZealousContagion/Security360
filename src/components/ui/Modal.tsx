import * as React from "react"
import { cn } from "@/lib/utils"
// Note: In production, consider using Radix UI Dialog for accessibility.
// This is a minimal implementation for the template.

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: React.ReactNode
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    className,
    ...props
}: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
            <div
                className={cn(
                    "bg-background text-foreground border shadow-lg rounded-lg w-full max-w-lg p-6 relative",
                    className
                )}
                {...props}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
                    <span className="sr-only">Close</span>
                </button>

                {title && (
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
                        {description && (
                            <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
                        )}
                    </div>
                )}

                <div>{children}</div>
            </div>
        </div>
    )
}
