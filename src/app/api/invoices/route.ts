import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { getSession } from '@/modules/auth/session';

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: 'desc' },
        include: { customer: true }
    });

    return NextResponse.json(invoices);
}
