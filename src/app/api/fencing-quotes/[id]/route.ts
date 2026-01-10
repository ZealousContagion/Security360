import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { getSession } from '@/modules/auth/session';

import { calculateFencePrice } from '@/modules/billing/pricing';
import { getTaxSettings } from '@/modules/billing/tax';
import { QuoteSchema } from '@/lib/validations';
import { Decimal } from '@prisma/client/runtime/library';
import { logAction } from '@/modules/audit/logger';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const quote = await prisma.fenceQuote.findUnique({
        where: { id },
        include: {
            customer: true,
            fencingService: true,
        }
    });

    if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Resolve Addons manually since we store IDs in array
    const addons = await prisma.fencingAddon.findMany({
        where: { id: { in: quote.addOnIds } }
    });

    return NextResponse.json({ ...quote, addons });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    try {
        const body = await req.json();
        
        // Validate with Zod
        const validation = QuoteSchema.safeParse(body);
        if (!validation.success) {
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

        const taxSettings = await getTaxSettings();

        // 2. Recalculate Pricing
        const pricingResult = calculateFencePrice({
            lengthMeters,
            heightMeters,
            terrain,
            pricePerMeter: service.pricePerMeter,
            installationFee: service.installationFee,
            addons: addons.map(a => ({ pricingType: a.pricingType, price: a.price })),
            vatRate: taxSettings.rate,
        });

        // 3. Update
        const quote = await prisma.fenceQuote.update({
            where: { id },
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
            }
        });

        await logAction({
            action: 'UPDATE_QUOTE',
            entityType: 'FenceQuote',
            entityId: quote.id,
            performedBy: session.email,
            userId: session.userId,
        });

        return NextResponse.json(quote);

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message || 'Error updating quote' }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || !['ADMIN', 'MANAGER'].includes(session.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    try {
        await prisma.fenceQuote.delete({ where: { id } });

        await logAction({
            action: 'DELETE_QUOTE',
            entityType: 'FenceQuote',
            entityId: id,
            performedBy: session.email,
            userId: session.userId,
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: 'Failed to delete quote' }, { status: 500 });
    }
}
