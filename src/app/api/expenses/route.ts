import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isManager } from '@/lib/rbac';

export async function GET(req: NextRequest) {
    const expenses = await prisma.expense.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
    if (!await isManager()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await req.json();
        const expense = await prisma.expense.create({ data: body });
        return NextResponse.json(expense);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
