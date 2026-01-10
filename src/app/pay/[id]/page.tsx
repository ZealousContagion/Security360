import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { PaymentButton } from '@/components/PaymentButton';

export default async function PublicPaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
            customer: true,
            quote: {
                include: { fencingService: true }
            }
        }
    });

    if (!invoice) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-accent/30 p-6">
                <Card className="max-w-md w-full text-center p-12">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-destructive">Error 404</p>
                    <h1 className="text-2xl font-black uppercase tracking-tighter mt-2">Invoice Not Found</h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-4">The link may be expired or incorrect.</p>
                </Card>
            </div>
        );
    }

    const depositAmount = Number(invoice.total) * 0.5;

    return (
        <div className="min-h-screen bg-accent/20 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Branding Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Security 360</h2>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">Secure Payment Portal</h1>
                    </div>
                    <Badge variant="outline" className="border-black uppercase text-[10px] tracking-widest px-4 py-1">
                        Invoice: {invoice.invoiceNumber}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Invoice Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="border-b bg-white">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-lg font-black uppercase tracking-tight">{invoice.quote?.fencingService?.name}</p>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Project: {invoice.quote?.lengthMeters}m Perimeter Fence</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Total Amount</p>
                                        <p className="text-2xl font-black tracking-tighter">£{Number(invoice.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>

                                <div className="border-t border-dashed pt-6 space-y-4">
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span>£{Number(invoice.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                        <span>VAT (15%)</span>
                                        <span>£{Number(invoice.vat).toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-white p-6 border rounded-lg flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest">Secure Checkout</p>
                                <p className="text-xs text-muted-foreground uppercase font-bold mt-1">Encrypted by Security 360 Financial Services</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Column */}
                    <div className="space-y-6">
                        <Card className="border-primary ring-1 ring-primary bg-primary/[0.02]">
                            <CardHeader>
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary text-center">Required Payment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 text-center">
                                <div>
                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">50% Deposit to Start Project</p>
                                    <p className="text-4xl font-black tracking-tighter text-black mt-1">£{depositAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                </div>

                                <PaymentButton invoiceId={invoice.id} />

                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                        Secure Card Processing
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest font-bold text-muted-foreground">
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                        Instant Confirmation
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Button variant="ghost" className="w-full text-[10px] uppercase tracking-widest font-bold h-12 border border-dashed border-muted-foreground/30">
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice PDF
                        </Button>
                    </div>
                </div>
            </div>

            <footer className="mt-12 text-center">
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-bold">
                    &copy; 2026 Security 360 Pay. Authorized Financial Module.
                </p>
            </footer>
        </div>
    );
}