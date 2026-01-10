import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { DollarSign, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isManager } from "@/lib/rbac";
import { redirect } from "next/navigation";

export default async function PaymentsPage() {
    if (!await isManager()) {
        redirect("/admin/dashboard");
    }

    const payments = await prisma.payment.findMany({
        include: {
            invoice: {
                include: {
                    customer: true
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    const totalRevenue = payments
        .filter(p => p.status === 'SUCCESS')
        .reduce((acc, p) => acc + Number(p.amount), 0);

    const pendingPayments = await prisma.invoice.aggregate({
        where: { status: { in: ['PENDING', 'SENT'] } },
        _sum: { total: true },
        _count: true
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Payments</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Transaction history and financial overview</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">£{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Processed successful payments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Pending</CardTitle>
                        <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-muted-foreground">£{Number(pendingPayments._sum.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">{pendingPayments._count} outstanding invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest">Recent Activity</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">{payments.length}</div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">Transactions in last 30 days</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Transaction ID</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Customer</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Date</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Amount</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="p-12 text-center text-muted-foreground uppercase text-[10px] tracking-widest">
                                        No transactions found.
                                    </TableCell>
                                </TableRow>
                            ) : payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="font-mono text-xs">{payment.id.slice(0, 8).toUpperCase()}</TableCell>
                                    <TableCell className="font-bold uppercase text-[10px]">{payment.invoice?.customer?.name || 'Unknown'}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground uppercase">
                                        {new Date(payment.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </TableCell>
                                    <TableCell className="font-bold">£{Number(payment.amount).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={payment.status === 'SUCCESS' ? 'success' : payment.status === 'PENDING' ? 'warning' : 'destructive'} className="uppercase text-[8px] tracking-tighter">
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

