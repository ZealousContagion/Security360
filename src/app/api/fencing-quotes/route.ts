import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { getDbUser } from '@/lib/rbac';
import { calculateFencePrice } from '@/modules/billing/pricing';
import { logAction } from '@/modules/audit/logger';
import { Decimal } from '@/generated/client/runtime/library';

import { getTaxSettings } from '@/modules/billing/tax';
import { QuoteSchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
    const user = await getDbUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        
                // Validate with Zod
                const validation = QuoteSchema.safeParse(body);
                if (!validation.success) {
                    console.error('[Quote API] Validation failed:', validation.error.format());
                    return NextResponse.json({ 
                        error: 'Validation failed', 
                        details: validation.error.flatten().fieldErrors 
                    }, { status: 400 });
                }
        const { customerId, fencingServiceId, lengthMeters, heightMeters, terrain, addOnIds } = validation.data;

        // 1. Fetch authoritative data
        const service = await prisma.fencingService.findUnique({ where: { id: fencingServiceId } });
        if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 400 });

        const addons = await prisma.fencingAddon.findMany({
            where: { id: { in: addOnIds || [] } }
        });

        // Fetch Tax Settings
        const taxSettings = await getTaxSettings();

        // 2. Calculate Pricing
        const pricingResult = calculateFencePrice({
            lengthMeters,
            heightMeters,
            terrain,
            pricePerMeter: service.pricePerMeter,
            installationFee: service.installationFee,
            addons: addons.map(a => ({ pricingType: a.pricingType, price: a.price })),
            vatRate: taxSettings.rate,
        });

        // 3. Persist
        const quote = await prisma.fenceQuote.create({
            data: {
                customerId,
                fencingServiceId,
                lengthMeters: new Decimal(lengthMeters),
                heightMeters: new Decimal(heightMeters),
                terrain,
                addOnIds: addOnIds || [],
                subtotal: pricingResult.subtotal,
                vat: pricingResult.vat,
                total: pricingResult.total,
                status: 'DRAFT',
            }
        });

        await logAction({
            action: 'CREATE_QUOTE',
            entityType: 'FenceQuote',
            entityId: quote.id,
            performedBy: user.email,
            userId: user.id,
        });

        return NextResponse.json(quote);

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || 'Error creating quote' }, { status: 400 });
    }
}

