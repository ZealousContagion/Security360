'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react';

interface PaymentButtonProps {
    invoiceId: string;
}

export function PaymentButton({ invoiceId }: PaymentButtonProps) {
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

    const handlePayment = async () => {
        setStatus('processing');
        try {
            const res = await fetch(`/api/payments/${invoiceId}/mock-pay`, { method: 'POST' });
            if (res.ok) {
                setStatus('success');
                // Optional: redirect or refresh
                setTimeout(() => window.location.reload(), 2000);
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="w-full h-14 bg-green-600 text-white rounded-md flex items-center justify-center font-black uppercase tracking-[0.2em] animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-5 h-5 mr-3" />
                Payment Confirmed
            </div>
        );
    }

    return (
        <Button 
            onClick={handlePayment}
            disabled={status === 'processing'}
            className="w-full h-14 text-sm uppercase tracking-[0.2em] font-black shadow-lg shadow-primary/20"
        >
            {status === 'processing' ? (
                <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Processing...
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
