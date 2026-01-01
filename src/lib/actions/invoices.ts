"use server"

import { revalidatePath } from "next/cache"
import { apiFetch } from "@/lib/api-client"

export async function fetchInvoicesAction() {
    try {
        return await apiFetch<any[]>("/invoices");
    } catch (error) {
        console.error("Failed to fetch invoices:", error);
        return [];
    }
}

export async function createInvoiceAction(data: {
    customerId: string;
    issueDate: string;
    dueDate: string;
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
    }[];
}) {
    const invoice = await apiFetch<any>("/invoices", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidatePath("/admin/invoices");
    return invoice;
}
