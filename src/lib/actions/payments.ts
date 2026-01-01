"use server"

import { revalidatePath } from "next/cache"
import { apiFetch } from "@/lib/api-client"

export async function fetchPaymentsAction() {
    try {
        return await apiFetch<any[]>("/payments");
    } catch (error) {
        console.error("Failed to fetch payments:", error);
        return [];
    }
}

export async function createPaymentAction(data: {
    invoiceId: string;
    amount: number;
    method: string;
    transactionId?: string;
    notes?: string;
}) {
    const payment = await apiFetch<any>("/payments", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidatePath("/admin/payments");
    revalidatePath("/admin/invoices");
    return payment;
}

export async function fetchExpensesAction() {
    try {
        return await apiFetch<any[]>("/expenses");
    } catch (error) {
        console.error("Failed to fetch expenses:", error);
        return [];
    }
}

export async function createExpenseAction(data: {
    description: string;
    amount: number;
    category: string;
    date: string;
    status: string;
    reference?: string;
}) {
    const expense = await apiFetch<any>("/expenses", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidatePath("/admin/expenses");
    return expense;
}
