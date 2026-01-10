import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/modules/auth/session';
import { prisma } from '@/core/database';

export async function GET(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(user);
}
