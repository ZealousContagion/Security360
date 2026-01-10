'use client';

import React, { useState } from 'react';
import { 
    format, 
    addDays, 
    startOfWeek, 
    isSameDay, 
    addWeeks, 
    subWeeks 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { scheduleJob } from './actions';

interface Job {
    id: string;
    status: string;
    scheduledDate: Date | null;
    invoice: {
        customer: { name: string; address: string | null };
        quote: { fencingService: { name: string } | null } | null;
    };
    assignedTo: { name: string } | null;
}

export function CalendarGrid({ initialJobs }: { initialJobs: Job[] }) {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [jobs, setJobs] = useState(initialJobs);

    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

    const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    const prevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));

    return (
        <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between bg-white p-4 border rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest">
                            {format(currentWeekStart, 'MMMM yyyy')}
                        </h2>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                            Weekly Production Schedule
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={prevWeek} className="h-8 w-8">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="h-8 text-[10px] uppercase font-bold px-4" onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
                        Today
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextWeek} className="h-8 w-8">
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weekDays.map((day, i) => {
                    const dayJobs = jobs.filter(j => j.scheduledDate && isSameDay(new Date(j.scheduledDate), day));
                    const isToday = isSameDay(day, new Date());

                    return (
                        <div key={i} className="space-y-3">
                            <div className={`text-center p-2 rounded-md border transition-colors ${isToday ? 'bg-black text-white border-black' : 'bg-white border-border'}`}>
                                <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-70">{format(day, 'EEE')}</p>
                                <p className="text-lg font-black tracking-tighter">{format(day, 'dd')}</p>
                            </div>

                            <div className="min-h-[400px] bg-accent/20 rounded-lg border border-dashed border-muted-foreground/20 p-2 space-y-2">
                                {dayJobs.length === 0 ? (
                                    <div className="h-full flex items-center justify-center">
                                        <p className="text-[8px] uppercase font-bold text-muted-foreground tracking-widest vertical-text opacity-30">No Jobs</p>
                                    </div>
                                ) : dayJobs.map(job => (
                                    <Card key={job.id} className="p-3 border-none shadow-sm hover:ring-1 ring-primary transition-all group cursor-pointer bg-white">
                                        <div className="space-y-2">
                                            <Badge variant="outline" className="text-[7px] h-4 px-1.5 uppercase font-black tracking-tighter border-black/10">
                                                {job.status}
                                            </Badge>
                                            <p className="text-[10px] font-black uppercase leading-tight tracking-tight line-clamp-2">
                                                {job.invoice.customer.name}
                                            </p>
                                            <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground font-bold uppercase">
                                                <User className="w-2.5 h-2.5 text-primary" />
                                                {job.assignedTo?.name || 'Pending'}
                                            </div>
                                            <div className="pt-2 mt-2 border-t border-dashed border-muted flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[8px] font-black text-primary uppercase">Details</span>
                                                <Clock className="w-2.5 h-2.5" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
