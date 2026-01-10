import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/modules/auth/session';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const service = await prisma.fencingService.findUnique({
        where: { id },
        include: { BillOfMaterials: { include: { catalogItem: true } } }
    });

    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

    return NextResponse.json(service);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    try {
        const body = await req.json();
        const service = await prisma.fencingService.update({
            where: { id },
            data: body
        });
        return NextResponse.json(service);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    try {
        await prisma.fencingService.delete({ where: { id } });
        return NextResponse.json({ message: 'Service deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
