'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueTrendChartProps {
    data: { date: string; value: number }[];
}

export function RevenueTrendChart({ data }: RevenueTrendChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFB700" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#FFB700" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold' }} 
                    className="uppercase tracking-widest"
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold' }}
                />
                <Tooltip 
                    contentStyle={{ 
                        borderRadius: '0px', 
                        border: '1px solid #e2e8f0',
                        boxShadow: 'none',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        letterSpacing: '0.1em'
                    }}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#FFB700" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    strokeWidth={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
