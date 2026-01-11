import { prisma } from "@/core/database";
import { isManager } from "@/lib/rbac";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DollarSign, BarChart3, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Wallet, Target } from "lucide-react";
import { RevenueChart, ProfitabilityChart, ServiceBreakdownChart } from "./Charts";

async function getStats() {
    // 1. Revenue Data
    const paidInvoices = await prisma.invoice.findMany({
        where: { status: 'PAID' },
        include: { quote: { include: { fencingService: true } } }
    });
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + Number(inv.total), 0);

    const outstandingInvoices = await prisma.invoice.findMany({
        where: { status: { in: ['SENT', 'PENDING', 'PARTIAL'] } }
    });
    const totalOutstanding = outstandingInvoices.reduce((acc, inv) => acc + Number(inv.total), 0);

    // 2. Expense Data
    const allExpenses = await prisma.expense.findMany();
    const totalExpenses = allExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0);

    // 3. Profitability
    const grossProfit = totalRevenue - totalExpenses;
    const netMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // 4. Monthly Aggregation (Last 6 Months)
    const monthlyDataMap = new Map<string, { name: string, revenue: number, expenses: number }>();
    
    // Fill last 6 months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = d.toLocaleString('default', { month: 'short' });
        monthlyDataMap.set(key, { name: key, revenue: 0, expenses: 0 });
    }

    paidInvoices.forEach(inv => {
        const key = new Date(inv.createdAt).toLocaleString('default', { month: 'short' });
        if (monthlyDataMap.has(key)) {
            monthlyDataMap.get(key)!.revenue += Number(inv.total);
        }
    });

    allExpenses.forEach(exp => {
        const key = new Date(exp.date).toLocaleString('default', { month: 'short' });
        if (monthlyDataMap.has(key)) {
            monthlyDataMap.get(key)!.expenses += Number(exp.amount);
        }
    });

    const monthlyStats = Array.from(monthlyDataMap.values());

    // 5. Service Breakdown
    const serviceMap = new Map<string, number>();
    paidInvoices.forEach(inv => {
        const name = inv.quote?.fencingService.name || 'Other';
        serviceMap.set(name, (serviceMap.get(name) || 0) + Number(inv.total));
    });
    const serviceBreakdown = Array.from(serviceMap.entries()).map(([name, value]) => ({ name, value }));

    // 6. Conversion Analytics
    const totalQuotes = await prisma.fenceQuote.count();
    const wonQuotes = await prisma.fenceQuote.count({ where: { status: 'APPROVED' } });
    const conversionRate = totalQuotes > 0 ? (wonQuotes / totalQuotes) * 100 : 0;

    return {
        totalRevenue,
        totalOutstanding,
        totalExpenses,
        grossProfit,
        netMargin,
        monthlyStats,
        serviceBreakdown,
        conversionRate,
        invoiceCount: paidInvoices.length + outstandingInvoices.length,
        quoteCount: totalQuotes
    };
}

export default async function ReportsPage() {
    if (!await isManager()) {
        redirect("/admin/dashboard");
    }

    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-black">Financial Intelligence</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Deep-dive revenue & operational analytics</p>
                </div>
                <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 shadow-xl">
                    <Target className="w-4 h-4 text-primary" />
                    <div>
                        <p className="text-[8px] uppercase font-black text-primary leading-none">Conversion Rate</p>
                        <p className="text-sm font-black mt-0.5">{Math.round(stats.conversionRate)}%</p>
                    </div>
                </div>
            </div>

            {/* Top Level KPIs */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Gross Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">${stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold mt-1 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3 text-green-500" />
                            Lifetime Collected
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Total Expenses</CardTitle>
                        <Wallet className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">${stats.totalExpenses.toLocaleString()}</div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold mt-1 flex items-center gap-1">
                            <ArrowDownRight className="w-3 h-3 text-red-500" />
                            Material & Ops Cost
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-black text-white border-none shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <DollarSign className="w-20 h-20" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Net Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-white">${stats.grossProfit.toLocaleString()}</div>
                        <div className="mt-2 flex items-center gap-2">
                            <Badge variant="success" className="text-[8px] px-1.5 h-4 border-none bg-primary text-black font-black">
                                {Math.round(stats.netMargin)}% MARGIN
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Receivables</CardTitle>
                        <DollarSign className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-amber-600">${stats.totalOutstanding.toLocaleString()}</div>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold mt-1">Pending Invoices</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold">Profitability Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ProfitabilityChart data={stats.monthlyStats} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold">Revenue by Service</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ServiceBreakdownChart data={stats.serviceBreakdown} />
                    </CardContent>
                </Card>
            </div>

            {/* Strategic Insights */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl flex items-start gap-8 shadow-2xl border border-white/5">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shrink-0 rotate-3 shadow-lg">
                    <BarChart3 className="text-black w-8 h-8" />
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Senior Engineer Strategic Audit</h4>
                    <p className="text-sm leading-relaxed text-slate-300 max-w-3xl">
                        Based on current data, your <span className="text-white font-bold">Net Margin is sitting at {Math.round(stats.netMargin)}%</span>. 
                        {stats.netMargin < 20 ? " This is below industry standard. We recommend reviewing material costs in the Service Catalog." : " Your profitability is healthy. Scaling operations while maintaining this margin will require automated dispatch optimization."} 
                        Additionally, your <span className="text-white font-bold">Conversion Rate of {Math.round(stats.conversionRate)}%</span> suggests strong market fit.
                    </p>
                    <div className="flex gap-6 pt-2">
                        <div>
                            <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Total Quotes</p>
                            <p className="text-lg font-black">{stats.quoteCount}</p>
                        </div>
                        <div className="w-[1px] bg-white/10" />
                        <div>
                            <p className="text-[8px] uppercase font-black text-slate-500 tracking-widest">Avg Quote Value</p>
                            <p className="text-lg font-black">${Math.round(stats.totalRevenue / (stats.invoiceCount || 1)).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
