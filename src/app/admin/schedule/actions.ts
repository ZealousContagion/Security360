'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/modules/audit/logger";
import { getDbUser } from "@/lib/rbac";

export async function scheduleJob(jobId: string, date: Date) {
    const user = await getDbUser();

    try {
        const job = await prisma.job.update({
            where: { id: jobId },
            data: { 
                scheduledDate: date,
                status: 'SCHEDULED'
            },
            include: {
                invoice: { include: { customer: true } }
            }
        });

        await logAction({
            action: 'JOB_SCHEDULED',
            entityType: 'Job',
            entityId: jobId,
            performedBy: user?.email || 'Admin',
            metadata: { 
                date: date.toISOString(),
                customer: job.invoice.customer.name
            }
        });

        revalidatePath("/admin/schedule");
        revalidatePath("/admin/field");
        
        return { success: true };
    } catch (error: any) {
        console.error("Scheduling Error:", error);
        return { success: false, error: error.message };
    }
}
