import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
    MapPin, 
    Phone, 
    User, 
    Ruler, 
    Mountain, 
    Layers,
    ClipboardList, 
    ChevronLeft, 
    Printer, 
    Clock,
    CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { PrintButton } from '@/components/PrintButton';
import { SaveJobSheetButton } from '@/components/SaveJobSheetButton';

export default async function JobSheetPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await prisma.job.findUnique({
        where: { id },
        include: {
            invoice: {
                include: {
                    customer: true,
                    quote: {
                        include: { 
                            fencingService: {
                                include: { BillOfMaterials: { include: { catalogItem: true } } }
                            }
                        }
                    }
                }
            },
            assignedTo: true
        }
    });

    if (!job) return notFound();

    const quote = job.invoice.quote;
    const customer = job.invoice.customer;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <Link href="/admin/field" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary mb-4 transition-colors">
                        <ChevronLeft className="w-3 h-3 mr-1" />
                        Back to Field Ops
                    </Link>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Job Sheet</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Authorized Field Production Document</p>
                </div>
                <div className="flex gap-3">
                    <SaveJobSheetButton 
                        jobId={job.id}
                        customer={customer}
                        service={quote ? {
                            id: quote.fencingService.id,
                            name: quote.fencingService.name,
                            pricePerMeter: Number(quote.fencingService.pricePerMeter),
                            installationFee: Number(quote.fencingService.installationFee)
                        } : null}
                        specs={{
                            length: Number(quote?.lengthMeters),
                            height: Number(quote?.heightMeters),
                            terrain: quote?.terrain || 'Standard'
                        }}
                        materials={quote?.fencingService.BillOfMaterials.map((m: any) => ({
                            id: m.id,
                            quantityPerMeter: Number(m.quantityPerMeter),
                            wastageFactor: Number(m.wastageFactor),
                            catalogItem: {
                                id: m.catalogItem.id,
                                name: m.catalogItem.name,
                                unit: m.catalogItem.unit,
                                price: Number(m.catalogItem.price)
                            }
                        })) || []}
                        assignedTo={job.assignedTo?.name}
                        scheduledDate={job.scheduledDate?.toISOString()}
                    />
                    <PrintButton />
                </div>
            </div>

            {/* Main Job Sheet Content */}
            <div className="bg-white border rounded-xl shadow-2xl overflow-hidden print:shadow-none print:border-none">
                {/* Branding Strip */}
                <div className="bg-black p-6 flex justify-between items-center border-b-4 border-primary">
                    <div>
                        <h2 className="text-primary font-black uppercase tracking-[0.3em] text-sm">Security 360</h2>
                        <p className="text-white/50 text-[8px] uppercase tracking-[0.2em] font-bold mt-1">Fencing Management Systems</p>
                    </div>
                    <div className="text-right">
                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Job # {job.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-primary text-[8px] font-black uppercase tracking-widest mt-1">Ref: {job.invoice.invoiceNumber}</p>
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    {/* Customer & Location */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Client Information</h3>
                            <div>
                                <p className="text-2xl font-black uppercase tracking-tight">{customer.name}</p>
                                <div className="mt-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                        <p className="text-xs font-bold uppercase leading-relaxed">{customer.address}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-primary shrink-0" />
                                        <p className="text-xs font-bold uppercase">{customer.phone || 'N/A'}</p>
                                    </div>
                                    {customer.email && (
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-primary shrink-0" />
                                            <p className="text-xs font-bold">{customer.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Assignment Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-accent/30 p-4 rounded-lg">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Technician</p>
                                    <p className="text-sm font-black uppercase mt-1">{job.assignedTo?.name || 'Unassigned'}</p>
                                </div>
                                <div className="bg-accent/30 p-4 rounded-lg">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Status</p>
                                    <Badge className="mt-1 uppercase text-[8px] font-black">{job.status}</Badge>
                                </div>
                                <div className="bg-accent/30 p-4 rounded-lg col-span-2">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground text-primary">Scheduled Start</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        <p className="text-sm font-black uppercase">{job.scheduledDate ? new Date(job.scheduledDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Pending'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Project Specs */}
                    <section className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Project Specifications</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 border rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Ruler className="w-3.5 h-3.5 text-primary" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Total Length</p>
                                </div>
                                <p className="text-2xl font-black tracking-tighter">{quote?.lengthMeters.toString()}m</p>
                            </div>
                            <div className="p-4 border rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mountain className="w-3.5 h-3.5 text-primary" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Terrain</p>
                                </div>
                                <p className="text-2xl font-black uppercase tracking-tighter">{quote?.terrain}</p>
                            </div>
                            <div className="p-4 border rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers className="w-3.5 h-3.5 text-primary" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Height</p>
                                </div>
                                <p className="text-2xl font-black tracking-tighter">{quote?.heightMeters.toString()}m</p>
                            </div>
                            <div className="p-4 border rounded-lg bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <ClipboardList className="w-3.5 h-3.5 text-primary" />
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Service</p>
                                </div>
                                <p className="text-sm font-black uppercase tracking-tight truncate">{quote?.fencingService.name}</p>
                            </div>
                        </div>
                    </section>

                    {/* Loading List / BOM */}
                    <section className="space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loading List (Bill of Materials)</h3>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase">Quantities include +10% wastage buffer</p>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {quote?.fencingService.BillOfMaterials.map((item: any, idx: number) => {
                                const qty = Math.ceil(Number(item.quantityPerMeter) * Number(quote.lengthMeters) * Number(item.wastageFactor));
                                return (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-accent/10 rounded border border-black/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded border-2 border-primary/20 flex items-center justify-center">
                                                <span className="text-[8px] font-black text-muted-foreground">{idx + 1}</span>
                                            </div>
                                            <p className="text-xs font-black uppercase tracking-tight">{item.catalogItem.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black tracking-tighter">{qty} <span className="text-[10px] uppercase text-muted-foreground ml-1">{item.catalogItem.unit}</span></p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Completion Notes & Sign-off */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-dashed">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Site Notes / Observations</h3>
                            <div className="h-32 border-2 border-dashed rounded-lg p-4 bg-accent/5">
                                <p className="text-[8px] uppercase font-bold text-muted-foreground/50">Space for technician notes...</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Completion Verification</h3>
                            <div className="space-y-6 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 rounded flex items-center justify-center"></div>
                                    <p className="text-[10px] font-bold uppercase tracking-tight">Site cleaned and debris removed</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 rounded flex items-center justify-center"></div>
                                    <p className="text-[10px] font-bold uppercase tracking-tight">Client inspection completed</p>
                                </div>
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[8px] uppercase font-bold text-muted-foreground">Technician Signature</p>
                                            <div className="h-10 w-40 border-b-2 border-black mt-2"></div>
                                        </div>
                                        <div>
                                            <p className="text-[8px] uppercase font-bold text-muted-foreground">Date</p>
                                            <div className="h-10 w-24 border-b-2 border-black mt-2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer Strip */}
                <div className="bg-accent/30 p-4 text-center">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">
                        Security 360 Operational Intelligence System | Document Version 2.1
                    </p>
                </div>
            </div>
        </div>
    );
}
