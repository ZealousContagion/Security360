import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { getSession } from '@/modules/auth/session';

export async function GET() {
    const services = await prisma.fencingService.findMany({
        where: { isActive: true },
    });
    return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const service = await prisma.fencingService.create({
        data: body,
    });

    return NextResponse.json(service);
}
