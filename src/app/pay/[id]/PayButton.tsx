'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function PayButton({ invoiceId, amount, method, label }: { invoiceId: string, amount: number, method: string, label: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault(); // allow form but prevent def
        setLoading(true);
        // Simulate Webhook
        try {
            await fetch('/api/payments/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceId,
                    amount,
                    method,
                    reference: 'REF-' + Math.random().toString(36).substring(7),
                    secret: 'secure_webhook_secret_123'
                })
            });
            router.refresh();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handlePay} disabled={loading} className="w-full">
            {loading ? 'Processing...' : label}
        </Button>
    );
}
