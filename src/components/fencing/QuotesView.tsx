"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Search, FileText, Edit2, Trash2, Download, Copy, ExternalLink, Calculator, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { fetchQuotesAction, convertToInvoiceAction, approveQuoteAction } from "@/lib/actions/fencing"

interface QuotesViewProps {
    onNewQuote: () => void;
}

export function QuotesView({ onNewQuote }: QuotesViewProps) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [quotes, setQuotes] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const loadQuotes = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await fetchQuotesAction()
            setQuotes(data)
        } catch (error) {
            console.error("Failed to load quotes:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadQuotes()
    }, [loadQuotes])

    const handleConvert = async (id: string) => {
        try {
            await convertToInvoiceAction(id)
            await loadQuotes()
        } catch (error: any) {
            alert(error.message)
        }
    }

    const handleApprove = async (id: string) => {
        try {
            await approveQuoteAction(id)
            await loadQuotes()
        } catch (error: any) {
            alert(error.message)
        }
    }

    const filtered = (quotes || []).filter(q =>
        q.fencingServiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.status.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(val);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'DRAFT': return <Badge variant="secondary">Draft</Badge>;
            case 'APPROVED': return <Badge variant="default" className="bg-emerald-500">Approved</Badge>;
            case 'INVOICED': return <Badge variant="default" className="bg-primary">Invoiced</Badge>;
            case 'CANCELLED': return <Badge variant="destructive">Cancelled</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-bold tracking-tight text-primary">Fencing Quotes</h3>
                    <p className="text-muted-foreground">Manage quotes derived from our production pricing engine.</p>
                </div>
                <Button onClick={onNewQuote} className="bg-primary hover:bg-primary/90">
                    <Calculator className="mr-2 h-4 w-4" /> New Quote
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search materials, status, ID..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[250px]">Material & Specs</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Operations</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            Synchronizing with database...
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length > 0 ? filtered.map((quote) => (
                                    <TableRow key={quote.id} className="group hover:bg-primary/5 transition-colors">
                                        <TableCell>
                                            <div className="font-bold text-primary">{quote.fencingServiceName}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Ruler className="h-3 w-3" /> {quote.lengthMeters}m @ {quote.heightMeters}m
                                            </div>
                                            {quote.addonNames && quote.addonNames.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {quote.addonNames.map((a: string) => (
                                                        <span key={a} className="text-[10px] bg-primary/10 px-1 rounded text-primary">{a}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="font-mono font-bold text-primary">
                                            {formatCurrency(quote.total)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(quote.status)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs">{new Date(quote.createdAt).toLocaleDateString()}</div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                {quote.status === 'DRAFT' && (
                                                    <Button variant="ghost" size="icon" className="text-emerald-600" onClick={() => handleApprove(quote.id)} title="Approve Quote">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                {quote.status === 'APPROVED' && (
                                                    <Button variant="ghost" size="icon" className="text-primary" onClick={() => handleConvert(quote.id)} title="Create Invoice">
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" title="View Details"><ExternalLink className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                                            No quotes found. Start by creating a New Fencing Quote.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

import { Ruler } from "lucide-react"
