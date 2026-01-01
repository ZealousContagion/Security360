"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
// import { Separator } from "@/components/ui/Separator" // Using div instead

export interface PricingBreakdown {
    label: string;
    amount: number;
    description?: string;
}

interface PricingSummaryCardProps {
    title?: string;
    items: PricingBreakdown[];
    total: number;
    currency?: string;
}

export function PricingSummaryCard({
    title = "Pricing Summary",
    items,
    total,
    currency = "KES"
}: PricingSummaryCardProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency }).format(val);
    };

    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-primary">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                            <div className="flex flex-col">
                                <span className="font-medium">{item.label}</span>
                                {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                            </div>
                            <span className="font-mono">{formatCurrency(item.amount)}</span>
                        </div>
                    ))}
                </div>

                <div className="h-px bg-primary/20 my-2" />

                <div className="flex justify-between items-center pt-1">
                    <span className="text-base font-bold">Total (incl. VAT)</span>
                    <span className="text-xl font-black text-primary font-mono">{formatCurrency(total)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground text-center italic">
                    Prices are subject to terrain assessment and site survey.
                </p>
            </CardContent>
        </Card>
    )
}
