'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { customerApproveQuote } from '@/app/portal/actions';

interface ApproveQuoteButtonProps {
    quoteId: string;
}

export function ApproveQuoteButton({ quoteId }: ApproveQuoteButtonProps) {
    const [isPending, setIsPending] = useState(false);

    const handleApprove = async () => {
        if (!confirm('By approving this quote, you agree to the terms and an invoice will be generated for your deposit.')) return;
        
        setIsPending(true);
        try {
            const res = await customerApproveQuote(quoteId);
            if (!res.success) {
                alert('Error approving quote: ' + res.error);
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Button 
            size="sm" 
            onClick={handleApprove}
            disabled={isPending}
            className="text-[9px] uppercase tracking-widest font-black h-7 px-3 bg-green-600 hover:bg-green-700"
        >
            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : (
                <>
                    <CheckCircle2 className="w-3 h-3 mr-2" />
                    Approve & Request Invoice
                </>
            )}
        </Button>
    );
}
