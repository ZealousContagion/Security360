'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RevenueByServiceChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#FFB700', '#FF8C00', '#FFD700', '#DAA520', '#B8860B'];

export function RevenueByServiceChart({ data }: RevenueByServiceChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} 
                    className="uppercase tracking-widest"
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }}
                />
                <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
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
                <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={40}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
