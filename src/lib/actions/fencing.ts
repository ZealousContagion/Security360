"use server"

import { revalidatePath } from "next/cache"
import { apiFetch } from "@/lib/api-client"

export async function createQuoteAction(formData: {
    customerId: string;
    fencingServiceId: string;
    lengthMeters: number;
    heightMeters: number;
    addonIds: string[];
}) {
    const quote = await apiFetch<any>("/fencing-quotes", {
        method: "POST",
        body: JSON.stringify(formData)
    });

    revalidatePath("/admin/fencing");
    revalidatePath("/admin/fencing-management");
    return quote;
}

export async function calculatePriceAction(formData: {
    fencingServiceId: string;
    lengthMeters: number;
    heightMeters: number;
    addonIds: string[];
}) {
    return await apiFetch<any>("/fencing-quotes/calculate", {
        method: "POST",
        body: JSON.stringify(formData)
    });
}

export async function fetchQuotesAction() {
    try {
        return await apiFetch<any[]>("/fencing-quotes");
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
        return [];
    }
}

export async function convertToInvoiceAction(quoteId: string) {
    await apiFetch(`/fencing-quotes/${quoteId}/invoice`, {
        method: "POST"
    });

    revalidatePath("/admin/fencing");
    revalidatePath("/admin/invoices");
    return true;
}

export async function approveQuoteAction(quoteId: string) {
    await apiFetch(`/fencing-quotes/${quoteId}/approve`, {
        method: "POST"
    });

    revalidatePath("/admin/fencing");
    return true;
}

export async function fetchFencingTypesAction() {
    try {
        const services = await apiFetch<any[]>("/catalog/services");
        // Map backend entities to frontend expected structures if needed
        return services.map(s => ({
            id: s.id,
            name: s.name,
            basePrice: s.pricePerMeter,
            installationFee: s.installationFee,
            supportedHeights: ["1.2m", "1.5m", "1.8m", "2.1m", "2.4m"], // Mocking heights for now
            supportsElectric: s.supportsElectric,
            supportsRazor: s.supportsRazor
        }));
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return [];
    }
}

export async function fetchAddonsAction() {
    try {
        const addons = await apiFetch<any[]>("/catalog/addons");
        return addons.map(a => ({
            id: a.id,
            name: a.name,
            price: a.price,
            type: a.pricingType.toLowerCase() === 'flat' ? 'flat' : 'per_meter',
            description: a.name
        }));
    } catch (error) {
        console.error("Failed to fetch addons:", error);
        return [];
    }
}

export async function fetchInvoiceAction(id: string) {
    // In a real system, this would call /api/invoices/{id}
    // For now, we remain compatible with existing structure
    return null;
}
