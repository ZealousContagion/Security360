export type TerrainType = 'Flat' | 'Sloped' | 'Rocky';

export interface FencingType {
    id: string;
    name: string;
    description: string;
    basePricePerMeter: number;
    supportedHeights: string[];
    installationFeeFlat: number;
    supportsElectric: boolean;
    supportsRazor: boolean;
    isActive: boolean;
}

export interface FenceAddon {
    id: string;
    name: string;
    pricingType: 'flat' | 'perMeter';
    price: number;
    compatibleFencingTypes: string[]; // FencingType ids
}

export type QuoteStatus = 'Draft' | 'Sent' | 'Approved' | 'Converted to Invoice' | 'Expired';

export interface FencingQuote {
    id: string;
    customerId: string;
    customerName: string;
    fencingTypeId: string;
    fencingTypeName: string;
    lengthMeters: number;
    height: string;
    terrainType: TerrainType;
    selectedAddons: {
        addonId: string;
        name: string;
        price: number;
        pricingType: 'flat' | 'perMeter';
    }[];
    baseCost: number;
    addonsCost: number;
    installationFee: number;
    vatRate: number;
    vatAmount: number;
    totalAmount: number;
    status: QuoteStatus;
    createdAt: string;
}
