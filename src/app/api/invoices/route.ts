import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDbUser } from '@/lib/rbac';

export async function GET(req: NextRequest) {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: 'desc' },
        include: { customer: true }
    });
    return NextResponse.json(invoices);
}
