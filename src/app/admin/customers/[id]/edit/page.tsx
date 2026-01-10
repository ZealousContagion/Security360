import { prisma } from '@/lib/prisma';
import { CustomerForm } from '../../CustomerForm';
import { updateCustomer } from '../../actions';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { checkRole } from '@/lib/rbac';

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
    await checkRole(["ADMIN", "MANAGER"]);
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
        where: { id }
    });

    if (!customer) return notFound();

    const updateAction = updateCustomer.bind(null, id);

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <Link href="/admin/customers" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-4 transition-colors">
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Back to Directory
                </Link>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Edit Customer</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Update contact details and preferences</p>
            </div>

            <CustomerForm customer={customer} action={updateAction} />
        </div>
    );
}
