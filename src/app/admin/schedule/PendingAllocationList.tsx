'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { scheduleJob } from './actions';
import { Loader2 } from 'lucide-react';

interface Job {
    id: string;
    invoice: {
        customer: { name: string };
        quote: { fencingService: { name: string } | null } | null;
    };
}

export function PendingAllocationList({ jobs }: { jobs: Job[] }) {
    const [loadingId, setLoadingLoadingId] = useState<string | null>(null);

    const handleQuickSchedule = async (jobId: string) => {
        const dateStr = prompt("Enter scheduling date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
        if (!dateStr) return;

        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            alert("Invalid date format");
            return;
        }

        setLoadingLoadingId(jobId);
        try {
            const res = await scheduleJob(jobId, date);
            if (!res.success) {
                alert("Error: " + res.error);
            }
        } finally {
            setLoadingLoadingId(null);
        }
    };

    if (jobs.length === 0) {
        return <p className="text-[9px] text-slate-400 uppercase font-bold text-center py-8">All jobs scheduled.</p>;
    }

    return (
        <div className="space-y-4">
            {jobs.map(job => (
                <div 
                    key={job.id} 
                    onClick={() => handleQuickSchedule(job.id)}
                    className="p-4 bg-white/10 rounded border border-white/5 hover:bg-white/20 transition-all cursor-pointer group relative"
                >
                    {loadingId === job.id && (
                        <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center z-10">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                    )}
                    <p className="text-[10px] font-black uppercase tracking-tight">{job.invoice.customer.name}</p>
                    <p className="text-[8px] text-slate-400 uppercase font-bold mt-1">{job.invoice.quote?.fencingService?.name || 'Standard Service'}</p>
                    <div className="mt-3 flex justify-between items-center">
                        <Badge className="text-[7px] bg-primary text-black font-black border-none px-1.5 h-4 uppercase">Pending Date</Badge>
                        <span className="text-[8px] text-primary font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">Assign Date</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
