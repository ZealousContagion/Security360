import { Decimal } from "@prisma/client/runtime/library";

export interface MaterialEstimation {
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
}

export interface QuoteEstimation {
    subtotal: number;
    vat: number;
    total: number;
    materials: MaterialEstimation[];
}

/**
 * Advanced Quoting Logic
 * Calculates costs and material requirements including wastage factors.
 */
export function estimateQuote(
    basePricePerMeter: number,
    length: number,
    height: number,
    terrainFactor: number,
    installationFee: number,
    bom: any[] = [],
    vatRate: number = 0.15
): QuoteEstimation {
    // Base cost calculation
    const heightFactor = height / 1.8; // Assume 1.8m is standard
    const adjustedMeterPrice = basePricePerMeter * terrainFactor * heightFactor;
    const subtotal = (adjustedMeterPrice * length) + installationFee;
    
    const vat = subtotal * vatRate;
    const total = subtotal + vat;

    // Material estimation based on BOM
    const materials: MaterialEstimation[] = bom.map(item => {
        const rawQty = item.quantityPerMeter * length;
        const qtyWithWastage = Math.ceil(rawQty * Number(item.wastageFactor || 1.1));
        
        return {
            name: item.catalogItem.name,
            quantity: qtyWithWastage,
            unit: item.catalogItem.unit,
            estimatedCost: qtyWithWastage * Number(item.catalogItem.price)
        };
    });

    return {
        subtotal,
        vat,
        total,
        materials
    };
}
