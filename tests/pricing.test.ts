import { calculateFencePrice } from '../src/modules/billing/pricing';
import { Prisma } from '@prisma/client';
const { Decimal } = Prisma;

describe('Pricing Engine', () => {
    const baseInput = {
        lengthMeters: 10,
        heightMeters: 1.2, // Multiplier 1.0
        pricePerMeter: 100, // 10 * 100 = 1000 base
        installationFee: 200,
        terrain: 'FLAT', // Multiplier 1.0
        addons: []
    };

    test('calculates basic fence correctly', () => {
        const result = calculateFencePrice(baseInput); // 1000 + 200 = 1200 subtotal
        expect(result.subtotal.toFixed(2)).toBe('1200.00');
        expect(result.vat.toFixed(2)).toBe((1200 * 0.15).toFixed(2));
        expect(result.total.toFixed(2)).toBe((1200 * 1.15).toFixed(2));
    });

    test('applies height multiplier', () => {
        const input = { ...baseInput, heightMeters: 2.0 }; // Multiplier 1.1
        // Base = 10 * 100 * 1.1 = 1100
        // Subtotal = 1100 + 200 = 1300
        const result = calculateFencePrice(input);
        expect(result.subtotal.toFixed(2)).toBe('1300.00');
    });

    test('applies terrain multiplier', () => {
        const input = { ...baseInput, terrain: 'ROCKY' }; // Multiplier 1.25
        // Base = 1000 * 1.25 = 1250
        // Subtotal = 1250 + 200 = 1450
        const result = calculateFencePrice(input);
        expect(result.subtotal.toFixed(2)).toBe('1450.00');
    });

    test('calculates addons correctly', () => {
        const input = {
            ...baseInput,
            addons: [
                { pricingType: 'FLAT', price: 50 },
                { pricingType: 'PER_METER', price: 10 } // 10 * 10 = 100
            ]
        };
        // Base = 1000
        // Addons = 50 + 100 = 150
        // Subtotal = 1000 + 150 + 200 = 1350
        const result = calculateFencePrice(input);
        expect(result.addonsCost.toFixed(2)).toBe('150.00');
        expect(result.subtotal.toFixed(2)).toBe('1350.00');
    });

    test('validates length', () => {
        expect(() => calculateFencePrice({ ...baseInput, lengthMeters: 4 })).toThrow(/Minimum length/);
    });
});
