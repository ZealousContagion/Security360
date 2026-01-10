'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteCustomer } from './actions';

export function DeleteCustomerButton({ id, customerName }: { id: string, customerName: string }) {
    const [isPending, setIsPending] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${customerName}? This action cannot be undone.`)) return;

        setIsPending(true);
        try {
            await deleteCustomer(id);
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete} 
            disabled={isPending}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
            title="Delete Customer"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    );
}
