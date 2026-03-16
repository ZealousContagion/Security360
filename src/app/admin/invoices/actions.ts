'use server';

import { prisma } from "@/lib/prisma";
import { sendPaymentReminder } from "@/lib/messaging";
import { revalidatePath } from "next/cache";
import { logAction } from "@/modules/audit/logger";
import { getDbUser } from "@/lib/rbac";

export async function sendBulkOverdueReminders() {
    const user = await getDbUser();
    
    // Find all pending invoices older than 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const overdueInvoices = await prisma.invoice.findMany({
        where: {
            status: 'PENDING',
            issuedAt: { lte: sevenDaysAgo }
        }
    });

    let count = 0;
    for (const inv of overdueInvoices) {
        const res = await sendPaymentReminder(inv.id);
        if (res.success) count++;
    }

    if (count > 0) {
        await logAction({
            action: 'BULK_REMINDERS_SENT',
            entityType: 'Invoice',
            performedBy: user?.email || 'System',
            metadata: { count }
        });
    }

    revalidatePath("/admin/invoices");
    revalidatePath("/admin/dashboard");

    return { success: true, count };
}

export async function recordCashPayment(invoiceId: string, amount: number, isDeposit: boolean = false) {
    const user = await getDbUser();

    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { customer: true }
        });

        if (!invoice) throw new Error("Invoice not found");

        // 1. Create Payment Record
        await prisma.payment.create({
            data: {
                invoiceId,
                amount: amount,
                method: 'CASH',
                status: 'COMPLETED',
                reference: `CASH-${isDeposit ? 'DEP' : 'FULL'}-${new Date().getTime()}`
            }
        });

        // 2. Update Invoice Status
        await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: isDeposit ? 'PARTIAL' : 'PAID' }
        });

        // 3. Log Action
        await logAction({
            action: 'CASH_PAYMENT_RECORDED',
            entityType: 'Invoice',
            entityId: invoiceId,
            performedBy: user?.email || 'Admin',
            metadata: { amount, invoiceNumber: invoice.invoiceNumber, type: isDeposit ? 'DEPOSIT' : 'FULL' }
        });

        revalidatePath("/admin/invoices");
        revalidatePath("/admin/dashboard");

        return { success: true };
    } catch (error: any) {
        console.error("Cash Payment Error:", error);
        return { success: false, error: error.message };
    }
}
