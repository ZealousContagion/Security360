'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function DateRangePicker() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentRange = searchParams.get('range') || '30d';

    const ranges = [
        { label: '7D', value: '7d' },
        { label: '30D', value: '30d' },
        { label: '90D', value: '90d' },
        { label: 'YTD', value: 'ytd' },
        { label: 'ALL', value: 'all' },
    ];

    const setRange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('range', value);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center bg-white border border-black/5 rounded-lg p-1 gap-1">
            {ranges.map((r) => (
                <Button
                    key={r.value}
                    variant={currentRange === r.value ? 'default' : 'ghost'}
                    className={`h-7 px-3 text-[10px] font-black uppercase tracking-widest ${
                        currentRange === r.value ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    }`}
                    onClick={() => setRange(r.value)}
                >
                    {r.label}
                </Button>
            ))}
        </div>
    );
}
