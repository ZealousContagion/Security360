"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { LayoutGrid, Calculator, FileText, Settings, Package, ClipboardList } from "lucide-react"
import { QuotesView } from "@/components/fencing/QuotesView"
import { CatalogView } from "@/components/fencing/CatalogView"
import { AddonsView } from "@/components/fencing/AddonsView"
import { BuilderView } from "@/components/fencing/BuilderView"

type ViewMode = "LIST" | "BUILDER";
type ActiveTab = "QUOTES" | "CATALOG" | "ADDONS";

export default function FencingHubPage() {
    const [viewMode, setViewMode] = React.useState<ViewMode>("LIST")
    const [activeTab, setActiveTab] = React.useState<ActiveTab>("QUOTES")

    if (viewMode === "BUILDER") {
        return (
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <BuilderView onBack={() => setViewMode("LIST")} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <LayoutGrid className="h-8 w-8 text-primary" /> Fencing Management Hub
                    </h2>
                    <p className="text-muted-foreground">Manage quotes, materials, and pricing from one seamless interface.</p>
                </div>
                <div className="flex bg-secondary/20 p-1 rounded-lg border border-primary/10 overflow-x-auto no-scrollbar whitespace-nowrap max-w-full">
                    <Button
                        variant={activeTab === "QUOTES" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("QUOTES")}
                        className="rounded-md h-9 px-4 shrink-0"
                    >
                        <ClipboardList className="mr-2 h-4 w-4" /> Quotes
                    </Button>
                    <Button
                        variant={activeTab === "CATALOG" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("CATALOG")}
                        className="rounded-md h-9 px-4 shrink-0"
                    >
                        <Package className="mr-2 h-4 w-4" /> Materials
                    </Button>
                    <Button
                        variant={activeTab === "ADDONS" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("ADDONS")}
                        className="rounded-md h-9 px-4 shrink-0"
                    >
                        <Settings className="mr-2 h-4 w-4" /> Add-ons
                    </Button>
                </div>
            </div>

            <div className="animate-in fade-in duration-500">
                {activeTab === "QUOTES" && (
                    <QuotesView onNewQuote={() => setViewMode("BUILDER")} />
                )}
                {activeTab === "CATALOG" && (
                    <CatalogView />
                )}
                {activeTab === "ADDONS" && (
                    <AddonsView />
                )}
            </div>
        </div>
    )
}
