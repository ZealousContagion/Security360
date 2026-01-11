'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const Map = dynamic(() => import('./DashboardMap').then(mod => mod.DashboardMap), { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-accent/20 animate-pulse rounded-lg" />
});

export function DashboardMapClient() {
    return <Map />;
}
