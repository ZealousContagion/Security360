'use client';

import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function QuoteActions({ quoteId, status }: { quoteId: string, status: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleAction = async (action: 'approve' | 'convert-to-invoice') => {
        if (!confirm('Are you sure?')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/fencing-quotes/${quoteId}/${action}`, { method: 'POST' });
            if (res.ok) {
                if (action === 'convert-to-invoice') {
                    router.push('/admin/invoices');
                } else if (action === 'approve') {
                    router.push('/admin/schedule'); // Direct to schedule after manual approval
                } else {
                    router.refresh();
                }
            } else {
                alert('Action failed');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'DRAFT') {
        return <Button onClick={() => handleAction('approve')} disabled={loading}>Approve Quote</Button>;
    }
    if (status === 'APPROVED') {
        return <Button onClick={() => handleAction('convert-to-invoice')} disabled={loading}>Convert to Invoice</Button>;
    }

    return null;
}
