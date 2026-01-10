'use server';

import { prisma } from "@/lib/prisma";
import { sendQuoteEmail } from "@/lib/mail";
import { logAction } from "@/modules/audit/logger";

export async function sendQuoteToCustomer(quoteId: string) {
    try {
        const quote = await prisma.fenceQuote.findUnique({
            where: { id: quoteId },
            include: { customer: true }
        });

        if (!quote || !quote.customer) throw new Error("Quote or Customer not found");

        if (!quote.customer.email) {
            return { success: false, error: "Customer does not have an email address." };
        }

        const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/portal/${quote.customerId}`;

        const res = await sendQuoteEmail({
            to: quote.customer.email,
            customerName: quote.customer.name,
            quoteId: quote.id,
            amount: Number(quote.total).toFixed(2),
            portalUrl
        });

        if (res.success) {
            await logAction({
                action: 'QUOTE_EMAILED',
                entityType: 'FenceQuote',
                entityId: quoteId,
                metadata: { email: quote.customer.email }
            });
            return { success: true };
        } else {
            return { success: false, error: "Mail service failed" };
        }
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}
