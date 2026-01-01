import { FencingType, FenceAddon, FencingQuote } from "./types/fencing";

export const FENCING_TYPES: FencingType[] = [
    {
        id: "ft-001",
        name: "Diamond Mesh Fence",
        description: "Versatile and durable chain-link fencing for various applications.",
        basePricePerMeter: 1200,
        supportedHeights: ["1.2m", "1.5m", "1.8m", "2.1m", "2.4m"],
        installationFeeFlat: 5000,
        supportsElectric: true,
        supportsRazor: true,
        isActive: true
    },
    {
        id: "ft-002",
        name: "Game Fence",
        description: "High-tensile wire fencing designed for wildlife and large livestock.",
        basePricePerMeter: 1800,
        supportedHeights: ["1.8m", "2.1m", "2.4m"],
        installationFeeFlat: 8000,
        supportsElectric: true,
        supportsRazor: false,
        isActive: true
    },
    {
        id: "ft-003",
        name: "Electric Fence",
        description: "Stand-alone high-security electric fencing for maximum deterrence.",
        basePricePerMeter: 2500,
        supportedHeights: ["1.8m", "2.1m", "2.4m"],
        installationFeeFlat: 10000,
        supportsElectric: true,
        supportsRazor: true,
        isActive: true
    },
    {
        id: "ft-004",
        name: "Razor Wire",
        description: "Coiled sharp razor wire for periphery security.",
        basePricePerMeter: 800,
        supportedHeights: ["0.45m", "0.73m", "0.98m"],
        installationFeeFlat: 3500,
        supportsElectric: false,
        supportsRazor: false,
        isActive: true
    },
    {
        id: "ft-005",
        name: "Barbed Wire",
        description: "Traditional security fencing with sharp barbs at intervals.",
        basePricePerMeter: 500,
        supportedHeights: ["1.2m", "1.5m", "1.8m"],
        installationFeeFlat: 2500,
        supportsElectric: false,
        supportsRazor: false,
        isActive: true
    },
    {
        id: "ft-006",
        name: "Palisade Fence",
        description: "Steel picket fencing offering high security and aesthetic appeal.",
        basePricePerMeter: 4500,
        supportedHeights: ["1.8m", "2.1m", "2.4m"],
        installationFeeFlat: 15000,
        supportsElectric: true,
        supportsRazor: true,
        isActive: true
    }
];

export const FENCE_ADDONS: FenceAddon[] = [
    {
        id: "fa-001",
        name: "Razor wire topping",
        pricingType: "perMeter",
        price: 350,
        compatibleFencingTypes: ["ft-001", "ft-003", "ft-006"]
    },
    {
        id: "fa-002",
        name: "Electric wire",
        pricingType: "perMeter",
        price: 450,
        compatibleFencingTypes: ["ft-001", "ft-002", "ft-003", "ft-006"]
    },
    {
        id: "fa-003",
        name: "Standard Gate",
        pricingType: "flat",
        price: 15000,
        compatibleFencingTypes: ["ft-001", "ft-002", "ft-003", "ft-004", "ft-005", "ft-006"]
    },
    {
        id: "fa-004",
        name: "Concrete footing",
        pricingType: "perMeter",
        price: 600,
        compatibleFencingTypes: ["ft-001", "ft-006"]
    },
    {
        id: "fa-005",
        name: "Reinforced poles",
        pricingType: "flat",
        price: 1200,
        compatibleFencingTypes: ["ft-001", "ft-002", "ft-003", "ft-006"]
    }
];

export const MOCK_QUOTES: FencingQuote[] = [
    {
        id: "QUO-9901",
        customerId: "CUST-001",
        customerName: "Greenwood Estate Management",
        fencingTypeId: "ft-001",
        fencingTypeName: "Diamond Mesh Fence",
        lengthMeters: 150,
        height: "1.8m",
        terrainType: "Flat",
        selectedAddons: [
            { addonId: "fa-001", name: "Razor wire topping", price: 350, pricingType: "perMeter" }
        ],
        baseCost: 180000,
        addonsCost: 52500,
        installationFee: 5000,
        vatRate: 0.16,
        vatAmount: 38000,
        totalAmount: 275500,
        status: "Approved",
        createdAt: "2025-12-20"
    },
    {
        id: "QUO-9902",
        customerId: "CUST-002",
        customerName: "Safari Lodge",
        fencingTypeId: "ft-002",
        fencingTypeName: "Game Fence",
        lengthMeters: 500,
        height: "2.4m",
        terrainType: "Sloped",
        selectedAddons: [
            { addonId: "fa-002", name: "Electric wire", price: 450, pricingType: "perMeter" }
        ],
        baseCost: 900000,
        addonsCost: 225000,
        installationFee: 8000,
        vatRate: 0.16,
        vatAmount: 181280,
        totalAmount: 1314280,
        status: "Sent",
        createdAt: "2025-12-28"
    }
];
