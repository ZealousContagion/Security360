import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDbUser } from '@/lib/rbac';

export async function GET(req: NextRequest) {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });
    return NextResponse.json(notifications);
}

export async function PUT(req: NextRequest) {
    const user = await getDbUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await prisma.notification.updateMany({
            where: { read: false },
            data: { read: true }
        });
        return NextResponse.json({ message: 'Notifications marked as read' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
