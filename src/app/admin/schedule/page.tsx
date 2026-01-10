import React from 'react';
import { prisma } from '@/lib/prisma';
import { ScheduleBoard } from './ScheduleBoard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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

    // Serialize only necessary fields for Client Components
    const serializedJobs = allJobs.map(job => ({
        id: job.id,
        status: job.status,
        scheduledDate: job.scheduledDate ? job.scheduledDate.toISOString() : null,
        invoice: {
            customer: {
                name: job.invoice.customer.name,
                address: job.invoice.customer.address,
            },
            quote: job.invoice.quote ? {
                fencingService: {
                    name: job.invoice.quote.fencingService.name,
                }
            } : null
        },
        assignedTo: job.assignedTo ? {
            name: job.assignedTo.name
        } : null
    }));

    const unscheduledJobs = serializedJobs.filter(j => !j.scheduledDate);
    const scheduledJobs = serializedJobs.filter(j => j.scheduledDate);

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

            <ScheduleBoard 
                scheduledJobs={scheduledJobs} 
                unscheduledJobs={unscheduledJobs} 
            />
        </div>
    );
}
