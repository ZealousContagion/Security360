"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, Search, MoreHorizontal, Edit2, Trash2, Puzzle, Settings } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { fetchAddonsAction } from "@/lib/actions/fencing"

export function AddonsView() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [addons, setAddons] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const loadAddons = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await fetchAddonsAction()
            setAddons(data)
        } catch (error) {
            console.error("Failed to load addons:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadAddons()
    }, [loadAddons])

    const filtered = (addons || []).filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(val);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-primary">Supplementary Items</h3>
                    <p className="text-muted-foreground">Manage extra features and installation options.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Add-on
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search supplementary items..."
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
                                    <TableHead>Add-on Description</TableHead>
                                    <TableHead>Pricing Model</TableHead>
                                    <TableHead>Unit Price</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            Syncing supplementary catalog...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length > 0 ? (
                                    filtered.map((item) => (
                                        <TableRow key={item.id} className="group hover:bg-primary/5 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Puzzle className="h-4 w-4 text-primary" />
                                                    <div className="font-bold text-primary">{item.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="uppercase text-[10px]">
                                                    {item.type === 'per_meter' ? 'Per Meter' : 'Flat Selection'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono font-bold text-primary">
                                                {formatCurrency(item.price)}{item.type === 'per_meter' ? '/m' : ''}
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
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground italic">
                                            No supplementary items found.
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
