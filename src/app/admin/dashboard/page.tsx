import React, { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { isManager } from '@/lib/rbac';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Activity, DollarSign, FileText, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import { RevenueByServiceChart } from './RevenueByServiceChart';
import { Decimal } from '@prisma/client/runtime/library';

// --- Sub-components for Streaming ---

async function DashboardStats() {
    // 1. Total Revenue (Paid Invoices)
    const paidInvoices = await prisma.invoice.findMany({
        where: { status: 'PAID' },
        select: { total: true }
    });
    const totalRevenue = paidInvoices.reduce((acc, curr) => acc.add(curr.total), new Decimal(0));

    // 2. Counts
    const paidCount = await prisma.invoice.count({ where: { status: 'PAID' } });
    const pendingCount = await prisma.invoice.count({ where: { status: 'PENDING' } });

    // 3. Conversion Funnel
    const totalQuotes = await prisma.fenceQuote.count();
    const convertedQuotes = await prisma.invoice.count({
        where: { quoteId: { not: null } }
    });
    const conversionRate = totalQuotes > 0 ? (convertedQuotes / totalQuotes) * 100 : 0;

    return (
        <div className="grid gap-6 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black">£{totalRevenue.toNumber().toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Lifetime processed</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Conversion Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black">{Math.round(conversionRate)}%</div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">{convertedQuotes} of {totalQuotes} converted</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Paid Invoices</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black">{paidCount}</div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Closed orders</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Pending</CardTitle>
                    <Activity className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black">{pendingCount}</div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">In progress</p>
                </CardContent>
            </Card>
        </div>
    );
}

async function RevenueCharts() {
    const paidInvoicesWithService = await prisma.invoice.findMany({
        where: { status: 'PAID', quoteId: { not: null } },
        include: {
            quote: {
                include: { fencingService: true }
            }
        }
    });

    const revenueByServiceMap: Record<string, number> = {};
    for (const inv of paidInvoicesWithService) {
        if (inv.quote?.fencingService) {
            const name = inv.quote.fencingService.name;
            revenueByServiceMap[name] = (revenueByServiceMap[name] || 0) + inv.total.toNumber();
        }
    }

    const chartData = Object.entries(revenueByServiceMap).map(([name, value]) => ({ name, value }));

    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest font-bold">Revenue by Service</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] pt-4">
                <RevenueByServiceChart data={chartData} />
            </CardContent>
        </Card>
    );
}

async function RecentActivity() {
    const recentInvoices = await prisma.invoice.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { customer: true }
    });

    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest font-bold">Recent Invoices</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 pt-2">
                    {recentInvoices.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-12 h-12 text-muted/30 mx-auto" />
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-4">No recent activity</p>
                        </div>
                    ) : (
                        recentInvoices.map((inv) => (
                            <div key={inv.id} className="flex items-center justify-between border-b border-dashed pb-3 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-tight">{inv.customer.name}</p>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-2.5 h-2.5" />
                                        <span className="text-[8px] uppercase font-bold">{new Date(inv.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black tracking-tighter">£{Number(inv.total).toFixed(2)}</p>
                                    <Badge variant="outline" className="text-[7px] h-4 uppercase font-black tracking-widest border-black/5 mt-1">
                                        {inv.status}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// --- Main Page Component ---

export default async function DashboardPage() {
    if (!await isManager()) {
        redirect("/admin/quotes");
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Dashboard</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Real-Time Operational Overview</p>
            </div>

            <div className="space-y-8">
                <Suspense fallback={<div className="h-32 w-full bg-accent/20 animate-pulse rounded-lg" />}>
                    <DashboardStats />
                </Suspense>
                
                <div className="grid gap-6 md:grid-cols-7">
                    <Suspense fallback={<Card className="col-span-4 h-[400px] animate-pulse bg-accent/10" />}>
                        <RevenueCharts />
                    </Suspense>
                    
                    <Suspense fallback={<Card className="col-span-3 h-[400px] animate-pulse bg-accent/10" />}>
                        <RecentActivity />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}