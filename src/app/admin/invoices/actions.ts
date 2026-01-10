'use server';

import { prisma } from "@/lib/prisma";
import { logAction } from "@/modules/audit/logger";
import { isManager, getDbUser } from "@/lib/rbac";

export async function sendOverdueReminders() {
    if (!await isManager()) throw new Error("Unauthorized");
    const user = await getDbUser();

    try {
        const overdue = await prisma.invoice.findMany({
            where: {
                status: 'PENDING',
                issuedAt: {
                    lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
                }
            },
            include: { customer: true }
        });

        for (const inv of overdue) {
            // Logic to send email would go here (similar to sendQuoteEmail)
            console.log(`Sending reminder for INV ${inv.invoiceNumber} to ${inv.customer.name}`);
        }

        await logAction({
            action: 'BULK_OVERDUE_REMINDERS',
            entityType: 'Invoice',
            performedBy: user?.email || 'Admin',
            metadata: { count: overdue.length }
        });

        return { success: true, count: overdue.length };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
