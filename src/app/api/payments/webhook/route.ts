import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { logAction } from '@/modules/audit/logger';
import { Prisma } from '@prisma/client';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const stripe = getStripe();
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const invoiceId = session.metadata?.invoiceId;

        if (invoiceId) {
            try {
                const amountPaid = new Prisma.Decimal(session.amount_total! / 100);

                // 1. Record the payment
                const payment = await prisma.payment.create({
                    data: {
                        invoiceId,
                        amount: amountPaid,
                        method: 'STRIPE_CARD',
                        reference: session.payment_intent as string,
                        status: 'SUCCESS',
                    }
                });

                // 2. Check if this was a deposit or full payment
                const invoice = await prisma.invoice.findUnique({
                    where: { id: invoiceId },
                    include: { Payments: true }
                });

                if (invoice) {
                    const totalPaid = invoice.Payments
                        .filter(p => p.status === 'SUCCESS')
                        .reduce((acc, p) => acc.plus(p.amount), new Prisma.Decimal(0));

                    // Update invoice status
                    const newStatus = totalPaid.greaterThanOrEqualTo(invoice.total) ? 'PAID' : 'PARTIAL';
                    
                    await prisma.invoice.update({
                        where: { id: invoiceId },
                        data: { status: newStatus }
                    });

                    // 3. If first payment (Deposit), create a Job
                    const jobExists = await prisma.job.findUnique({
                        where: { invoiceId }
                    });

                    if (!jobExists) {
                        const tech = await prisma.teamMember.findFirst({
                            where: { role: { contains: 'Technician' }, status: 'ACTIVE' }
                        });

                        await prisma.job.create({
                            data: {
                                invoiceId,
                                teamMemberId: tech?.id,
                                status: 'SCHEDULED',
                                notes: 'Automatically created from Stripe deposit payment.'
                            }
                        });
                    }

                    await logAction({
                        action: 'PAYMENT_RECEIVED',
                        entityType: 'Invoice',
                        entityId: invoiceId,
                        metadata: { 
                            amount: amountPaid.toString(), 
                            stripeSessionId: session.id,
                            status: newStatus
                        }
                    });
                }
            } catch (err) {
                console.error('Error processing checkout session:', err);
                return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true });
}