import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { getSession } from '@/modules/auth/session';
import { logAction } from '@/modules/audit/logger';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    // Only Admin or Finance can convert to invoice
    if (!session || !['ADMIN', 'FINANCE'].includes(session.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;

    const quote = await prisma.fenceQuote.findUnique({ where: { id } });
    if (!quote) return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    if (quote.status !== 'APPROVED') return NextResponse.json({ error: 'Quote must be APPROVED' }, { status: 400 });

    // Generate Invoice Number (Simple sequential or random)
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    // Transaction
    const [invoice] = await prisma.$transaction([
        prisma.invoice.create({
            data: {
                quoteId: quote.id,
                customerId: quote.customerId,
                invoiceNumber,
                subtotal: quote.subtotal,
                vat: quote.vat,
                total: quote.total,
                status: 'PENDING',
            }
        }),
        prisma.fenceQuote.update({
            where: { id: quote.id },
            data: { status: 'CONVERTED' }
        })
    ]);

    await logAction({
        action: 'CONVERT_TO_INVOICE',
        entityType: 'Invoice',
        entityId: invoice.id,
        performedBy: session.email,
        userId: session.userId,
        metadata: { quoteId: quote.id }
    });

    return NextResponse.json(invoice);
}
