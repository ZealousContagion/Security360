import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { getSession } from '@/lib/auth';




export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();

    // Basic security: if no session, ensure we are not exposing sensitive data? 
    // But wait, /pay/[id] page is public. 
    // Let's assume this API is for the Admin Dashboard and thus protected.
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
            customer: true,
            quote: {
                include: {
                    fencingService: true
                }
            },
            Payments: true
        }
    });

    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Resolve Addons if quote exists
    let addons: any[] = [];
    if (invoice.quote) {
        addons = await prisma.fencingAddon.findMany({
            where: { id: { in: invoice.quote.addOnIds } }
        });
    }

    return NextResponse.json({ ...invoice, addons });
}
