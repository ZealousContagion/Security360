"use client"

import * as React from "react"
import { Button } from "./Button"
import { cn } from "@/lib/utils"

export type Currency = "KES" | "USD"

interface CurrencyToggleProps {
    value: Currency
    onChange: (value: Currency) => void
    className?: string
}

export function CurrencyToggle({ value, onChange, className }: CurrencyToggleProps) {
    return (
        <div className={cn("inline-flex p-1 bg-muted rounded-lg border", className)}>
            <Button
                variant={value === "KES" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => onChange("KES")}
            >
                KES
            </Button>
            <Button
                variant={value === "USD" ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => onChange("USD")}
            >
                USD
            </Button>
        </div>
    )
}
