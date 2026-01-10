import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { logAction } from '@/modules/audit/logger';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { invoiceId, amount, method, reference, secret } = body;

        // 1. Validate 'signature' (simulated)
        if (secret !== 'secure_webhook_secret_123') {
            return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
        }

        // 2. Record Payment
        const payment = await prisma.payment.create({
            data: {
                invoiceId,
                amount,
                method, // 'MOBILE_MONEY' | 'CARD'
                reference,
                status: 'SUCCESS',
            }
        });

        // 3. Check Invoice Balance
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { Payments: true }
        });

        if (invoice) {
            const totalPaid = invoice.Payments
                .filter(p => p.status === 'SUCCESS')
                .reduce((acc, curr) => acc.add(curr.amount), new Decimal(0));

            // If paid >= total, mark PAID
            if (totalPaid.greaterThanOrEqualTo(invoice.total)) {
                await prisma.invoice.update({
                    where: { id: invoiceId },
                    data: { status: 'PAID' }
                });
                await logAction({
                    action: 'INVOICE_PAID',
                    entityType: 'Invoice',
                    entityId: invoiceId,
                    metadata: { totalPaid: totalPaid.toString(), method }
                });
            }
        }

        return NextResponse.json({ success: true, paymentId: payment.id });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Payment processing failed' }, { status: 500 });
    }
}
