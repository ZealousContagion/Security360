import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/modules/auth/session';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const expense = await prisma.expense.findUnique({
        where: { id }
    });

    if (!expense) return NextResponse.json({ error: 'Expense not found' }, { status: 404 });

    return NextResponse.json(expense);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || !['ADMIN', 'FINANCE'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    try {
        const body = await req.json();
        const expense = await prisma.expense.update({
            where: { id },
            data: body
        });
        return NextResponse.json(expense);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || !['ADMIN', 'FINANCE'].includes(session.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    try {
        await prisma.expense.delete({ where: { id } });
        return NextResponse.json({ message: 'Expense deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
