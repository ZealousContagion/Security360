'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, DollarSign, FileText, CheckCircle, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/dashboard/summary')
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">Initializing Data...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Dashboard</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Operational Overview</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">£{data.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Lifetime processed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{data.conversionRate}%</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">{data.convertedQuotes} of {data.totalQuotes} converted</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Paid Invoices</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{data.paidCount}</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Closed orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Pending</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{data.pendingCount}</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">In progress</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold">Revenue by Service</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.revenueByService}>
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
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold">Recent Invoices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 pt-2">
                            {/* Placeholder for real invoice feed if added to summary or separate fetch */}
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 text-muted/30 mx-auto" />
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-4">Feed coming soon</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

