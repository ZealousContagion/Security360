import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Users, ExternalLink, UserPlus, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        include: { 
            _count: { select: { Quotes: true, Invoices: true } } 
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Customer Directory</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Manage client relationships and portal access</p>
                </div>
                <Button className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6">
                    <UserPlus className="w-4 h-4 mr-2" />
                    New Customer
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Active Clients
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Client Details</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Stats</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Contact</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Portal Access</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="p-12 text-center text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                                        No customers registered yet.
                                    </TableCell>
                                </TableRow>
                            ) : customers.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="font-bold uppercase text-[10px] tracking-tight">{c.name}</p>
                                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                                <MapPin className="w-3 h-3" />
                                                <p className="text-[9px] uppercase tracking-tighter font-medium truncate max-w-[200px]">{c.address || 'No Address'}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-[8px] uppercase font-bold text-muted-foreground leading-none">Quotes</p>
                                                <p className="text-xs font-black mt-1">{c._count.Quotes}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] uppercase font-bold text-muted-foreground leading-none">Invoices</p>
                                                <p className="text-xs font-black mt-1">{c._count.Invoices}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="w-3 h-3 text-primary" />
                                            <p className="text-[10px] font-bold tracking-tight">{c.phone || '-'}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/portal/${c.id}`} target="_blank">
                                            <Button variant="ghost" className="text-[9px] uppercase tracking-[0.2em] font-black hover:bg-primary/10 hover:text-primary">
                                                Open Portal
                                                <ExternalLink className="w-3 h-3 ml-2" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="bg-accent/30 p-6 rounded-lg border border-dashed border-muted-foreground/20">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Internal Note:</p>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed uppercase font-medium">
                    The customer portal links are cryptographically secure and unique. Share the "Open Portal" link with clients to allow them to review their complete project history without authentication.
                </p>
            </div>
        </div>
    );
}