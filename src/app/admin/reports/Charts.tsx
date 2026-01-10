'use client';

import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    CartesianGrid, 
    LineChart, 
    Line, 
    AreaChart, 
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

// --- Revenue vs Expenses Chart ---
export function ProfitabilityChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF9F46" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EF9F46" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    tick={{ fill: '#94a3b8' }}
                    dy={10}
                />
                <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    tick={{ fill: '#94a3b8' }}
                    tickFormatter={(value) => `£${value}`}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#EF9F46" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    name="Revenue"
                />
                <Area 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fillOpacity={0}
                    name="Expenses"
                    strokeDasharray="5 5"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// --- Service Breakdown Pie Chart ---
export function ServiceBreakdownChart({ data }: { data: any[] }) {
    const COLORS = ['#000000', '#EF9F46', '#334155', '#64748b', '#94a3b8'];

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => `£${value.toLocaleString()}`}
                />
                <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', paddingTop: '20px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}

// --- Simple Revenue Bar Chart (Legacy/Basic) ---
export function RevenueChart({ data }: { data: { name: string; total: number }[] }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `£${value}`} />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total" fill="#EF9F46" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}