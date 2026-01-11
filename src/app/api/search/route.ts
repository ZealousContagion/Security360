import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDbUser } from '@/lib/rbac';

export async function GET(req: NextRequest) {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const query = req.nextUrl.searchParams.get('q');
    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const [customers, quotes, invoices] = await Promise.all([
        // Search Customers
        prisma.customer.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                ]
            },
            take: 5
        }),
        // Search Quotes
        prisma.fenceQuote.findMany({
            where: {
                OR: [
                    { customer: { name: { contains: query, mode: 'insensitive' } } },
                    { id: { contains: query, mode: 'insensitive' } },
                ]
            },
            include: { customer: true },
            take: 5
        }),
        // Search Invoices
        prisma.invoice.findMany({
            where: {
                OR: [
                    { invoiceNumber: { contains: query, mode: 'insensitive' } },
                    { customer: { name: { contains: query, mode: 'insensitive' } } },
                ]
            },
            include: { customer: true },
            take: 5
        })
    ]);

    const results = [
        ...customers.map(c => ({
            id: c.id,
            type: 'customer',
            title: c.name,
            subtitle: c.email || 'No email',
            url: `/admin/customers/${c.id}`
        })),
        ...quotes.map(q => ({
            id: q.id,
            type: 'quote',
            title: `Quote for ${q.customer.name}`,
            subtitle: `${q.id.slice(0, 8)}... - $${Number(q.total).toLocaleString()}`,
            url: `/admin/quotes/${q.id}`
        })),
        ...invoices.map(i => ({
            id: i.id,
            type: 'invoice',
            title: `Invoice ${i.invoiceNumber}`,
            subtitle: `${i.customer.name} - $${Number(i.total).toLocaleString()}`,
            url: `/admin/invoices` // Adjust if you have a specific invoice view
        }))
    ];

    return NextResponse.json({ results });
}
