'use server';

import { prisma } from "@/lib/prisma";
import { logAction } from "@/modules/audit/logger";
import { isManager, getDbUser } from "@/lib/rbac";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/client";

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

export async function recordCashPayment(invoiceId: string, amount: number, isDeposit: boolean = true) {
    if (!await isManager()) throw new Error("Unauthorized");
    const user = await getDbUser();

    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { Payments: true }
        });

        if (!invoice) throw new Error("Invoice not found");

        // 1. Create the Payment Record
        await prisma.payment.create({
            data: {
                invoiceId,
                amount: new Prisma.Decimal(amount),
                method: 'CASH',
                status: 'SUCCESS',
                reference: `CASH-${Date.now()}`
            }
        });

        // 2. Recalculate total paid
        const updatedInvoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { Payments: true }
        });

        const totalPaid = updatedInvoice!.Payments
            .filter(p => p.status === 'SUCCESS')
            .reduce((acc, p) => acc.plus(p.amount), new Prisma.Decimal(0));

        // 3. Update Invoice Status
        const newStatus = totalPaid.greaterThanOrEqualTo(invoice.total) ? 'PAID' : 'PARTIAL';
        await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: newStatus }
        });

        // 4. Create Job if it's a deposit and job doesn't exist
        if (isDeposit || newStatus === 'PAID' || newStatus === 'PARTIAL') {
            const existingJob = await prisma.job.findUnique({ where: { invoiceId } });
            if (!existingJob) {
                const tech = await prisma.teamMember.findFirst({
                    where: { role: { contains: 'Technician' }, status: 'ACTIVE' }
                });

                await prisma.job.create({
                    data: {
                        invoiceId,
                        teamMemberId: tech?.id,
                        status: 'SCHEDULED',
                        notes: 'Automatically scheduled from manual cash payment.'
                    }
                });
            }
        }

        await logAction({
            action: 'CASH_PAYMENT_RECORDED',
            entityType: 'Invoice',
            entityId: invoiceId,
            performedBy: user?.email || 'Admin',
            metadata: { amount, isDeposit, status: newStatus }
        });

        revalidatePath("/admin/invoices");
        revalidatePath("/admin/dashboard");
        revalidatePath("/admin/field");
        revalidatePath("/admin/schedule");

        return { success: true };
    } catch (err: any) {
        console.error("Cash Payment Error:", err);
        return { success: false, error: err.message };
    }
}