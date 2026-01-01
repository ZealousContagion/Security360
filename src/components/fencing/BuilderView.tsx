"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Calculator, User, ArrowRight, FileText, CheckCircle2, ChevronRight, Map, Ruler, Layers, ArrowLeft, Loader2 } from "lucide-react"
import { TerrainType } from "@/lib/types/fencing"
import { MeterInput } from "@/components/fencing/MeterInput"
import { AddonSelector } from "@/components/fencing/AddonSelector"
import { PricingSummaryCard, PricingBreakdown } from "@/components/fencing/PricingSummaryCard"
import { createQuoteAction, fetchFencingTypesAction, fetchAddonsAction, calculatePriceAction } from "@/lib/actions/fencing"

interface BuilderViewProps {
    onBack: () => void;
}

export function BuilderView({ onBack }: BuilderViewProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [isLoadingData, setIsLoadingData] = React.useState(true)
    const [isCalculating, setIsCalculating] = React.useState(false)

    // Catalog State
    const [fencingTypes, setFencingTypes] = React.useState<any[]>([])
    const [addonsList, setAddonsList] = React.useState<any[]>([])

    // Form State
    const [customerId, setCustomerId] = React.useState("00000000-0000-0000-0000-000000000001") // Placeholder
    const [selectedFencingId, setSelectedFencingId] = React.useState("")
    const [length, setLength] = React.useState(50)
    const [height, setHeight] = React.useState("1.8m")
    const [terrain, setTerrain] = React.useState<TerrainType>("Flat")
    const [selectedAddonIds, setSelectedAddonIds] = React.useState<string[]>([])

    // Pricing Result from Backend
    const [pricingResult, setPricingResult] = React.useState<any>(null)

    // Initial Load
    React.useEffect(() => {
        const loadCatalog = async () => {
            setIsLoadingData(true)
            const [types, addons] = await Promise.all([
                fetchFencingTypesAction(),
                fetchAddonsAction()
            ])
            setFencingTypes(types)
            setAddonsList(addons)
            if (types.length > 0) {
                setSelectedFencingId(types[0].id)
                setHeight(types[0].supportedHeights[0])
            }
            setIsLoadingData(false)
        }
        loadCatalog()
    }, [])

    // Debounced Pricing Calculation
    React.useEffect(() => {
        if (!selectedFencingId || !length) return

        const timer = setTimeout(async () => {
            setIsCalculating(true)
            try {
                const result = await calculatePriceAction({
                    fencingServiceId: selectedFencingId,
                    lengthMeters: length,
                    heightMeters: parseFloat(height),
                    addonIds: selectedAddonIds
                })
                setPricingResult(result)
            } catch (error) {
                console.error("Pricing error:", error)
            } finally {
                setIsCalculating(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [selectedFencingId, length, height, selectedAddonIds, terrain])

    const selectedFencing = fencingTypes.find(f => f.id === selectedFencingId)
    const availableAddons = addonsList // Simplified for production - logic moved to backend

    const pricingItems: PricingBreakdown[] = pricingResult ? [
        { label: "Subtotal (Services & Extras)", amount: pricingResult.subTotal, description: "Calculated by Security 360 Pricing Engine" },
        { label: "VAT (15%)", amount: pricingResult.vat, description: "Standard government tax" }
    ] : []

    const handleToggleAddon = (id: string) => {
        setSelectedAddonIds(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        )
    }

    const handleCreateQuote = async () => {
        try {
            setIsSubmitting(true)
            await createQuoteAction({
                customerId,
                fencingServiceId: selectedFencingId,
                lengthMeters: length,
                heightMeters: parseFloat(height),
                addonIds: selectedAddonIds
            })
            onBack()
        } catch (error) {
            console.error("Failed to create quote:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoadingData) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Connecting to production pricing engine...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
                            <Calculator className="h-5 w-5 md:h-6 md:w-6" /> Quote Builder
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground hidden md:block">Accurate pricing powered by our secure enterprise backend.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Button variant="outline" onClick={onBack} disabled={isSubmitting} className="flex-1 md:flex-none">Cancel</Button>
                    <Button onClick={handleCreateQuote} disabled={isSubmitting || !pricingResult} className="flex-1 md:flex-none">
                        {isSubmitting ? "Generating..." : "Generate Quote"} <ArrowRight className="ml-2 h-4 w-4 hidden md:inline" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="pb-3 border-b mb-4">
                            <div className="flex items-center gap-2 text-primary">
                                <User className="h-5 w-5" />
                                <CardTitle className="text-lg">Step 1: Customer & Material</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Customer</label>
                                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm items-center justify-between">
                                        <span className="font-medium text-primary">Greenwood Estate Management</span>
                                        <Badge variant="outline" className="text-[10px]">Verified</Badge>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Material / Service</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={selectedFencingId}
                                        onChange={(e) => {
                                            setSelectedFencingId(e.target.value)
                                            setSelectedAddonIds([])
                                        }}
                                    >
                                        {fencingTypes.map(f => (
                                            <option key={f.id} value={f.id}>{f.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <MeterInput
                                    label="Fence Length"
                                    value={length}
                                    onChange={(e) => setLength(Number(e.target.value))}
                                />
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <Ruler className="h-3 w-3" /> Height
                                    </label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                    >
                                        {selectedFencing?.supportedHeights?.map((h: string) => (
                                            <option key={h} value={h}>{h}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium flex items-center gap-1">
                                        <Map className="h-3 w-3" /> Terrain
                                    </label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        value={terrain}
                                        onChange={(e) => setTerrain(e.target.value as TerrainType)}
                                    >
                                        <option value="Flat">Flat (Standard)</option>
                                        <option value="Sloped">Sloped (Structural Adjustment)</option>
                                        <option value="Rocky">Rocky (Excavation Grade)</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 border-b mb-4">
                            <div className="flex items-center gap-2 text-primary">
                                <Layers className="h-5 w-5" />
                                <CardTitle className="text-lg">Step 2: Security & Extras</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <AddonSelector
                                addons={availableAddons}
                                selectedAddonIds={selectedAddonIds}
                                onToggle={handleToggleAddon}
                                lengthMeters={length}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="relative">
                        {isCalculating && (
                            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-xl">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        )}
                        <PricingSummaryCard
                            items={pricingItems}
                            total={pricingResult?.total || 0}
                        />
                    </div>

                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold text-primary/70 uppercase tracking-wider">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Security Check
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                            All pricing is being calculated in real-time by the Security 360 Core Engine.
                            Manual overrides are only permitted for Senior Admin roles and are logged in the audit trail.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
