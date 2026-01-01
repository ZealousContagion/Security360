import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface EmptyStateProps {
    title: string
    description: string
    icon?: LucideIcon
    actionLabel?: string
    onAction?: () => void
    className?: string
}

export function EmptyState({
    title,
    description,
    icon: Icon,
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn("flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in zoom-in-95 duration-300", className)}>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                {Icon ? (
                    <Icon className="h-10 w-10 text-muted-foreground" />
                ) : (
                    <div className="h-10 w-10 bg-muted-foreground/20 rounded-full" />
                )}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction} className="mt-6" variant="outline">
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}
