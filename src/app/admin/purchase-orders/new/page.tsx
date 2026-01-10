import React from 'react';
import { prisma } from '@/lib/prisma';
import PurchaseOrderForm from './PurchaseOrderForm';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewPurchaseOrderPage() {
    const suppliers = await prisma.supplier.findMany({
        orderBy: { name: 'asc' }
    });

    const catalogItems = await prisma.catalogItem.findMany({
        where: { category: { not: 'Service' } },
        orderBy: { name: 'asc' }
    });

    // Explicitly cast to simple types for client component
    const serializedSuppliers = suppliers.map(s => ({ id: s.id, name: s.name }));
    const serializedCatalogItems = catalogItems.map(ci => ({
        id: ci.id,
        name: ci.name,
        price: Number(ci.price),
        unit: ci.unit
    }));

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <Link href="/admin/purchase-orders" className="flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-4 transition-colors">
                        <ChevronLeft className="w-3 h-3 mr-1" />
                        Back to Orders
                    </Link>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-black">New Purchase Order</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Initialize supply chain procurement</p>
                </div>
            </div>

            <PurchaseOrderForm 
                suppliers={serializedSuppliers} 
                catalogItems={serializedCatalogItems} 
            />
        </div>
    );
}
