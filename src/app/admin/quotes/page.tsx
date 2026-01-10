import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { FileText, Plus, ExternalLink, Mail, Search, Edit2 } from 'lucide-react';
import { EmailQuoteButton } from '@/components/EmailQuoteButton';
import { DeleteQuoteButton } from '@/components/DeleteQuoteButton';

export default async function QuotesPage() {
    const quotes = await prisma.fenceQuote.findMany({
        orderBy: { createdAt: 'desc' },
        include: { customer: true, fencingService: true }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Quotes</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Estimation and sales pipeline</p>
                </div>
                <Link href="/admin/quotes/new">
                    <Button className="text-[10px] uppercase tracking-[0.2em] font-black h-10 px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Quote
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Active Quotes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Ref</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Customer</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Service</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Total</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="p-12 text-center text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                                        No quotes generated yet.
                                    </TableCell>
                                </TableRow>
                            ) : quotes.map((quote) => (
                                <TableRow key={quote.id}>
                                    <TableCell className="font-mono text-[10px] font-black">{quote.id.slice(0, 8).toUpperCase()}</TableCell>
                                    <TableCell className="uppercase text-[10px] font-bold tracking-tight">{quote.customer.name}</TableCell>
                                    <TableCell className="text-[10px] text-muted-foreground font-medium uppercase">{quote.fencingService.name}</TableCell>
                                    <TableCell className="font-black">£{Number(quote.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell>
                                        <Badge variant={quote.status === 'APPROVED' ? 'success' : quote.status === 'SENT' ? 'warning' : 'outline'} className="uppercase text-[8px] tracking-tighter">
                                            {quote.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <EmailQuoteButton quoteId={quote.id} />
                                            <Link href={`/admin/quotes/${quote.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/quotes/${quote.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeleteQuoteButton quoteId={quote.id} />
                                        </div>
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