'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/modules/audit/logger";
import { Decimal } from "@/generated/client/runtime/library";

export async function getAvailableAddons() {
    return await prisma.fencingAddon.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function updateQuoteAddons(quoteId: string, addOnIds: string[]) {
    try {
        const quote = await prisma.fenceQuote.findUnique({
            where: { id: quoteId },
            include: { fencingService: true, customer: true }
        });

        if (!quote) throw new Error("Quote not found");
        if (quote.status !== 'SENT') throw new Error("Only sent quotes can be adjusted");

        // 1. Fetch selected addons
        const addons = await prisma.fencingAddon.findMany({
            where: { id: { in: addOnIds } }
        });

        // 2. Calculate new addon costs
        // Note: In a real app, you'd use the full quoting logic. 
        // Here we'll simplify: Base Price + Addons
        let addonSubtotal = new Decimal(0);
        for (const addon of addons) {
            if (addon.pricingType === 'PER_METER') {
                addonSubtotal = addonSubtotal.add(addon.price.mul(quote.lengthMeters));
            } else {
                addonSubtotal = addonSubtotal.add(addon.price);
            }
        }

        // 3. Recalculate based on original service parameters
        // We need to strip the old addons first to get base.
        // Actually, we can just recalculate the whole thing.
        const terrainFactor = quote.terrain === 'ROCKY' ? 1.4 : quote.terrain === 'SLOPED' ? 1.2 : 1.0;
        const heightFactor = quote.heightMeters.toNumber() / 1.8;
        const baseServiceSubtotal = quote.fencingService.pricePerMeter
            .mul(quote.lengthMeters)
            .mul(terrainFactor)
            .mul(heightFactor)
            .add(quote.fencingService.installationFee);

        const newSubtotal = baseServiceSubtotal.add(addonSubtotal);
        const vatRate = new Decimal(0.15); // Standard
        const newVat = newSubtotal.mul(vatRate);
        const newTotal = newSubtotal.add(newVat);

        // 4. Update the quote
        await prisma.fenceQuote.update({
            where: { id: quoteId },
            data: {
                addOnIds,
                subtotal: newSubtotal,
                vat: newVat,
                total: newTotal
            }
        });

        await logAction({
            action: 'CUSTOMER_PORTAL_QUOTE_ADJUSTED',
            entityType: 'FenceQuote',
            entityId: quoteId,
            performedBy: `Customer: ${quote.customer.name}`,
            metadata: { newTotal: newTotal.toNumber(), addOnIds }
        });

        revalidatePath(`/portal/${quote.customerId}`);
        return { success: true };
    } catch (err: any) {
        console.error("Adjustment Error:", err);
        return { success: false, error: err.message };
    }
}

export async function createPortalSupportTicket(customerId: string, quoteId: string | null, message: string) {
    try {
        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer) throw new Error("Customer not found");

        const ticket = await prisma.supportTicket.create({
            data: {
                customerId,
                quoteId,
                subject: quoteId ? `Inquiry about Quote #${quoteId.slice(0, 8)}` : `General Inquiry: ${customer.name}`,
                message,
                status: 'OPEN',
                priority: 'LOW'
            }
        });

        // Create a system notification for the admin team
        await prisma.notification.create({
            data: {
                type: 'INQUIRY',
                title: 'New Customer Inquiry',
                message: `${customer.name} sent a message: "${message.slice(0, 50)}${message.length > 50 ? '...' : ''}"`,
            }
        });

        await logAction({
            action: 'CUSTOMER_PORTAL_SUPPORT_TICKET_CREATED',
            entityType: 'SupportTicket',
            entityId: ticket.id,
            performedBy: `Customer: ${customer.name}`,
            metadata: { quoteId }
        });

        revalidatePath(`/portal/${customerId}`);
        return { success: true };
    } catch (err: any) {
        console.error("Portal Ticket Error:", err);
        return { success: false, error: err.message };
    }
}

export async function getPortalTickets(customerId: string) {
    return await prisma.supportTicket.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        take: 10
    });
}

export async function customerApproveQuote(quoteId: string, signatureData: string) {
    try {
        const quote = await prisma.fenceQuote.findUnique({
            where: { id: quoteId },
            include: { customer: true }
        });

        if (!quote) throw new Error("Quote not found");
        if (quote.status !== 'SENT') throw new Error("Only sent quotes can be approved by customer");

        // 1. Generate Invoice Number
        const count = await prisma.invoice.count();
        const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        // 2. Transaction: Approve Quote + Create Invoice + Save Signature
        const [updatedQuote, invoice] = await prisma.$transaction([
            prisma.fenceQuote.update({
                where: { id: quoteId },
                data: { 
                    status: 'APPROVED',
                    signatureData,
                    signedAt: new Date()
                }
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

        // 3. Create the Job
        await prisma.job.create({
            data: {
                invoiceId: invoice.id,
                status: 'UNSCHEDULED',
                notes: 'Created via Customer Portal approval.'
            }
        });

        // 4. Create a system notification
        await prisma.notification.create({
            data: {
                type: 'APPROVAL',
                title: 'Quote Approved',
                message: `${quote.customer.name} has approved Quote #${quoteId.slice(0, 8)} and signed the contract.`,
            }
        });

        // 5. Log the activity
        await logAction({
            action: 'CUSTOMER_PORTAL_APPROVAL_AND_JOB_CREATED',
            entityType: 'FenceQuote',
            entityId: quoteId,
            performedBy: `Customer: ${quote.customer.name}`,
            metadata: { autoGeneratedInvoice: invoiceNumber }
        });

        revalidatePath(`/portal/${quote.customerId}`);
        return { success: true };
    } catch (err: any) {
        console.error("Portal Approval Error:", err);
        return { success: false, error: err.message };
    }
}
