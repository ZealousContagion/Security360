import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { isManager } from '@/lib/rbac';
import { Decimal } from '@prisma/client/runtime/library';

export async function GET(req: NextRequest) {
    if (!await isManager()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 1. Total Revenue (Paid Invoices)
    const paidInvoices = await prisma.invoice.findMany({
        where: { status: 'PAID' },
        select: { total: true }
    });
    const totalRevenue = paidInvoices.reduce((acc, curr) => acc.add(curr.total), new Decimal(0));

    // 2. Counts
    const paidCount = await prisma.invoice.count({ where: { status: 'PAID' } });
    const pendingCount = await prisma.invoice.count({ where: { status: 'PENDING' } });

    // 3. Revenue by Service
    // Complex join: Invoice -> Quote -> Service. 
    // We'll fetch all paid invoices with quotes & services then aggregate.
    const paidInvoicesWithService = await prisma.invoice.findMany({
        where: { status: 'PAID', quoteId: { not: null } },
        include: {
            quote: {
                include: { fencingService: true }
            }
        }
    });

    const revenueByService: Record<string, number> = {};
    for (const inv of paidInvoicesWithService) {
        if (inv.quote?.fencingService) {
            const name = inv.quote.fencingService.name;
            revenueByService[name] = (revenueByService[name] || 0) + inv.total.toNumber();
        }
    }

    // 4. Conversion Funnel
    const totalQuotes = await prisma.fenceQuote.count();
    const convertedQuotes = await prisma.invoice.count({
        where: { quoteId: { not: null } }
    });

    const conversionRate = totalQuotes > 0 ? (convertedQuotes / totalQuotes) * 100 : 0;

    return NextResponse.json({
        totalRevenue: totalRevenue.toNumber(),
        paidCount,
        pendingCount,
        conversionRate: Math.round(conversionRate),
        totalQuotes,
        convertedQuotes,
        revenueByService: Object.entries(revenueByService).map(([name, value]) => ({ name, value })),
        monthlyRevenue: Object.entries(monthlyRevenue)
            .map(([date, value]) => ({ date, value }))
            .sort((a, b) => a.date.localeCompare(b.date))
    });
}
