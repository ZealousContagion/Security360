'use server';

import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(invoiceId: string) {
    const stripe = getStripe();
    const invoice = await prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { customer: true, quote: { include: { fencingService: true } } }
    });

    if (!invoice) throw new Error('Invoice not found');

    const origin = (await headers()).get('origin');
    
    // Deposit is 50%
    const depositAmount = Math.round(Number(invoice.total) * 0.5 * 100); // Stripe uses cents

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: `Deposit for ${invoice.quote?.fencingService.name || 'Fencing Project'}`,
                        description: `Project: ${invoice.quote?.lengthMeters.toString()}m Perimeter Fence. Invoice: ${invoice.invoiceNumber}`,
                    },
                    unit_amount: depositAmount,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${origin}/pay/${invoiceId}?success=true`,
        cancel_url: `${origin}/pay/${invoiceId}?canceled=true`,
        metadata: {
            invoiceId: invoice.id,
            customerId: invoice.customerId,
            type: 'DEPOSIT'
        },
        customer_email: invoice.customer.email || undefined,
    });

    if (!session.url) throw new Error('Failed to create session');

    redirect(session.url);
}
