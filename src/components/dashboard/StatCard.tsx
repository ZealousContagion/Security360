import { Card, CardContent } from "@/components/ui/Card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    className?: string
    variant?: "default" | "primary" | "secondary" | "accent" | "glass"
    trend?: {
        value: string;
        positive: boolean;
    }
}

export function StatCard({ title, value, description, icon: Icon, className, variant = "default", trend }: StatCardProps) {
    const variants = {
        default: "border-border bg-card",
        primary: "bg-primary text-primary-foreground border-none",
        secondary: "bg-secondary text-secondary-foreground border-none",
        accent: "bg-accent text-white border-none shadow-lg shadow-accent/20",
        glass: "bg-background/40 backdrop-blur-md border border-white/20 shadow-xl",
    }

    return (
        <Card className={cn("overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]", variants[variant], className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <div className={cn(
                        "p-2 rounded-lg",
                        variant === "default" ? "bg-secondary" : "bg-white/20"
                    )}>
                        <Icon className={cn(
                            "h-5 w-5",
                            variant === "default" ? "text-primary" : "text-white"
                        )} />
                    </div>
                    {trend && (
                        <div className={cn(
                            "text-xs font-bold px-2 py-0.5 rounded-full",
                            trend.positive ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"
                        )}>
                            {trend.positive ? "↑" : "↓"} {trend.value}
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <p className={cn(
                        "text-sm font-medium",
                        variant === "default" ? "text-muted-foreground" : "text-white/80"
                    )}>
                        {title}
                    </p>
                    <div className="text-3xl font-bold tracking-tight">
                        {value}
                    </div>
                    {description && (
                        <p className={cn(
                            "text-xs mt-1",
                            variant === "default" ? "text-muted-foreground" : "text-white/60"
                        )}>
                            {description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
