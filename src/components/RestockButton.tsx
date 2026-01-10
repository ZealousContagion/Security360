'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { PackagePlus, Loader2 } from 'lucide-react';
import { restockItem } from '@/app/admin/catalog/actions';

export function RestockButton({ itemId }: { itemId: string }) {
    const [isPending, setIsPending] = useState(false);

    const handleRestock = async () => {
        const amount = prompt('Enter quantity to add to stock:');
        if (!amount || isNaN(Number(amount))) return;

        setIsPending(true);
        try {
            await restockItem(itemId, Number(amount));
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRestock}
            disabled={isPending}
            className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
            title="Restock Item"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackagePlus className="w-4 h-4" />}
        </Button>
    );
}
