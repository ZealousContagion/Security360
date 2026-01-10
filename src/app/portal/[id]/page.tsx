import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { FileText, CheckCircle2, Clock, CreditCard, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ApproveQuoteButton } from '@/components/ApproveQuoteButton';

export default async function CustomerPortalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
            Quotes: {
                include: { fencingService: true },
                orderBy: { createdAt: 'desc' }
            },
            Invoices: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!customer) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-accent/30 p-6">
                <Card className="max-w-md w-full text-center p-12">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-destructive">Error 404</p>
                    <h1 className="text-2xl font-black uppercase tracking-tighter mt-2">Portal Not Found</h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-4">This portal link is invalid or has expired.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-accent/20 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Customer Portal</h2>
                        <h1 className="text-4xl font-black uppercase tracking-tighter mt-1">{customer.name}</h1>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-2">{customer.address}</p>
                    </div>
                    <div className="bg-white p-4 border rounded-lg flex items-center gap-4 shadow-sm">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Relationship Since</p>
                            <p className="text-xs font-black uppercase tracking-tight">{new Date(customer.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Quotes History */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Your Quotes
                            </h3>
                            <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold">Service</TableHead>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold">Date</TableHead>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold">Total</TableHead>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customer.Quotes.map((quote) => (
                                            <TableRow key={quote.id}>
                                                <TableCell className="font-bold uppercase text-[10px]">{quote.fencingService.name}</TableCell>
                                                <TableCell className="text-[10px] text-muted-foreground uppercase">{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="font-black text-xs">£{Number(quote.total).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={quote.status === 'APPROVED' ? 'success' : quote.status === 'DRAFT' ? 'outline' : quote.status === 'SENT' ? 'warning' : 'default'} className="uppercase text-[8px] tracking-tighter">
                                                        {quote.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {quote.status === 'SENT' ? (
                                                        <ApproveQuoteButton quoteId={quote.id} />
                                                    ) : (
                                                        <Button variant="ghost" size="sm" className="text-[9px] uppercase tracking-widest font-black h-7 px-3">View PDF</Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>

                        <div>
                            <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Your Invoices
                            </h3>
                            <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold">Invoice #</TableHead>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold">Issued</TableHead>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold">Amount</TableHead>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
                                            <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customer.Invoices.map((inv) => (
                                            <TableRow key={inv.id}>
                                                <TableCell className="font-mono text-[10px] font-black">{inv.invoiceNumber}</TableCell>
                                                <TableCell className="text-[10px] text-muted-foreground uppercase">{new Date(inv.issuedAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="font-black text-xs">£{Number(inv.total).toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={inv.status === 'PAID' ? 'success' : 'warning'} className="uppercase text-[8px] tracking-tighter">
                                                        {inv.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={`/pay/${inv.id}`}>
                                                            <Button variant="outline" size="sm" className="text-[9px] uppercase tracking-widest font-black h-7 px-3">
                                                                {inv.status === 'PAID' ? 'Receipt' : 'Pay Now'}
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar / Quick Actions */}
                    <div className="space-y-8">
                        <Card className="border-primary/20 bg-primary/[0.02]">
                            <CardHeader>
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Account Manager</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black text-xs uppercase">S3</div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-tight text-black">Support Team</p>
                                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Always here to help</p>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full text-[9px] uppercase tracking-widest font-black h-10 border-black/10">Contact Support</Button>
                            </CardContent>
                        </Card>

                        <div className="bg-black text-white p-6 rounded-lg space-y-4">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Secure Portal</h4>
                            <p className="text-[11px] leading-relaxed text-slate-300 font-medium uppercase tracking-tight">
                                This portal is unique to your account. You can view all your fencing projects, download documentation, and manage payments securely here.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
