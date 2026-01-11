import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { FileText, Link as LinkIcon, ExternalLink, Filter, BellRing, Banknote } from 'lucide-react';
import { OverdueRemindersButton } from '@/components/OverdueRemindersButton';
import { CashPaymentButton } from './CashPaymentButton';

export default async function InvoicesPage() {
    const invoices = await prisma.invoice.findMany({
        orderBy: { createdAt: 'desc' },
        include: { customer: true }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Invoice Management</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Billing history and automated receivables</p>
                </div>
                <div className="flex gap-3">
                    <OverdueRemindersButton />
                    <Button variant="outline" className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Issued Invoices
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Number</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Customer</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Issued Date</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Total</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Status</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Payment Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="p-12 text-center text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                                        No invoices generated yet.
                                    </TableCell>
                                </TableRow>
                            ) : invoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-mono text-xs font-bold">{inv.invoiceNumber}</TableCell>
                                    <TableCell className="uppercase text-[10px] font-bold tracking-tight">{inv.customer.name}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground uppercase">{inv.issuedAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</TableCell>
                                    <TableCell className="font-black">${Number(inv.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell>
                                        <Badge variant={inv.status === 'PAID' ? 'success' : inv.status === 'PENDING' ? 'warning' : 'destructive'} className="uppercase text-[8px] tracking-tighter font-bold">
                                            {inv.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <CashPaymentButton 
                                                invoiceId={inv.id} 
                                                totalAmount={Number(inv.total)} 
                                                invoiceNumber={inv.invoiceNumber}
                                                currentStatus={inv.status}
                                            />
                                            <Link href={`/pay/${inv.id}`} target="_blank">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" title="Copy Link">
                                                <LinkIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Senior Engineer Tip */}
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Automation Note:</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed uppercase font-medium">
                    The payment portal uses unique cryptographical IDs for each invoice. When a customer pays the 50% deposit via the public link, the invoice status will automatically move to <span className="text-black font-bold">PARTIAL</span> and notify the field team to begin site preparation.
                </p>
            </div>
        </div>
    );
}