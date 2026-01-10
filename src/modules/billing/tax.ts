import { prisma } from "@/core/database";
import { Prisma } from "@prisma/client";

export const DEFAULT_TAX_RATE = 0.15;
export const DEFAULT_TAX_NAME = "VAT";

export interface TaxSettings {
    name: string;
    rate: number;
}

/**
 * Fetches the active tax configuration.
 * Considers the first found tax config as the global source of truth for now.
 */
export async function getTaxSettings(): Promise<TaxSettings> {
    const config = await prisma.taxConfig.findFirst({
        orderBy: { updatedAt: 'desc' }
    });

    if (!config) {
        return {
            name: DEFAULT_TAX_NAME,
            rate: DEFAULT_TAX_RATE
        };
    }

    return {
        name: config.name,
        rate: Number(config.rate)
    };
}

/**
 * Updates or creates the tax configuration.
 * Uses a single record approach for global settings.
 */
export async function updateTaxSettings(name: string, rate: number) {
    // Check if exists
    const existing = await prisma.taxConfig.findFirst({
        orderBy: { updatedAt: 'desc' }
    });

    if (existing) {
        return prisma.taxConfig.update({
            where: { id: existing.id },
            data: {
                name,
                rate: new Prisma.Decimal(rate),
            }
        });
    } else {
        return prisma.taxConfig.create({
            data: {
                name,
                rate: new Prisma.Decimal(rate),
                isActive: true
            }
        });
    }
}

/**
 * Calculates tax amount and total.
 * @param amount Base amount
 * @param taxRate Tax rate (e.g., 0.15 for 15%)
 */
export function calculateTaxExact(amount: number | Prisma.Decimal, taxRate: number) {
    const base = new Prisma.Decimal(amount);
    const rate = new Prisma.Decimal(taxRate);
    const taxAmount = base.mul(rate);
    const total = base.add(taxAmount);

    return {
        taxAmount,
        total
    };
}
