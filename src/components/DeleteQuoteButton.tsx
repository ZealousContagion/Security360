'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function DeleteQuoteButton({ quoteId }: { quoteId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this quote? This action cannot be undone.')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/fencing-quotes/${quoteId}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to delete quote');
            }
        } catch (err) {
            alert('An error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            title="Delete Quote"
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    );
}
