"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, Eye, MoreHorizontal, Send, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/ToastProvider"
import { CurrencyToggle, Currency } from "@/components/ui/CurrencyToggle"
import { fetchInvoicesAction } from "@/lib/actions/invoices"

export default function InvoicesPage() {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = React.useState(true)
    const [currency, setCurrency] = React.useState<Currency>("KES")
    const [invoices, setInvoices] = React.useState<any[]>([])

    const loadInvoices = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await fetchInvoicesAction()
            setInvoices(data)
        } catch (error) {
            console.error("Failed to load invoices:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadInvoices()
    }, [loadInvoices])

    const handleSend = (id: string) => {
        toast({
            title: "Invoice Sent",
            description: `Invoice ${id} has been transmitted to the client.`,
            variant: "success"
        })
    }

    const formatAmount = (total: number) => {
        // Simple conversion for demo purpose
        const displayAmount = currency === "USD" ? total / 130 : total;
        const symbol = currency === "USD" ? "$" : "KES";

        return `${symbol} ${displayAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Billing & Invoices</h2>
                    <p className="text-muted-foreground">Manage accounts receivable and document history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <CurrencyToggle value={currency} onChange={setCurrency} />
                    <Link href="/admin/invoices/create">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" /> New Invoice
                        </Button>
                    </Link>
                </div>
            </div>

            <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle>Invoice Registry</CardTitle>
                    <CardDescription>Live data synchronized with production PostgreSQL.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[150px]">Invoice #</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Issue Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="text-muted-foreground animate-pulse">Synchronizing with billing engine...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : invoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                            No billing records found in the database.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    invoices.map((invoice) => (
                                        <TableRow key={invoice.id} className="group hover:bg-primary/5 transition-colors">
                                            <TableCell className="font-bold text-primary">{invoice.invoiceNumber}</TableCell>
                                            <TableCell className="font-medium">{invoice.customerName}</TableCell>
                                            <TableCell className="font-mono font-bold text-primary">{formatAmount(invoice.total)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    invoice.status === "PAID" ? "success" :
                                                        invoice.status === "OVERDUE" ? "destructive" :
                                                            invoice.status === "DRAFT" ? "secondary" : "default"
                                                } className="uppercase text-[10px] font-bold tracking-wider">
                                                    {invoice.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/invoices/${invoice.id}`}>
                                                        <Button variant="ghost" size="icon" title="View Details"><Eye className="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" title="Send Invoice" onClick={() => handleSend(invoice.invoiceNumber)}><Send className="h-4 w-4 text-primary" /></Button>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </div>
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
