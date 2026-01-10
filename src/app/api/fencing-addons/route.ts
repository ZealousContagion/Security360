import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/database';
import { getSession } from '@/modules/auth/session';

export async function GET() {
    const addons = await prisma.fencingAddon.findMany();
    return NextResponse.json(addons);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const addon = await prisma.fencingAddon.create({ data: body });
        return NextResponse.json(addon);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
