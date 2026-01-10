import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import Link from "next/link";
import { Plus, Package, Trash2, PackagePlus } from "lucide-react";
import { deleteCatalogItem } from "./actions";
import { RestockButton } from "@/components/RestockButton";

export default async function CatalogPage() {
    const items = await prisma.catalogItem.findMany({
        orderBy: { createdAt: "desc" },
    });

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
                                items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-bold uppercase text-[10px]">{item.name}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground uppercase">{item.category}</TableCell>
                                        <TableCell className="font-bold">£{Number(item.price).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`font-mono text-xs ${Number(item.stockLevel) <= Number(item.minStockLevel) ? 'text-destructive font-bold' : ''}`}>
                                                    {Number(item.stockLevel).toString()}
                                                </span>
                                                <span className="text-[8px] text-muted-foreground uppercase">{item.unit}</span>
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}