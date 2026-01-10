'use server';

import { prisma } from "@/core/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { PurchaseOrderSchema } from "@/lib/validations";
import { logAction } from "@/modules/audit/logger";
import { getDbUser } from "@/lib/rbac";

export async function createPurchaseOrder(data: any) {
    const user = await getDbUser();
    
    const validation = PurchaseOrderSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Validation failed: " + JSON.stringify(validation.error.flatten().fieldErrors));
    }

    const { supplierId, items } = validation.data;

    const total = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    const po = await prisma.purchaseOrder.create({
        data: {
            supplierId,
            status: 'DRAFT',
            total: new Prisma.Decimal(total),
            items: {
                create: items.map(item => ({
                    catalogItemId: item.catalogItemId,
                    quantity: new Prisma.Decimal(item.quantity),
                    unitPrice: new Prisma.Decimal(item.unitPrice),
                    totalPrice: new Prisma.Decimal(item.quantity * item.unitPrice),
                }))
            }
        }
    });

    await logAction({
        action: 'CREATE_PURCHASE_ORDER',
        entityType: 'PurchaseOrder',
        entityId: po.id,
        performedBy: user?.email || 'System',
        metadata: { supplierId, itemCount: items.length, total }
    });

    revalidatePath("/admin/purchase-orders");
    redirect("/admin/purchase-orders");
}

export async function updatePurchaseOrderStatus(id: string, status: string) {
    const user = await getDbUser();
    
    const po = await prisma.purchaseOrder.update({
        where: { id },
        data: { status },
        include: { items: true }
    });

    // If status is RECEIVED, increment stock levels
    if (status === 'RECEIVED') {
        for (const item of po.items) {
            await prisma.catalogItem.update({
                where: { id: item.catalogItemId },
                data: {
                    stockLevel: {
                        increment: item.quantity
                    }
                }
            });
        }
    }

    await logAction({
        action: 'UPDATE_PO_STATUS',
        entityType: 'PurchaseOrder',
        entityId: id,
        performedBy: user?.email || 'System',
        metadata: { newStatus: status }
    });

    revalidatePath("/admin/purchase-orders");
    revalidatePath("/admin/catalog");
}
