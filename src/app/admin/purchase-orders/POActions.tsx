'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Truck, Loader2, CheckCircle } from 'lucide-react';
import { updatePurchaseOrderStatus } from './actions';

export function POActions({ poId, status }: { poId: string, status: string }) {
    const [isPending, setIsPending] = useState(false);

    if (status === 'RECEIVED') {
        return (
            <div className="flex items-center text-success gap-1 px-2 py-1">
                <CheckCircle className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Delivered</span>
            </div>
        );
    }

    const handleReceive = async () => {
        if (!confirm('Mark this purchase order as RECEIVED? This will increment stock levels for all items.')) return;
        
        setIsPending(true);
        try {
            await updatePurchaseOrderStatus(poId, 'RECEIVED');
        } catch (error) {
            console.error(error);
            setIsPending(false);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReceive}
            disabled={isPending}
            className="h-8 text-[10px] uppercase font-black tracking-widest hover:bg-primary/10 hover:text-primary"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <>
                    <Truck className="w-4 h-4 mr-2" />
                    Receive
                </>
            )}
        </Button>
    );
}
