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
            variant="outline" 
            onClick={handleSend}
            disabled={status === 'sending'}
            className={`text-[10px] uppercase tracking-widest font-black h-10 px-6 ${status === 'success' ? 'text-green-600 border-green-600' : ''}`}
            title="Email to Customer"
        >
            {status === 'sending' ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                </>
            ) : status === 'success' ? (
                <>
                    <Check className="w-4 h-4 mr-2" />
                    Sent!
                </>
            ) : (
                <>
                    <Mail className="w-4 h-4 mr-2" />
                    Email Quote
                </>
            )}
        </Button>
    );
}
