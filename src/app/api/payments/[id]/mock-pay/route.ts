import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const invoice = await prisma.invoice.findUnique({
            where: { id }
        });

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Simulate successful payment logic
        const depositAmount = Number(invoice.total) * 0.5;

        // 1. Create Payment Record
        await prisma.payment.create({
            data: {
                invoiceId: invoice.id,
                amount: depositAmount,
                method: 'CARD',
                reference: `MOCK-${Date.now()}`,
                status: 'SUCCESS'
            }
        });

        // 2. Update Invoice Status
        await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'PAID' }
        });

        // 3. Create a Job for the field team
        const tech = await prisma.teamMember.findFirst({
            where: { role: { contains: 'Technician' } }
        });

        await prisma.job.create({
            data: {
                invoiceId: invoice.id,
                teamMemberId: tech?.id,
                status: 'SCHEDULED',
                notes: 'Automated job creation from deposit payment.'
            }
        });

        // 4. Log the activity
        await prisma.auditLog.create({
            data: {
                action: 'PAYMENT_AND_JOB_CREATED',
                entityType: 'INVOICE',
                entityId: invoice.id,
                metadata: { amount: depositAmount, techAssigned: tech?.name }
            }
        });

        return NextResponse.json({ success: true, message: 'Payment processed successfully' });
    } catch (error) {
        console.error('Payment Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
