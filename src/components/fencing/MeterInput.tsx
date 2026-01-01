"use client"

import * as React from "react"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"

interface MeterInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function MeterInput({ label, error, className, ...props }: MeterInputProps) {
    return (
        <div className="space-y-1.5">
            {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
            <div className="relative">
                <Input
                    type="number"
                    className={cn("pr-12", error && "border-destructive", className)}
                    {...props}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-sm text-muted-foreground">meters</span>
                </div>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}
