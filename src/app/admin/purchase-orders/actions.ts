'use server';

import { prisma } from "@/core/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/client";
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
        include: { items: true, supplier: true }
    });

    // If status is RECEIVED, increment stock levels and update price intelligence
    if (status === 'RECEIVED') {
        for (const item of po.items) {
            // 1. Fetch current catalog state
            const catalogItem = await prisma.catalogItem.findUnique({
                where: { id: item.catalogItemId }
            });

            if (catalogItem) {
                const oldPrice = Number(catalogItem.price);
                const newPrice = Number(item.unitPrice);
                const priceChanged = oldPrice !== newPrice;

                // 2. Update stock and potentially price
                await prisma.catalogItem.update({
                    where: { id: item.catalogItemId },
                    data: {
                        stockLevel: {
                            increment: item.quantity
                        },
                        // Automatically update to latest cost
                        price: priceChanged ? item.unitPrice : undefined
                    }
                });

                // 3. If price changed, notify and log
                if (priceChanged) {
                    await prisma.notification.create({
                        data: {
                            type: 'INFO',
                            title: 'Price Update detected',
                            message: `Catalog item "${catalogItem.name}" updated from $${oldPrice} to $${newPrice} based on PO receipt.`,
                        }
                    });

                    await logAction({
                        action: 'PRICE_AUTO_UPDATE',
                        entityType: 'CatalogItem',
                        entityId: catalogItem.id,
                        performedBy: 'System (PO Receipt)',
                        metadata: { oldPrice, newPrice, poId: id }
                    });
                }
            }
        }

        // 4. Create an Expense record for the total PO amount
        await prisma.expense.create({
            data: {
                amount: po.total,
                category: 'Materials',
                description: `Purchase Order Receipt: ${po.id.slice(0, 8).toUpperCase()} (${po.supplier.name})`,
                date: new Date(),
            }
        });

        await logAction({
            action: 'PO_EXPENSE_LOGGED',
            entityType: 'Expense',
            performedBy: 'System',
            metadata: { poId: id, amount: po.total.toString() }
        });
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
