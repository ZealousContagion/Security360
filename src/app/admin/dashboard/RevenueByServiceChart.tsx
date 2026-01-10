'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueByServiceChartProps {
    data: { name: string; value: number }[];
}

export function RevenueByServiceChart({ data }: RevenueByServiceChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                    dataKey="name" 
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
                    cursor={{ fill: 'transparent' }}
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
                <Bar dataKey="value" fill="#FFB700" radius={[2, 2, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
