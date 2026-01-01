import * as React from "react"
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastVariant = "default" | "success" | "destructive" | "info"

interface ToastProps {
    id: string
    title: string
    description?: string
    variant?: ToastVariant
    onClose: (id: string) => void
}

export function Toast({
    id,
    title,
    description,
    variant = "default",
    onClose,
}: ToastProps) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id)
        }, 5000)
        return () => clearTimeout(timer)
    }, [id, onClose])

    const icons = {
        default: null,
        success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        destructive: <AlertCircle className="h-5 w-5 text-destructive" />,
        info: <Info className="h-5 w-5 text-blue-500" />,
    }

    return (
        <div className={cn(
            "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all animate-in slide-in-from-right-full duration-300",
            variant === "default" && "bg-background text-foreground",
            variant === "success" && "border-green-500/50 bg-green-50 text-green-900",
            variant === "destructive" && "border-destructive/50 bg-destructive/10 text-destructive",
            variant === "info" && "border-blue-500/50 bg-blue-50 text-blue-900"
        )}>
            <div className="flex gap-3">
                {icons[variant]}
                <div className="grid gap-1">
                    <div className="text-sm font-semibold">{title}</div>
                    {description && (
                        <div className="text-xs opacity-90">{description}</div>
                    )}
                </div>
            </div>
            <button
                onClick={() => onClose(id)}
                className="absolute right-2 top-2 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100 focus:outline-none"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
