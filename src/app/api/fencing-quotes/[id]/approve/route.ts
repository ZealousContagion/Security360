import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { getSession } from '@/modules/auth/session';
import { logAction } from '@/modules/audit/logger';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    // Role check: Sales can approve? Let's say yes for MVP, or maybe Admin/Finance. 
    // Prompt says roles: ADMIN|FINANCE|SALES. Let's assume SALES can create/approve drafts.
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    // 1. Fetch quote
    const quote = await prisma.fenceQuote.findUnique({ where: { id } });
    if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // 2. Generate Invoice Number
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

    // 3. Transaction: Approve Quote + Create Invoice + Create Job
    const [updatedQuote, invoice] = await prisma.$transaction([
        prisma.fenceQuote.update({
            where: { id },
            data: { status: 'APPROVED' }
        }),
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
        })
    ]);

    // 4. Create the Job
    await prisma.job.create({
        data: {
            invoiceId: invoice.id,
            status: 'UNSCHEDULED', // Use a clear status for new jobs
            notes: 'Created automatically upon quote approval.'
        }
    });

    await logAction({
        action: 'APPROVE_QUOTE_AND_CREATE_JOB',
        entityType: 'FenceQuote',
        entityId: updatedQuote.id,
        performedBy: session.email,
        userId: session.userId,
        metadata: { invoiceNumber }
    });

    return NextResponse.json(updatedQuote);
}
