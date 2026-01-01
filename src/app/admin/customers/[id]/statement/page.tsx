"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Download, Printer, ArrowLeft, Mail, FileText } from "lucide-react"
import { useToast } from "@/components/ui/ToastProvider"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function CustomerStatementPage() {
    const params = useParams()
    const customerId = params.id as string
    const { toast } = useToast()

    const customer = {
        name: "Greenwood Estate Management",
        email: "accounts@greenwood.co.ke",
        balance: "KES 145,000",
        totalInvoiced: "KES 2,450,000",
        totalPaid: "KES 2,305,000"
    }

    const transactions = [
        { id: "T-101", date: "2025-01-01", type: "Invoice", ref: "INV-2025-001", amount: "KES 85,000", status: "Unpaid" },
        { id: "T-102", date: "2024-12-28", type: "Payment", ref: "PAY-9923", amount: "KES -120,000", status: "Cleared" },
        { id: "T-103", date: "2024-12-15", type: "Invoice", ref: "INV-2024-950", amount: "KES 60,000", status: "Unpaid" },
        { id: "T-104", date: "2024-11-30", type: "Invoice", ref: "INV-2024-812", amount: "KES 120,000", status: "Paid" },
    ]

    const handleEmail = () => {
        toast({
            title: "Statement Sent",
            description: `Monthly statement has been emailed to ${customer.email}`,
            variant: "success"
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/customers">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Customer Statement</h2>
                    <p className="text-muted-foreground">{customer.name} ({customerId})</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary text-primary-foreground">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-80">Outstanding Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{customer.balance}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-700">{customer.totalInvoiced}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{customer.totalPaid}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>A combined ledger of all billing activities.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.print()}>
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleEmail}>
                            <Mail className="mr-2 h-4 w-4" /> Email
                        </Button>
                        <Button size="sm">
                            <Download className="mr-2 h-4 w-4" /> Export PDF
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transactions.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell>{t.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {t.type === "Invoice" ? <FileText className="h-3 w-3" /> : <Badge className="h-1.5 w-1.5 rounded-full bg-green-500 p-0" />}
                                            {t.type}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{t.ref}</TableCell>
                                    <TableCell className={cn("font-medium", Number(t.amount.replace(/[^0-9]/g, "")) < 0 ? "text-green-600" : "text-slate-900")}>
                                        {t.amount}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={t.status === "Paid" || t.status === "Cleared" ? "success" : "secondary"}>
                                            {t.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="link" size="sm" className="h-auto p-0">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
