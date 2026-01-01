"use server"

import { revalidatePath } from "next/cache"
import { apiFetch } from "@/lib/api-client"

export async function fetchCustomersAction() {
    try {
        return await apiFetch<any[]>("/customers");
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        return [];
    }
}

export async function fetchCustomerByIdAction(id: string) {
    try {
        return await apiFetch<any>(`/customers/${id}`);
    } catch (error) {
        console.error(`Failed to fetch customer ${id}:`, error);
        return null;
    }
}

export async function createCustomerAction(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    vatNumber?: string;
}) {
    const customer = await apiFetch<any>("/customers", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidatePath("/admin/customers");
    return customer;
}
