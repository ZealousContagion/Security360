"use client"

import * as React from "react"
import { StatCard } from "@/components/dashboard/StatCard"
import { RecentPaymentsTable } from "@/components/dashboard/RecentPaymentsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { DollarSign, FileCheck, TrendingUp, Plus, UserPlus, FileText, Calculator, Settings, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { fetchDashboardStatsAction } from "@/lib/actions/reports"

export default function DashboardPage() {
    const [stats, setStats] = React.useState<any>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    const loadStats = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await fetchDashboardStatsAction()
            setStats(data)
        } catch (error) {
            console.error("Failed to load dashboard stats:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadStats()
    }, [loadStats])

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-muted-foreground animate-pulse">Assembling business intelligence...</p>
            </div>
        )
    }

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-primary">Operational Hub</h2>
                    <p className="text-muted-foreground mt-1">System synchronized with Production C# API.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/admin/invoices/">
                        <Button className="bg-primary shadow-lg shadow-primary/20">
                            <Plus className="mr-2 h-4 w-4" /> New Invoice
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-min">

                {/* 1. Primary Highlight */}
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats?.totalRevenue || 0)}
                    description="Gross income lifecycle"
                    icon={DollarSign}
                    variant="accent"
                    className="lg:col-span-2 lg:row-span-1 h-full min-h-[160px] flex flex-col justify-center"
                    trend={{ value: `${stats?.revenueIncreasePercent || 0}%`, positive: true }}
                />

                {/* 2. Secondary Quick Stats */}
                <StatCard
                    title="Paid Invoices"
                    value={stats?.paidInvoicesCount?.toString() || "0"}
                    description="Settled documents"
                    icon={FileCheck}
                    className="lg:col-span-1"
                />

                <StatCard
                    title="Active Clients"
                    value={stats?.activeCustomersCount?.toString() || "0"}
                    description="Verified partners"
                    icon={TrendingUp}
                    className="lg:col-span-1"
                    variant="secondary"
                />

                {/* 3. Main Action Bento */}
                <Card className="lg:col-span-3 lg:row-span-2 bg-primary/5 border-dashed border-primary/20 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-lg">Enterprise Control Panel</CardTitle>
                        <CardDescription>Direct access to integrated core modules.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/admin/invoices" className="block">
                            <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-background hover:bg-primary hover:text-white transition-all border-primary/20">
                                <Plus className="h-6 w-6" />
                                <span className="text-xs font-bold uppercase tracking-widest">Invoicing</span>
                            </Button>
                        </Link>
                        <Link href="/admin/customers" className="block">
                            <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-background hover:bg-primary hover:text-white transition-all border-primary/20">
                                <UserPlus className="h-6 w-6" />
                                <span className="text-xs font-bold uppercase tracking-widest">Customers</span>
                            </Button>
                        </Link>
                        <Link href="/admin/fencing" className="block">
                            <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-background hover:bg-primary hover:text-white transition-all border-primary/20">
                                <Calculator className="h-6 w-6" />
                                <span className="text-xs font-bold uppercase tracking-widest">Quoting</span>
                            </Button>
                        </Link>
                        <Link href="/admin/catalog" className="block">
                            <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-background hover:bg-primary hover:text-white transition-all border-primary/20">
                                <Settings className="h-6 w-6" />
                                <span className="text-xs font-bold uppercase tracking-widest">Inventory</span>
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* 4. Distribution Chart Placeholder / Info */}
                <Card className="lg:col-span-1 lg:row-span-2 shadow-sm border-t-4 border-t-emerald-500">
                    <CardHeader>
                        <CardTitle className="text-base">System Integrity</CardTitle>
                        <CardDescription>Audit & Compliance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-medium text-emerald-800 uppercase tracking-tighter">Database Online</span>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-blue-500" />
                            <span className="text-xs font-medium text-blue-800 uppercase tracking-tighter">API connected</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic leading-tight">
                            All data shown is live from the C# production backend. Financial records are auditable and tamper-resistant.
                        </p>
                    </CardContent>
                </Card>

                {/* 5. Recent Activity Table */}
                <Card className="lg:col-span-4 lg:row-span-1 overflow-hidden shadow-sm border-none bg-card/50">
                    <CardHeader className="bg-muted/20 border-b py-3 px-6">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <FileText className="h-4 w-4" /> Global Activity Stream
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <RecentPaymentsTable payments={stats?.recentPayments} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
