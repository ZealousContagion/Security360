import { Decimal } from "@/generated/client/runtime/library";

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
        const unit = item.catalogItem.unit.toLowerCase();
        const rawQty = Number(item.quantityPerMeter) * length;
        const wastage = Number(item.wastageFactor || 1.1);
        
        let finalQty = rawQty * wastage;

        // Intelligent Rounding Logic
        // Whole items must be rounded up to nearest integer
        const wholeUnits = ['each', 'bag', 'post', 'roll', 'item', 'unit'];
        if (wholeUnits.some(u => unit.includes(u))) {
            finalQty = Math.ceil(finalQty);
        } else {
            // Cut-to-size items (like meters) get 2 decimal precision
            finalQty = Math.round(finalQty * 100) / 100;
        }
        
        return {
            name: item.catalogItem.name,
            quantity: finalQty,
            unit: item.catalogItem.unit,
            estimatedCost: finalQty * Number(item.catalogItem.price)
        };
    });

    return {
        subtotal,
        vat,
        total,
        materials
    };
}
