import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import Link from "next/link";
import { Plus, Package, Trash2, PackagePlus, Sparkles, AlertCircle } from "lucide-react";
import { deleteCatalogItem } from "./actions";
import { RestockButton } from "@/components/RestockButton";
import { Badge } from "@/components/ui/Badge";

export default async function CatalogPage() {
    const items = await prisma.catalogItem.findMany({
        orderBy: { createdAt: "desc" },
    });

    const recentlyAdded = items.filter(item => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        return new Date(item.createdAt) > twoDaysAgo;
    }).slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Service Catalog</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Manage fencing materials and services</p>
                </div>
                <Link href="/admin/catalog/new">
                    <Button className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Item
                    </Button>
                </Link>
            </div>

            {/* Recently Added HUD */}
            {recentlyAdded.length > 0 && (
                <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="py-3">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            Recently Added to Inventory
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="flex flex-wrap gap-3">
                            {recentlyAdded.map(item => (
                                <div key={item.id} className="bg-white border border-primary/10 px-3 py-1.5 rounded flex items-center gap-2 shadow-sm">
                                    <p className="text-[9px] font-black uppercase">{item.name}</p>
                                    <Badge className="text-[7px] h-3 px-1 bg-primary text-black border-none font-black">NEW</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Package className="w-4 h-4 text-primary" />
                        Inventory Items
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Name</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Category</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Price</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Stock</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="p-12 text-center text-muted-foreground uppercase text-[10px] tracking-widest">
                                        No items found. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map((item) => {
                                    const isNew = recentlyAdded.some(r => r.id === item.id);
                                    const stock = Number(item.stockLevel);
                                    const isLow = stock <= Number(item.minStockLevel);
                                    const isNegative = stock < 0;

                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold uppercase text-[10px]">{item.name}</span>
                                                    {isNew && <Badge className="text-[7px] h-3 px-1 bg-primary text-black border-none font-black">NEW</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground uppercase">{item.category}</TableCell>
                                            <TableCell className="font-bold">${Number(item.price).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-mono text-xs ${isLow ? 'text-destructive font-bold' : ''}`}>
                                                        {Math.max(0, stock).toString()}
                                                    </span>
                                                    <span className="text-[8px] text-muted-foreground uppercase">{item.unit}</span>
                                                    {isNegative && (
                                                        <div className="group relative">
                                                            <AlertCircle className="w-3 h-3 text-destructive animate-pulse cursor-help" />
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-[8px] p-2 rounded whitespace-nowrap z-50 uppercase font-black tracking-widest">
                                                                Deficit: {Math.abs(stock)} {item.unit}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {item.category !== 'Service' && <RestockButton itemId={item.id} />}
                                                    <form action={deleteCatalogItem.bind(null, item.id)}>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </form>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}