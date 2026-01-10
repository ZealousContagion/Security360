import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { ShoppingCart, Plus, Truck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function PurchaseOrdersPage() {
    const pos = await prisma.purchaseOrder.findMany({
        include: { supplier: true, items: true },
        orderBy: { createdAt: 'desc' }
    });

    const lowStockItems = await prisma.catalogItem.findMany({
        where: {
            category: { not: 'Service' },
            stockLevel: { lte: prisma.catalogItem.fields.minStockLevel }
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-black">Purchase Orders</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Inventory replenishment and supplier management</p>
                </div>
                <Button className="text-[10px] uppercase tracking-[0.2em] font-black h-12 px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    New Purchase Order
                </Button>
            </div>

            {/* Low Stock HUD */}
            {lowStockItems.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                    <Card className="border-destructive/20 bg-destructive/[0.02]">
                        <CardHeader className="py-3 flex flex-row items-center justify-between">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-destructive flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3" />
                                Critical Stock Shortages
                            </CardTitle>
                            <Badge variant="destructive" className="text-[8px] h-4 uppercase">{lowStockItems.length} Items Low</Badge>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="flex flex-wrap gap-3">
                                {lowStockItems.map(item => (
                                    <div key={item.id} className="bg-white border border-destructive/10 px-3 py-1.5 rounded flex items-center gap-3 shadow-sm">
                                        <p className="text-[9px] font-black uppercase">{item.name}</p>
                                        <div className="h-3 w-[1px] bg-border" />
                                        <p className="text-[10px] font-black text-destructive">{Number(item.stockLevel)} {item.unit}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-primary" />
                            Recent Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="uppercase text-[10px] tracking-widest font-bold">PO Ref</TableHead>
                                    <TableHead className="uppercase text-[10px] tracking-widest font-bold">Supplier</TableHead>
                                    <TableHead className="uppercase text-[10px] tracking-widest font-bold">Date</TableHead>
                                    <TableHead className="uppercase text-[10px] tracking-widest font-bold text-center">Items</TableHead>
                                    <TableHead className="uppercase text-[10px] tracking-widest font-bold">Total</TableHead>
                                    <TableHead className="uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
                                    <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pos.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="p-12 text-center text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                                            No purchase orders found.
                                        </TableCell>
                                    </TableRow>
                                ) : pos.map((po) => (
                                    <TableRow key={po.id}>
                                        <TableCell className="font-mono text-[10px] font-black">{po.id.slice(0, 8).toUpperCase()}</TableCell>
                                        <TableCell className="uppercase text-[10px] font-bold tracking-tight">{po.supplier.name}</TableCell>
                                        <TableCell className="text-[10px] text-muted-foreground uppercase">{new Date(po.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-center font-bold text-xs">{po.items.length}</TableCell>
                                        <TableCell className="font-black text-xs">£{Number(po.total).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={po.status === 'RECEIVED' ? 'success' : 'outline'} className="uppercase text-[8px] tracking-tighter">
                                                {po.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                <Truck className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Senior Engineer Strategic Note */}
            <div className="bg-black text-white p-8 rounded-2xl flex items-start gap-6 shadow-2xl">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <ShoppingCart className="text-black w-6 h-6" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Supply Chain Optimization</h4>
                    <p className="text-sm mt-3 leading-relaxed text-slate-300">
                        Purchase Orders enable us to track <span className="text-white font-bold">COGS (Cost of Goods Sold)</span> accurately. By linking POs to our Service Catalog, we ensure that every material purchase is logged and reflected in our final profit margin analysis.
                    </p>
                </div>
            </div>
        </div>
    );
}
