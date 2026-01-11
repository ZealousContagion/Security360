import React, { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { isManager } from '@/lib/rbac';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
    Activity, 
    DollarSign, 
    FileText, 
    CheckCircle, 
    TrendingUp, 
    Clock, 
    Package, 
    Calendar, 
    AlertTriangle,
    PlusCircle,
    ShoppingCart,
    FilePlus,
    Users,
    ArrowUpRight,
    Briefcase,
    ShieldCheck,
    CloudSun,
    Map as MapIcon,
    BarChart3
} from 'lucide-react';
import { RevenueByServiceChart } from './RevenueByServiceChart';
import { RevenueTrendChart } from './RevenueTrendChart';
import { DateRangePicker } from './DateRangePicker';
import { DashboardMapClient } from './DashboardMapClient';
import { Decimal } from '@/generated/client/runtime/library';
import Link from 'next/link';

// --- Types ---
type DateRange = '7d' | '30d' | '90d' | 'ytd' | 'all';

// --- Helper Functions ---

function getDateFilter(range: DateRange) {
    const now = new Date();
    const filter: { gte?: Date } = {};
    
    if (range === '7d') filter.gte = new Date(now.setDate(now.getDate() - 7));
    else if (range === '30d') filter.gte = new Date(now.setDate(now.getDate() - 30));
    else if (range === '90d') filter.gte = new Date(now.setDate(now.getDate() - 90));
    else if (range === 'ytd') filter.gte = new Date(new Date().getFullYear(), 0, 1);
    
    return filter.gte ? { createdAt: { gte: filter.gte } } : {};
}

async function getStats(range: DateRange) {
    const dateFilter = getDateFilter(range);
    const invoiceDateFilter = range === 'all' ? {} : { issuedAt: getDateFilter(range).createdAt };

    const paidInvoices = await prisma.invoice.findMany({
        where: { status: 'PAID', ...invoiceDateFilter },
        select: { total: true }
    });
    const totalRevenue = paidInvoices.reduce((acc, curr) => acc.add(curr.total), new Decimal(0));

    const totalQuotes = await prisma.fenceQuote.count({ where: dateFilter });
    const convertedQuotes = await prisma.invoice.count({
        where: { quoteId: { not: null }, ...invoiceDateFilter }
    });
    const conversionRate = totalQuotes > 0 ? (convertedQuotes / totalQuotes) * 100 : 0;

    const pendingInvoices = await prisma.invoice.findMany({
        where: { status: 'PENDING', ...invoiceDateFilter },
        select: { total: true }
    });
    const pendingAmount = pendingInvoices.reduce((acc, curr) => acc.add(curr.total), new Decimal(0));

    const activeJobsCount = await prisma.job.count({
        where: {
            status: { in: ['SCHEDULED', 'STARTED', 'ON_SITE'] }
        }
    });

    const expenseDateFilter = range === 'all' ? {} : { date: getDateFilter(range).createdAt };
    const expenses = await prisma.expense.findMany({
        where: expenseDateFilter,
        select: { amount: true }
    });
    const totalExpenses = expenses.reduce((acc, curr) => acc.add(curr.amount), new Decimal(0));
    
    const netProfit = totalRevenue.minus(totalExpenses);

    return {
        totalRevenue: totalRevenue.toNumber(),
        conversionRate: Math.round(conversionRate),
        pendingAmount: pendingAmount.toNumber(),
        totalExpenses: totalExpenses.toNumber(),
        netProfit: netProfit.toNumber(),
        totalQuotes,
        activeJobsCount
    };
}

async function getChartData(range: DateRange) {
    const invoiceDateFilter = range === 'all' ? {} : { issuedAt: getDateFilter(range).createdAt };

    const paidInvoicesWithService = await prisma.invoice.findMany({
        where: { status: 'PAID', quoteId: { not: null }, ...invoiceDateFilter },
        include: {
            quote: {
                include: { fencingService: true }
            }
        }
    });

    const revenueByServiceMap: Record<string, number> = {};
    const serviceProfitMap: Record<string, { revenue: number, expense: number }> = {};

    for (const inv of paidInvoicesWithService) {
        if (inv.quote?.fencingService) {
            const name = inv.quote.fencingService.name;
            revenueByServiceMap[name] = (revenueByServiceMap[name] || 0) + inv.total.toNumber();
            
            if (!serviceProfitMap[name]) serviceProfitMap[name] = { revenue: 0, expense: 0 };
            serviceProfitMap[name].revenue += inv.total.toNumber();
        }
    }

    // Fetch expenses linked to jobs from these invoices
    const invoiceIds = paidInvoicesWithService.map(inv => inv.id);
    const linkedExpenses = await prisma.expense.findMany({
        where: {
            job: {
                invoiceId: { in: invoiceIds }
            }
        },
        include: {
            job: {
                include: {
                    invoice: {
                        include: {
                            quote: {
                                include: { fencingService: true }
                            }
                        }
                    }
                }
            }
        }
    });

    for (const exp of linkedExpenses) {
        const name = exp.job?.invoice.quote?.fencingService.name;
        if (name && serviceProfitMap[name]) {
            serviceProfitMap[name].expense += exp.amount.toNumber();
        }
    }

    const serviceData = Object.entries(revenueByServiceMap).map(([name, value]) => ({ name, value }));
    const profitData = Object.entries(serviceProfitMap).map(([name, data]) => ({
        name,
        revenue: data.revenue,
        expense: data.expense,
        margin: data.revenue > 0 ? ((data.revenue - data.expense) / data.revenue) * 100 : 0
    })).sort((a, b) => b.margin - a.margin);

    const allPaid = await prisma.invoice.findMany({
        where: { status: 'PAID', ...invoiceDateFilter },
        select: { total: true, issuedAt: true },
        orderBy: { issuedAt: 'asc' }
    });

    const trendMap: Record<string, number> = {};
    for (const inv of allPaid) {
        const key = range === '7d' 
            ? inv.issuedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            : inv.issuedAt.toLocaleString('en-GB', { month: 'short' });
        trendMap[key] = (trendMap[key] || 0) + inv.total.toNumber();
    }

    const trendData = Object.entries(trendMap).map(([date, value]) => ({ date, value }));

    return { serviceData, trendData, profitData };
}

async function getTeamPerformance() {
    const members = await prisma.teamMember.findMany({
        include: {
            Jobs: {
                where: { status: 'COMPLETED' }
            }
        }
    });

    return members.map(m => ({
        name: m.name,
        jobsDone: m.Jobs.length,
        role: m.role
    })).sort((a, b) => b.jobsDone - a.jobsDone);
}

// --- Components ---

function WeatherWidget() {
    return (
        <Card className="bg-primary/5 border-primary/10">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <CloudSun className="w-3 h-3 text-primary" />
                    Field Conditions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-black">24°C</p>
                        <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest">Partly Cloudy • Harare</p>
                    </div>
                    <div className="text-right">
                        <Badge variant="outline" className="text-[7px] font-black uppercase bg-white text-green-600 border-green-200">
                            Optimal
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

async function ServiceProfitability({ data }: { data: any[] }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Service Profitability</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.length === 0 ? (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold text-center py-4">No margin data</p>
                    ) : (
                        data.map((service) => (
                            <div key={service.name} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-tight">
                                    <span>{service.name}</span>
                                    <span className={service.margin > 40 ? 'text-green-600' : 'text-orange-600'}>
                                        {Math.round(service.margin)}% Margin
                                    </span>
                                </div>
                                <div className="flex justify-between text-[8px] text-muted-foreground font-bold uppercase">
                                    <span>Rev: ${service.revenue.toLocaleString()}</span>
                                    <span>Exp: ${service.expense.toLocaleString()}</span>
                                </div>
                                <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all ${service.margin > 40 ? 'bg-green-500' : 'bg-primary'}`}
                                        style={{ width: `${service.margin}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

async function TeamPerformance() {
    const team = await getTeamPerformance();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Team Performance</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {team.length === 0 ? (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold text-center py-4">No team data</p>
                    ) : (
                        team.slice(0, 5).map((member) => (
                            <div key={member.name} className="flex items-center justify-between border-b border-dashed border-black/5 pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-tight">{member.name}</p>
                                    <p className="text-[8px] text-muted-foreground font-bold uppercase">{member.role}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold">{member.jobsDone}</p>
                                    <p className="text-[8px] text-muted-foreground uppercase font-bold">Jobs Done</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

async function StatsGrid({ range }: { range: DateRange }) {
    const stats = await getStats(range);

    return (
        <div className="grid gap-6 md:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black">${stats.totalRevenue.toLocaleString()}</div>
                    <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-2 h-2 text-green-500" />
                        <p className="text-[8px] text-green-600 uppercase tracking-widest font-bold">In selected period</p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Net Profit</CardTitle>
                    <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-black ${stats.netProfit < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${stats.netProfit.toLocaleString()}
                    </div>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">After ${stats.totalExpenses.toLocaleString()} expenses</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Active Jobs</CardTitle>
                    <Briefcase className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black">{stats.activeJobsCount}</div>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">In field / scheduled</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Pending</CardTitle>
                    <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black">${stats.pendingAmount.toLocaleString()}</div>
                    <p className="text-[8px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Unpaid invoices</p>
                </CardContent>
            </Card>
        </div>
    );
}

// --- Main Page ---

interface PageProps {
    searchParams: Promise<{ range?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
    if (!await isManager()) {
        redirect("/admin/quotes");
    }

    const { range = '30d' } = await searchParams;
    const validatedRange = (['7d', '30d', '90d', 'ytd', 'all'].includes(range) ? range : '30d') as DateRange;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Operations Dashboard</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Real-time performance metrics</p>
                </div>
                <div className="flex items-center gap-4">
                    <DateRangePicker />
                    <div className="text-right hidden md:block">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Snapshot At</p>
                        <p className="text-[10px] font-black uppercase">{new Date().toLocaleString('en-GB', { timeStyle: 'short' })}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Suspense fallback={<div className="h-32 w-full bg-accent/20 animate-pulse rounded-lg" />}>
                        <StatsGrid range={validatedRange} />
                    </Suspense>
                </div>
                <WeatherWidget />
            </div>

            <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-12">
                    {/* Left Column - Charts & Map */}
                    <div className="col-span-full md:col-span-8 space-y-6">
                        <Suspense fallback={<Card className="h-[350px] animate-pulse bg-accent/10" />}>
                            <ChartsSection range={validatedRange} />
                        </Suspense>

                        <Card className="h-[400px]">
                                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Installation Density</CardTitle>
                                                            <MapIcon className="h-4 w-4 text-muted-foreground" />
                                                        </CardHeader>
                                                        <CardContent className="h-[340px]">   
                                                            <DashboardMapClient />
                                                        </CardContent>
                            
                        </Card>
                    </div>

                    {/* Right Column - Lists & Metrics */}
                    <div className="col-span-full md:col-span-4 space-y-6">
                        <Suspense fallback={<Card className="h-[300px] animate-pulse bg-accent/10" />}>
                            <ProfitabilityWrapper range={validatedRange} />
                        </Suspense>

                        <Suspense fallback={<Card className="h-[200px] animate-pulse bg-accent/10" />}>
                            <TeamPerformance />
                        </Suspense>

                        <Suspense fallback={<Card className="h-[200px] animate-pulse bg-accent/10" />}>
                            <InventoryAlerts />
                        </Suspense>
                        
                        <Suspense fallback={<Card className="h-[300px] animate-pulse bg-accent/10" />}>
                            <UpcomingJobs />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}

async function ProfitabilityWrapper({ range }: { range: DateRange }) {
    const { profitData } = await getChartData(range);
    return <ServiceProfitability data={profitData} />;
}

async function ChartsSection({ range }: { range: DateRange }) {
    const { serviceData, trendData } = await getChartData(range);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Revenue trend ({range.toUpperCase()})</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] pt-4">
                    <RevenueTrendChart data={trendData} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Revenue by Service</CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] pt-4">
                    <RevenueByServiceChart data={serviceData} />
                </CardContent>
            </Card>
        </div>
    );
}

async function InventoryAlerts() {
    const alerts = await prisma.catalogItem.findMany({
        where: {
            stockLevel: { lte: prisma.catalogItem.fields.minStockLevel }
        },
        take: 5
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Low Stock Alerts</CardTitle>
                <div className="flex gap-2">
                    <Link href="/admin/purchase-orders/new">
                        <PlusCircle className="h-4 w-4 text-primary hover:scale-110 transition-transform" />
                    </Link>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {alerts.length === 0 ? (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold text-center py-4">All stock healthy</p>
                    ) : (
                        alerts.map((item) => (
                            <div key={item.id} className="flex items-center justify-between border-b border-dashed border-black/5 pb-2 last:border-0 last:pb-0">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-tight">{item.name}</p>
                                    <p className="text-[8px] text-muted-foreground font-bold uppercase">{item.category}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-orange-600">{Number(item.stockLevel)} {item.unit}</p>
                                    </div>
                                    <Link 
                                        href={`/admin/purchase-orders/new?catalogItemId=${item.id}&quantity=${Math.ceil(Number(item.minStockLevel) * 2)}`}
                                        className="p-1.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded transition-colors group"
                                        title="Restock now"
                                    >
                                        <ShoppingCart className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

async function UpcomingJobs() {
    const jobs = await prisma.job.findMany({
        where: {
            status: { in: ['SCHEDULED', 'STARTED', 'ON_SITE'] },
            scheduledDate: { gte: new Date(new Date().setHours(0,0,0,0)) }
        },
        take: 5,
        orderBy: { scheduledDate: 'asc' },
        include: {
            invoice: { include: { customer: true } },
            assignedTo: true
        }
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Job Schedule</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {jobs.length === 0 ? (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold text-center py-4">No active jobs scheduled</p>
                    ) : (
                        jobs.map((job) => (
                            <div key={job.id} className="flex items-center justify-between border-b border-dashed border-black/5 pb-2 last:border-0 last:pb-0">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[10px] font-black uppercase tracking-tight">{job.invoice.customer.name}</p>
                                        {job.assignedTo && (
                                            <span className="text-[7px] bg-black text-white px-1 py-0.5 rounded font-black uppercase" title={`Assigned to ${job.assignedTo.name}`}>
                                                {job.assignedTo.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Clock className="w-2.5 h-2.5" />
                                        <span className="text-[8px] uppercase font-bold">
                                            {job.scheduledDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>
                                <Badge 
                                    variant={job.status === 'STARTED' || job.status === 'ON_SITE' ? 'success' : 'outline'} 
                                    className="text-[7px] h-4 uppercase font-black tracking-widest border-black/5"
                                >
                                    {job.status}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
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
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4 pt-2">
                    {recentInvoices.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between border-b border-dashed border-black/5 pb-3 last:border-0 last:pb-0">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-tight">{inv.customer.name}</p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-2.5 h-2.5" />
                                    <span className="text-[8px] uppercase font-bold">{new Date(inv.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black tracking-tighter">${Number(inv.total).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}