import React from 'react';
import { prisma } from '@/lib/prisma';
import { CalendarGrid } from './Calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PendingAllocationList } from './PendingAllocationList';

export default async function SchedulePage() {
    const allJobs = await prisma.job.findMany({
        include: {
            invoice: {
                include: {
                    customer: true,
                    quote: {
                        include: { fencingService: true }
                    }
                }
            },
            assignedTo: true
        }
    });

    const unscheduledJobs = allJobs.filter(j => !j.scheduledDate);
    const scheduledJobs = allJobs.filter(j => j.scheduledDate) as any;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Master Schedule</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Resource allocation and production timeline</p>
                </div>
                <Button className="text-[10px] uppercase tracking-[0.2em] font-black h-10 px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    New Booking
                </Button>
            </div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Left Side: Unscheduled Queue */}
                <div className="xl:w-80 shrink-0 space-y-6">
                    <Card className="bg-black text-white border-none shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" />
                                Pending Allocation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <PendingAllocationList jobs={unscheduledJobs as any} />
                        </CardContent>
                    </Card>

                    <div className="p-6 border border-dashed rounded-lg bg-accent/30">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Pro-Tip:</p>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed uppercase font-medium">
                            Jobs appear here automatically as soon as a deposit is paid. Drag a job onto the calendar to assign a production date.
                        </p>
                    </div>
                </div>

                {/* Right Side: The Calendar */}
                <div className="flex-1 min-w-0">
                    <CalendarGrid initialJobs={scheduledJobs} />
                </div>
            </div>
        </div>
    );
}
