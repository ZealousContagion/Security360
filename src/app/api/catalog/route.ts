import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isManager } from '@/lib/rbac';

export async function GET(req: NextRequest) {
    const items = await prisma.catalogItem.findMany({
        orderBy: { category: 'asc' }
    });
    return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
    if (!await isManager()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const item = await prisma.catalogItem.create({ data: body });
        return NextResponse.json(item);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
