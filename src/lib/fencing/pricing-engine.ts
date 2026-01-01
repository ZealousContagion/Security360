import { FENCING_TYPES, FENCE_ADDONS } from "@/lib/mock-fencing-data"
import { TerrainType } from "@/lib/types/fencing"

export interface PricingBreakdownItem {
    label: string;
    amount: number;
    description?: string;
}

export interface PricingResult {
    breakdown: PricingBreakdownItem[];
    subtotal: number;
    vat: number;
    total: number;
}

export function calculateFencePrice(params: {
    fencingTypeId: string;
    length: number;
    terrain: TerrainType;
    selectedAddonIds: string[];
}): PricingResult {
    const selectedFencing = FENCING_TYPES.find(f => f.id === params.fencingTypeId);
    if (!selectedFencing) throw new Error("Fencing type not found");

    const baseCost = params.length * selectedFencing.basePricePerMeter;
    const terrainMultiplier = params.terrain === 'Rocky' ? 1.25 : params.terrain === 'Sloped' ? 1.1 : 1.0;
    const adjustedBaseCost = baseCost * terrainMultiplier;

    const addonsCost = params.selectedAddonIds.reduce((sum, id) => {
        const addon = FENCE_ADDONS.find(a => a.id === id);
        if (!addon) return sum;
        return sum + (addon.pricingType === 'perMeter' ? addon.price * params.length : addon.price);
    }, 0);

    const installationFee = selectedFencing.installationFeeFlat;
    const subtotal = adjustedBaseCost + addonsCost + installationFee;
    const vatAmount = subtotal * 0.16;
    const totalAmount = subtotal + vatAmount;

    const breakdown: PricingBreakdownItem[] = [
        {
            label: "Base Materials",
            amount: adjustedBaseCost,
            description: `${params.length}m @ ${selectedFencing.basePricePerMeter}/m ${params.terrain !== 'Flat' ? `(${params.terrain} terrain)` : ''}`
        },
        {
            label: "Selected Add-ons",
            amount: addonsCost,
            description: `${params.selectedAddonIds.length} items configured`
        },
        {
            label: "Installation Fee",
            amount: installationFee,
            description: "Fixed labor charge"
        },
        {
            label: "VAT (16%)",
            amount: vatAmount
        }
    ];

    return {
        breakdown,
        subtotal,
        vat: vatAmount,
        total: totalAmount
    };
}
