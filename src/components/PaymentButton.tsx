'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { createCheckoutSession } from '@/app/pay/actions';

interface PaymentButtonProps {
    invoiceId: string;
}

export function PaymentButton({ invoiceId }: PaymentButtonProps) {
    const [isPending, setIsPending] = useState(false);

    const handlePayment = async () => {
        setIsPending(true);
        try {
            await createCheckoutSession(invoiceId);
        } catch (err) {
            console.error(err);
            setIsPending(false);
            alert('Failed to initialize payment. Please try again.');
        }
    };

    return (
        <Button 
            onClick={handlePayment}
            disabled={isPending}
            className="w-full h-14 text-sm uppercase tracking-[0.2em] font-black shadow-lg shadow-primary/20"
        >
            {isPending ? (
                <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Redirecting to Stripe...
                </>
            ) : (
                <>
                    <CreditCard className="w-5 h-5 mr-3" />
                    Pay Deposit Now
                </>
            )}
        </Button>
    );
}
