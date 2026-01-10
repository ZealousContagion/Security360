'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ExpenseSchema } from "@/lib/validations";
import { logAction } from "@/modules/audit/logger";
import { getDbUser, checkRole } from "@/lib/rbac";
import { Prisma } from "@prisma/client";

export async function createExpense(formData: FormData) {
    await checkRole(["ADMIN", "MANAGER"]);
    const user = await getDbUser();

    const rawData = {
        category: formData.get("category") as string,
        amount: parseFloat(formData.get("amount") as string),
        description: formData.get("description") as string,
        date: new Date(formData.get("date") as string || Date.now()),
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

    await logAction({
        action: 'CREATE_EXPENSE',
        entityType: 'Expense',
        entityId: expense.id,
        performedBy: user?.email || 'System',
        metadata: { category: expense.category, amount: validation.data.amount }
    });

    revalidatePath("/admin/expenses");
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
