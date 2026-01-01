"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Download, Filter, Loader2, Landmark } from "lucide-react"
import { fetchPaymentsAction } from "@/lib/actions/payments"

export default function PaymentsPage() {
    const [payments, setPayments] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const loadPayments = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await fetchPaymentsAction()
            setPayments(data)
        } catch (error) {
            console.error("Failed to load payments:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadPayments()
    }, [loadPayments])

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(val);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Financial Ledger</h2>
                    <p className="text-muted-foreground">View and export global payment history.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
                        <Filter className="mr-2 h-4 w-4 text-primary" /> Filter
                    </Button>
                    <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
                        <Download className="mr-2 h-4 w-4 text-primary" /> Export CSV
                    </Button>
                </div>
            </div>

            <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Landmark className="h-5 w-5 text-primary" /> Recent Transactions
                    </CardTitle>
                    <CardDescription>A real-time log of incoming revenue from all clients.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[150px]">Reference</TableHead>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="text-muted-foreground">Syncing transaction registry...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                            No payment records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id} className="group hover:bg-emerald-50/30 transition-colors">
                                            <TableCell className="font-mono text-xs font-bold text-primary">
                                                {payment.transactionId || `PAY-${payment.id.split('-')[0].toUpperCase()}`}
                                            </TableCell>
                                            <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] font-bold">
                                                    {payment.method}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono font-bold text-emerald-600">
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {new Date(payment.paymentDate).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="success" className="uppercase text-[10px] font-bold tracking-wider">
                                                    Succeeded
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
