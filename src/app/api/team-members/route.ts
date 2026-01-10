import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/modules/auth/session';

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const members = await prisma.teamMember.findMany({
        orderBy: { name: 'asc' }
    });
    return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const member = await prisma.teamMember.create({ data: body });
        return NextResponse.json(member);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
