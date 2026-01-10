import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDbUser, isManager } from '@/lib/rbac';

export async function GET(req: NextRequest) {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const members = await prisma.teamMember.findMany({
        orderBy: { name: 'asc' }
    });
    return NextResponse.json(members);
}

export async function POST(req: NextRequest) {
    if (!await isManager()) {
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
