'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Banknote, Loader2, CheckCircle2 } from 'lucide-react';
import { recordCashPayment } from './actions';

interface CashPaymentButtonProps {
    invoiceId: string;
    totalAmount: number;
    invoiceNumber: string;
    currentStatus: string;
}

export function CashPaymentButton({ invoiceId, totalAmount, invoiceNumber, currentStatus }: CashPaymentButtonProps) {
    const [isPending, setIsPending] = useState(false);

    if (currentStatus === 'PAID') {
        return (
            <div className="h-8 w-8 flex items-center justify-center text-success" title="Fully Paid">
                <CheckCircle2 className="w-4 h-4" />
            </div>
        );
    }

    const handleRecord = async () => {
        const deposit = totalAmount * 0.5;
        
        const choice = window.confirm(
            `Record Cash Payment for ${invoiceNumber}\n\n` +
            `OK: Record 50% Deposit (£${deposit.toLocaleString()})\n` +
            `Cancel: Record Full Payment (£${totalAmount.toLocaleString()})`
        );

        const amount = choice ? deposit : totalAmount;
        const type = choice ? 'DEPOSIT' : 'FULL';

        if (!window.confirm(`Confirm £${amount.toLocaleString()} Cash Payment?`)) return;

        setIsPending(true);
        try {
            const res = await recordCashPayment(invoiceId, amount, choice);
            if (res.success) {
                // Success feedback can be handled by revalidation, but maybe a toast here?
            } else {
                alert(`Error: ${res.error}`);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to record payment");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRecord}
            disabled={isPending}
            className="h-8 w-8 hover:bg-green-50 hover:text-green-600 text-muted-foreground"
            title="Record Cash Payment"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Banknote className="w-4 h-4" />
            )}
        </Button>
    );
}
