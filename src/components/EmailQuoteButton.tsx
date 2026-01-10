'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Mail, Loader2, Check } from 'lucide-react';
import { sendQuoteToCustomer } from '@/app/admin/quotes/actions';

interface EmailQuoteButtonProps {
    quoteId: string;
}

export function EmailQuoteButton({ quoteId }: EmailQuoteButtonProps) {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    const handleSend = async () => {
        setStatus('sending');
        try {
            const res = await sendQuoteToCustomer(quoteId);
            if (res.success) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
                alert(res.error);
            }
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSend}
            disabled={status === 'sending'}
            className={`h-8 w-8 hover:bg-primary/10 hover:text-primary ${status === 'success' ? 'text-green-600' : ''}`}
            title="Email to Customer"
        >
            {status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             status === 'success' ? <Check className="w-4 h-4" /> : 
             <Mail className="w-4 h-4" />}
        </Button>
    );
}
