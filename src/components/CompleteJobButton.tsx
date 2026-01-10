'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { CheckCircle, Loader2 } from 'lucide-react';
import { completeJob } from '@/app/admin/field/actions';

interface CompleteJobButtonProps {
    jobId: string;
    isCompleted: boolean;
}

export function CompleteJobButton({ jobId, isCompleted }: CompleteJobButtonProps) {
    const [isPending, setIsPending] = useState(false);

    const handleComplete = async () => {
        if (!confirm('Are you sure this job is complete? This will automatically decrement inventory levels.')) return;
        
        setIsPending(true);
        try {
            const res = await completeJob(jobId);
            if (!res.success) {
                alert('Error completing job: ' + res.error);
            }
        } finally {
            setIsPending(false);
        }
    };

    if (isCompleted) {
        return (
            <div className="flex-1 bg-green-50 text-green-600 rounded-md flex items-center justify-center font-black text-[9px] uppercase tracking-widest border border-green-200">
                <CheckCircle className="w-3 h-3 mr-2" />
                Done
            </div>
        );
    }

    return (
        <Button 
            variant="ghost" 
            onClick={handleComplete}
            disabled={isPending}
            className="flex-1 text-[9px] uppercase tracking-widest font-black h-10 px-6 text-green-600 hover:bg-green-50"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                </>
            )}
        </Button>
    );
}
