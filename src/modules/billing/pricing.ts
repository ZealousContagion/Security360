import { Prisma } from '@/generated/client';
const { Decimal } = Prisma;
type DecimalType = Prisma.Decimal;

export interface PricingInput {
    lengthMeters: number | DecimalType;
    heightMeters: number | DecimalType;
    pricePerMeter: number | DecimalType;
    installationFee: number | DecimalType;
    terrain: 'FLAT' | 'SLOPED' | 'ROCKY' | string;
    addons: {
        pricingType: 'FLAT' | 'PER_METER' | string;
        price: number | DecimalType;
    }[];
    vatRate?: number; // default 0.15
}

export interface PricingResult {
    baseCost: DecimalType;
    terrainMultiplier: number;
    heightMultiplier: number;
    addonsCost: DecimalType;
    subtotal: DecimalType;
    vat: DecimalType;
    total: DecimalType;
}

export function calculateFencePrice(input: PricingInput): PricingResult {
    // Normalize inputs
    const length = new Decimal(input.lengthMeters);
    const height = new Decimal(input.heightMeters);
    const pricePerMeter = new Decimal(input.pricePerMeter);
    const installationFee = new Decimal(input.installationFee);
    const vatRate = new Decimal(input.vatRate ?? 0.15);

    // Validation
    if (length.lessThan(5)) {
        throw new Error("Minimum length is 5 meters.");
    }
    if (height.lessThan(0.5) || height.greaterThan(4.0)) {
        throw new Error("Height must be between 0.5m and 4.0m.");
    }

    // Multipliers
    let heightMultiplier = 1.0;
    if (height.lessThanOrEqualTo(1.2)) {
        heightMultiplier = 1.0;
    } else if (height.lessThanOrEqualTo(2.4)) {
        heightMultiplier = 1.1;
    } else {
        heightMultiplier = 1.2;
    }

    let terrainMultiplier = 1.0;
    switch (input.terrain) {
        case 'SLOPED':
            terrainMultiplier = 1.15;
            break;
        case 'ROCKY':
            terrainMultiplier = 1.25;
            break;
        default:
            terrainMultiplier = 1.0;
    }

    // Base Cost
    const baseCost = length.mul(pricePerMeter).mul(heightMultiplier);

    // Addons
    let addonsCost = new Decimal(0);
    for (const addon of input.addons) {
        const price = new Decimal(addon.price);
        if (addon.pricingType === 'PER_METER') {
            addonsCost = addonsCost.add(price.mul(length));
        } else {
            addonsCost = addonsCost.add(price);
        }
    }

    // Subtotal calculation: (Base * Terrain) + Addons + Install
    // Note: Parentheses in prompt: subtotal = baseCost * terrainMultiplier + addonsCost + installationFee
    // Ambiguity: Does terrain multiplier apply to addons? Prompt implies baseCost only.
    // "baseCost = length * pricePerMeter * heightMultiplier"
    // "subtotal = baseCost * terrainMultiplier + addonsCost + installationFee"

    const baseWithTerrain = baseCost.mul(terrainMultiplier);
    const subtotal = baseWithTerrain.add(addonsCost).add(installationFee);

    const vat = subtotal.mul(vatRate);
    const total = subtotal.add(vat);

    // Return breakdown
    return {
        baseCost: baseCost.toDecimalPlaces(2),
        terrainMultiplier,
        heightMultiplier,
        addonsCost: addonsCost.toDecimalPlaces(2),
        subtotal: subtotal.toDecimalPlaces(2),
        vat: vat.toDecimalPlaces(2),
        total: total.toDecimalPlaces(2),
    };
}
