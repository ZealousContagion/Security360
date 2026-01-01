"use server"

import { revalidatePath } from "next/cache"
import { apiFetch } from "@/lib/api-client"

export async function fetchProductsAction() {
    try {
        return await apiFetch<any[]>("/products");
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}

export async function createProductAction(data: {
    name: string;
    description: string;
    price: number;
    sku?: string;
    category: string;
}) {
    const product = await apiFetch<any>("/products", {
        method: "POST",
        body: JSON.stringify(data)
    });
    revalidatePath("/admin/catalog");
    return product;
}
