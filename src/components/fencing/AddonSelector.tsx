"use client"

import * as React from "react"
import { Badge } from "@/components/ui/Badge"
// import { Checkbox } from "@/components/ui/Checkbox" // Using div mockup instead
import { FenceAddon } from "@/lib/types/fencing"
import { cn } from "@/lib/utils"

interface AddonSelectorProps {
    addons: FenceAddon[];
    selectedAddonIds: string[];
    onToggle: (addonId: string) => void;
    lengthMeters: number;
}

export function AddonSelector({ addons, selectedAddonIds, onToggle, lengthMeters }: AddonSelectorProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(val);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addons.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);
                const actualPrice = addon.pricingType === 'perMeter' ? addon.price * lengthMeters : addon.price;

                return (
                    <div
                        key={addon.id}
                        className={cn(
                            "relative flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-all hover:bg-secondary/20",
                            isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-muted"
                        )}
                        onClick={() => onToggle(addon.id)}
                    >
                        <div className="flex h-5 items-center">
                            {/* Simple checkbox mockup since UI Checkbox might need careful import */}
                            <div className={cn(
                                "h-4 w-4 rounded border flex items-center justify-center",
                                isSelected ? "bg-primary border-primary" : "border-muted-foreground"
                            )}>
                                {isSelected && <div className="h-2 w-2 bg-white rounded-full" />}
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold">{addon.name}</span>
                                <Badge variant="outline" className="text-[10px] font-mono">
                                    {addon.pricingType === 'perMeter' ? `${formatCurrency(addon.price)}/m` : "Flat"}
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {addon.pricingType === 'perMeter'
                                    ? `Total: ${formatCurrency(actualPrice)} for ${lengthMeters}m`
                                    : `Fixed fee: ${formatCurrency(addon.price)}`}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}
