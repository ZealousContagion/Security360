"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, Search, Tag, MoreHorizontal, Edit2, Trash2, Package, Check, X, ShieldAlert, Zap } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { fetchFencingTypesAction } from "@/lib/actions/fencing"

export function CatalogView() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [services, setServices] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const loadServices = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await fetchFencingTypesAction()
            setServices(data)
        } catch (error) {
            console.error("Failed to load services:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadServices()
    }, [loadServices])

    const filtered = (services || []).filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(val);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-primary">Service Catalog</h3>
                    <p className="text-muted-foreground">Manage materials and production rates stored in PostgreSQL.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Material
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search materials..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Material Name</TableHead>
                                    <TableHead>Base Rate</TableHead>
                                    <TableHead>Supported Heights</TableHead>
                                    <TableHead>Security Options</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            Connecting to backend catalog...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length > 0 ? (
                                    filtered.map((item) => (
                                        <TableRow key={item.id} className="group hover:bg-primary/5 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="font-bold text-primary">{item.name}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">ID: {item.id.split('-')[0]}</div>
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                <div className="font-bold text-primary">{formatCurrency(item.basePrice)}/m</div>
                                                <div className="text-[10px] text-muted-foreground">+{formatCurrency(item.installationFee)} install fee</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {(item.supportedHeights || []).map((h: string) => (
                                                        <Badge key={h} variant="secondary" className="text-[10px] px-1.5 py-0">
                                                            {h}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    {item.supportsElectric && (
                                                        <div className="flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold gap-1" title="Supports Electric">
                                                            <Zap className="h-3 w-3" /> ELEC
                                                        </div>
                                                    )}
                                                    {item.supportsRazor && (
                                                        <div className="flex items-center text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded text-[10px] font-bold gap-1" title="Supports Razor Wire">
                                                            <ShieldAlert className="h-3 w-3" /> RAZOR
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="icon"><Edit2 className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            No materials found in the catalog.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
