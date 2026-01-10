'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { BellRing, Loader2 } from 'lucide-react';
import { sendOverdueReminders } from '@/app/admin/invoices/actions';

export function OverdueRemindersButton() {
    const [isPending, setIsPending] = useState(false);

    const handleRemind = async () => {
        if (!confirm('This will send reminder emails to all customers with invoices older than 7 days. Continue?')) return;
        
        setIsPending(true);
        try {
            const res = await sendOverdueReminders();
            if (res.success) {
                alert(`Successfully queued ${res.count} reminders.`);
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Button 
            variant="outline" 
            onClick={handleRemind}
            disabled={isPending}
            className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6 border-destructive/20 text-destructive hover:bg-destructive/5"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BellRing className="w-4 h-4 mr-2" />}
            Remind Overdue
        </Button>
    );
}
