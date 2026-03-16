'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { BellRing, Loader2, CheckCircle2 } from 'lucide-react';
import { sendBulkOverdueReminders } from '@/app/admin/invoices/actions';

export function OverdueRemindersButton() {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle');
    const [count, setCount] = useState(0);

    const handleSend = async () => {
        if (!confirm("Are you sure you want to send reminders to all overdue accounts?")) return;
        
        setStatus('pending');
        try {
            const res = await sendBulkOverdueReminders();
            if (res.success) {
                setCount(res.count);
                setStatus('success');
                setTimeout(() => setStatus('idle'), 5000);
            }
        } catch (error) {
            console.error(error);
            setStatus('idle');
        }
    };

    if (status === 'success') {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg border border-green-100 animate-in fade-in zoom-in-95">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{count} Reminders Dispatched</span>
            </div>
        );
    }

    return (
        <Button 
            variant="outline" 
            onClick={handleSend}
            disabled={status === 'pending'}
            className="text-[10px] uppercase font-black tracking-widest h-10 px-6 border-black/5 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all"
        >
            {status === 'pending' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BellRing className="w-4 h-4 mr-2" />}
            Nudge Overdue Accounts
        </Button>
    );
}