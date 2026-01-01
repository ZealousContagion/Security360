"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, Search, Tag, MoreHorizontal, Edit2, Trash2, Package, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { fetchProductsAction } from "@/lib/actions/products"

export default function CatalogPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [products, setProducts] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const loadProducts = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await fetchProductsAction()
            setProducts(data)
        } catch (error) {
            console.error("Failed to load catalog:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadProducts()
    }, [loadProducts])

    const filtered = products.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(val);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <Package className="h-8 w-8 text-primary/80" /> Enterprise Catalog
                    </h2>
                    <p className="text-muted-foreground">Manage your production-ready services and hardware inventory.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Standard Item
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search SKU or name..."
                        className="pl-8 focus-visible:ring-primary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle>Catalog Master List</CardTitle>
                    <CardDescription>Consolidated inventory for swift invoicing and quoting.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[300px]">Strategic Item</TableHead>
                                    <TableHead>Market Category</TableHead>
                                    <TableHead>Price Level</TableHead>
                                    <TableHead className="hidden lg:table-cell">Product Details</TableHead>
                                    <TableHead className="text-right">Management</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="text-muted-foreground animate-pulse font-medium">Fetching Catalog Data...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            The enterprise catalog is currently offline or empty.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((item) => (
                                        <TableRow key={item.id} className="group hover:bg-primary/5 transition-colors border-b last:border-0">
                                            <TableCell className="py-4">
                                                <div className="font-bold text-slate-800">{item.name}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono uppercase">SKU: {item.sku || "N/A"}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-semibold bg-primary/10 text-primary border-none text-[10px] uppercase tracking-wider">
                                                    <Tag className="mr-1 h-3 w-3" /> {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono font-bold text-primary">{formatCurrency(item.price)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate hidden lg:table-cell italic">
                                                {item.description}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all">
                                                    <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary"><Edit2 className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
