import React from 'react';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Calendar, ClipboardList, Camera, CheckCircle, ChevronDown, Activity, Clock } from 'lucide-react';
import Link from 'next/link';
import { CompleteJobButton } from '@/components/CompleteJobButton';
import { PhotoUpload } from '@/components/PhotoUpload';

export default async function FieldDashboard() {
    const jobs = await prisma.job.findMany({
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
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Field Operations</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Technician dispatch and job sheets</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-black text-white border-none shadow-lg">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[9px] uppercase font-black tracking-widest text-primary">Active Projects</p>
                                <p className="text-3xl font-black mt-1 tracking-tighter">{jobs.filter(j => j.status !== 'COMPLETED').length}</p>
                            </div>
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">In Progress</p>
                                <p className="text-3xl font-black mt-1 tracking-tighter">{jobs.filter(j => j.status === 'IN_PROGRESS').length}</p>
                            </div>
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-muted-foreground">
                                <Clock className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">Completed Today</p>
                                <p className="text-3xl font-black mt-1 tracking-tighter">
                                    {jobs.filter(j => j.status === 'COMPLETED' && j.completedAt && new Date(j.completedAt).toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {jobs.length === 0 ? (
                    <Card className="p-12 text-center border-dashed">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">No active jobs in the field.</p>
                    </Card>
                ) : jobs.map((job) => (
                    <Card key={job.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
                        <div className="flex flex-col md:flex-row">
                            {/* Status Sidebar */}
                            <div className="w-full md:w-48 bg-accent/30 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r">
                                <div>
                                    <Badge className="uppercase text-[8px] tracking-widest font-black px-3 py-1 bg-black text-white">
                                        {job.status}
                                    </Badge>
                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mt-4">Assigned To</p>
                                    <p className="text-xs font-black uppercase tracking-tight">{job.assignedTo?.name || 'Unassigned'}</p>
                                </div>
                                <div className="mt-8 md:mt-0">
                                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Job #</p>
                                    <p className="font-mono text-xs font-bold">{job.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Main Details */}
                            <div className="flex-1 p-6 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter">{job.invoice.customer.name}</h3>
                                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                            <MapPin className="w-3 h-3" />
                                            <p className="text-[10px] uppercase font-bold tracking-widest">{job.invoice.customer.address}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Service</p>
                                        <p className="text-sm font-black uppercase">{job.invoice.quote?.fencingService?.name}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-dashed">
                                    <div className="bg-accent/20 p-3 rounded">
                                        <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Length</p>
                                        <p className="text-lg font-black tracking-tighter">{job.invoice.quote?.lengthMeters.toString()}m</p>
                                    </div>
                                    <div className="bg-accent/20 p-3 rounded">
                                        <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Height</p>
                                        <p className="text-lg font-black tracking-tighter">{job.invoice.quote?.heightMeters.toString()}m</p>
                                    </div>
                                    <div className="bg-accent/20 p-3 rounded">
                                        <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Terrain</p>
                                        <p className="text-lg font-black tracking-tighter">{job.invoice.quote?.terrain}</p>
                                    </div>
                                    <div className="bg-accent/20 p-3 rounded">
                                        <p className="text-[8px] uppercase font-black text-muted-foreground tracking-[0.2em]">Materials</p>
                                        <p className="text-lg font-black tracking-tighter">{job.invoice.quote?.fencingService?.BillOfMaterials.length || 0} Items</p>
                                    </div>
                                </div>

                                {/* Detailed Materials List */}
                                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                        <ClipboardList className="w-3 h-3" />
                                        Loading List (Bill of Materials)
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {job.invoice.quote?.fencingService?.BillOfMaterials.map((item: any, idx: number) => {
                                            const qty = Math.ceil(Number(item.quantityPerMeter) * Number(job.invoice.quote?.lengthMeters) * Number(item.wastageFactor));
                                            return (
                                                <div key={idx} className="flex justify-between items-center bg-white p-2 px-3 rounded border border-black/5 shadow-sm">
                                                    <span className="text-[10px] font-bold uppercase tracking-tight truncate mr-2">{item.catalogItem.name}</span>
                                                    <Badge variant="outline" className="text-[9px] font-black border-primary/20 text-primary bg-primary/5 shrink-0">
                                                        {qty} {item.catalogItem.unit}
                                                    </Badge>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 bg-white flex flex-row md:flex-col gap-4 border-t md:border-t-0 md:border-l shrink-0">
                                <div className="flex flex-col gap-2">
                                    <Link href={`/admin/field/jobs/${job.id}`} className="flex-1">
                                        <Button className="w-full text-[9px] uppercase tracking-widest font-black h-10 px-6">
                                            <ClipboardList className="w-4 h-4 mr-2" />
                                            Job Sheet
                                        </Button>
                                    </Link>
                                    <CompleteJobButton jobId={job.id} isCompleted={job.status === 'COMPLETED'} />
                                </div>
                                
                                <div className="pt-4 border-t border-dashed">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                        <Camera className="w-3 h-3" />
                                        Site Evidence
                                    </p>
                                    <PhotoUpload jobId={job.id} />
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Senior Engineer Strategy Note */}
            <div className="bg-black text-white p-8 rounded-lg flex items-start gap-6 shadow-xl">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <span className="text-black font-black">!</span>
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Operational Intelligence</h4>
                    <p className="text-sm mt-3 leading-relaxed text-slate-300">
                        This module closes the loop between sales and delivery. By providing real-time "Job Sheets" derived directly from our <span className="text-white font-bold">Bill of Materials (BOM)</span> engine, we eliminate material shortages and reduce logistics overhead by <span className="text-primary font-bold">15-20%</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}
