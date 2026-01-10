'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/modules/audit/logger";
import { getDbUser } from "@/lib/rbac";
import { Prisma } from "@prisma/client";

export async function completeJob(jobId: string) {
    const user = await getDbUser();

    try {
        // 1. Fetch deep Job data
        const job = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
                invoice: {
                    include: {
                        quote: {
                            include: {
                                fencingService: {
                                    include: {
                                        BillOfMaterials: {
                                            include: { catalogItem: true }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!job || !job.invoice.quote) throw new Error("Job or Quote not found");
        if (job.status === 'COMPLETED') return { success: true, message: 'Already completed' };

        const quote = job.invoice.quote;
        const bom = quote.fencingService.BillOfMaterials;

        // 2. Decrement Inventory
        for (const item of bom) {
            const rawQty = Number(item.quantityPerMeter) * Number(quote.lengthMeters);
            const qtyWithWastage = Math.ceil(rawQty * Number(item.wastageFactor || 1.1));

            await prisma.catalogItem.update({
                where: { id: item.catalogItemId },
                data: {
                    stockLevel: {
                        decrement: new Prisma.Decimal(qtyWithWastage)
                    }
                }
            });

            // Log stock decrement
            await logAction({
                action: 'STOCK_DECREMENT',
                entityType: 'CatalogItem',
                entityId: item.catalogItemId,
                metadata: {
                    jobId,
                    qtyDecremented: qtyWithWastage,
                    reason: 'Job Completion'
                }
            });
        }

        // 3. Update Job Status
        await prisma.job.update({
            where: { id: jobId },
            data: {
                status: 'COMPLETED',
                completedAt: new Date()
            }
        });

        // 4. Final Log
        await logAction({
            action: 'JOB_COMPLETED',
            entityType: 'Job',
            entityId: jobId,
            performedBy: user?.email || 'Field Tech'
        });

        revalidatePath("/admin/field");
        revalidatePath("/admin/catalog");
        revalidatePath("/admin/dashboard");

        return { success: true };
    } catch (error: any) {
        console.error("Job Completion Error:", error);
        return { success: false, error: error.message };
    }
}
