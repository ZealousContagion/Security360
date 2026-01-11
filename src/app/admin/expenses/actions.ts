'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ExpenseSchema } from "@/lib/validations";
import { logAction } from "@/modules/audit/logger";
import { getDbUser, checkRole } from "@/lib/rbac";
import { Prisma } from "@/generated/client";

export async function createExpense(formData: FormData) {
    await checkRole(["ADMIN", "MANAGER"]);
    const user = await getDbUser();

    const jobId = formData.get("jobId") as string || undefined;

    const rawData = {
        category: formData.get("category") as string,
        amount: parseFloat(formData.get("amount") as string),
        description: formData.get("description") as string,
        date: new Date(formData.get("date") as string || Date.now()),
        jobId: jobId === 'none' ? undefined : jobId,
    };

    const validation = ExpenseSchema.safeParse(rawData);
    if (!validation.success) {
        throw new Error("Validation failed: " + JSON.stringify(validation.error.flatten().fieldErrors));
    }

    const expense = await prisma.expense.create({
        data: {
            ...validation.data,
            amount: new Prisma.Decimal(validation.data.amount),
        },
    });

    // --- Profitability Red-Alert Logic ---
    if (validation.data.jobId) {
        const job = await prisma.job.findUnique({
            where: { id: validation.data.jobId },
            include: { 
                expenses: true,
                invoice: { include: { quote: true } }
            }
        });

        if (job && job.invoice.quote) {
            const revenue = Number(job.invoice.total);
            const totalExpenses = job.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
            const currentMargin = ((revenue - totalExpenses) / revenue) * 100;

            if (currentMargin < 15) {
                await prisma.notification.create({
                    data: {
                        type: 'WARNING',
                        title: 'PROFITABILITY ALERT',
                        message: `Project for ${job.invoice.customerId} has dropped to ${Math.round(currentMargin)}% margin. (Job: ${job.id.slice(0, 8).toUpperCase()})`,
                    }
                });

                await logAction({
                    action: 'MARGIN_ALERT_TRIGGERED',
                    entityType: 'Job',
                    entityId: job.id,
                    performedBy: 'System',
                    metadata: { currentMargin, revenue, totalExpenses }
                });
            }
        }
    }

    await logAction({
        action: 'CREATE_EXPENSE',
        entityType: 'Expense',
        entityId: expense.id,
        performedBy: user?.email || 'System',
        metadata: { category: expense.category, amount: validation.data.amount, jobId: validation.data.jobId }
    });

    revalidatePath("/admin/expenses");
    revalidatePath("/admin/field");
    redirect("/admin/expenses");
}

export async function deleteExpense(id: string) {
    await checkRole(["ADMIN"]);
    const user = await getDbUser();

    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) throw new Error("Expense not found");

    await prisma.expense.delete({ where: { id } });

    await logAction({
        action: 'DELETE_EXPENSE',
        entityType: 'Expense',
        entityId: id,
        performedBy: user?.email || 'System',
        metadata: { category: expense.category, amount: expense.amount.toString() }
    });

    revalidatePath("/admin/expenses");
}