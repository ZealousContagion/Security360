import { prisma } from '@/core/database';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { notFound } from 'next/navigation';
import { QuoteActions } from './QuoteActions';
import { FileText, User, Settings, Ruler, TrendingUp, Mail, ExternalLink, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { EmailQuoteButton } from '@/components/EmailQuoteButton';

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const quote = await prisma.fenceQuote.findUnique({
        where: { id },
        include: { customer: true, fencingService: true }
    });

    if (!quote) return notFound();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black tracking-tighter uppercase">Quote Detail</h1>
                        <Badge variant="outline" className="uppercase text-[10px] tracking-widest px-3 border-primary text-primary font-black">
                            {quote.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-[0.2em] font-bold mt-1">Reference: {quote.id.toUpperCase()}</p>
                </div>
                <div className="flex gap-3">
                    <EmailQuoteButton quoteId={quote.id} />
                    <Link href={`/admin/quotes/${quote.id}/edit`}>
                        <Button variant="outline" className="text-[10px] uppercase tracking-widest font-black h-10 px-6">
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit Quote
                        </Button>
                    </Link>
                    <QuoteActions quoteId={quote.id} status={quote.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader className="border-b bg-accent/30 py-4">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Settings className="w-3 h-3 text-primary" />
                                Specifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Service</p>
                                <p className="text-sm font-black uppercase mt-1">{quote.fencingService.name}</p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Length</p>
                                <p className="text-sm font-black uppercase mt-1">{quote.lengthMeters.toString()}m</p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Height</p>
                                <p className="text-sm font-black uppercase mt-1">{quote.heightMeters.toString()}m</p>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Terrain</p>
                                <p className="text-sm font-black uppercase mt-1">{quote.terrain}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b bg-accent/30 py-4">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <User className="w-3 h-3 text-primary" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div>
                                <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Name</p>
                                <p className="text-sm font-black uppercase mt-1">{quote.customer.name}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Email</p>
                                    <p className="text-xs font-bold mt-1">{quote.customer.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Phone</p>
                                    <p className="text-xs font-bold mt-1">{quote.customer.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Site Address</p>
                                <p className="text-xs font-bold mt-1 uppercase">{quote.customer.address || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    <Card className="border-primary bg-primary/[0.02] ring-1 ring-primary">
                        <CardHeader>
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Financial Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>£{Number(quote.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-muted-foreground">VAT (15%)</span>
                                <span>£{Number(quote.vat).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="pt-4 border-t border-dashed border-primary/30 flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Quote</span>
                                <span className="text-2xl font-black tracking-tighter">£{Number(quote.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-black text-white p-6 rounded-lg space-y-4 shadow-xl">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Sales Insight</h4>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-300 font-medium uppercase tracking-tight">
                            Approved quotes automatically generate invoices and schedule field projects. 50% deposit is required before site dispatch.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}