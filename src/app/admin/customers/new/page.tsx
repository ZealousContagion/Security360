import { createCustomer } from '../actions';
import { CustomerForm } from '../CustomerForm';
import { Button } from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCustomerPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <Link href="/admin/customers" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-4 transition-colors">
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Back to Directory
                </Link>
                <h1 className="text-3xl font-black tracking-tighter uppercase">New Customer</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Register a new client for quotes and billing</p>
            </div>

            <CustomerForm action={createCustomer} />
        </div>
    );
}
