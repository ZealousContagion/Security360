import { prisma } from "@/core/database";
import { isManager } from "@/lib/rbac";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DollarSign, BarChart3, TrendingUp, PieChart } from "lucide-react";
import { RevenueChart } from "./Charts";

async function getStats() {
    const paidInvoices = await prisma.invoice.findMany({
        where: { status: 'PAID' }
    });
    const totalRevenue = paidInvoices.reduce((acc, inv) => acc + Number(inv.total), 0);

    const outstandingInvoices = await prisma.invoice.findMany({
        where: { status: { in: ['SENT', 'PENDING'] } }
    });
    const totalOutstanding = outstandingInvoices.reduce((acc, inv) => acc + Number(inv.total), 0);

    const revenueByMonthMap = new Map<string, number>();
    paidInvoices.forEach(inv => {
        const date = new Date(inv.createdAt);
        const month = date.toLocaleString('default', { month: 'short' });
        const val = Number(inv.total);
        revenueByMonthMap.set(month, (revenueByMonthMap.get(month) || 0) + val);
    });

    if (revenueByMonthMap.size === 0) {
        revenueByMonthMap.set('Jan', 0);
        revenueByMonthMap.set('Feb', 0);
        revenueByMonthMap.set('Mar', 0);
    }

    const revenueByMonth = Array.from(revenueByMonthMap.entries()).map(([name, total]) => ({ name, total }));

    return {
        totalRevenue,
        totalOutstanding,
        revenueByMonth,
        invoiceCount: paidInvoices.length + outstandingInvoices.length
    };
}

export default async function ReportsPage() {
    if (!await isManager()) {
        redirect("/admin/dashboard");
    }

    const stats = await getStats();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Financial Reports</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Analytics and revenue insights</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Total Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">£{stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Lifetime collected</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Outstanding</CardTitle>
                        <DollarSign className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-destructive">£{stats.totalOutstanding.toLocaleString()}</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Pending payment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Invoice Count</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{stats.invoiceCount}</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Total generated</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold">Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RevenueChart data={stats.revenueByMonth} />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold">Quick Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 pt-2">
                            <div className="p-4 bg-accent/50 rounded flex items-center gap-4">
                                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                    <PieChart className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none">Best Month</p>
                                    <p className="text-sm font-bold mt-1">September 2023</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
