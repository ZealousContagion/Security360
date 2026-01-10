'use client';

import React, { useState, useEffect } from 'react';
import { 
    format, 
    addDays, 
    startOfWeek, 
    isSameDay, 
    addWeeks, 
    subWeeks,
    startOfDay,
    parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, AlertCircle, BellRing, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { scheduleJob, createJobReminder } from './actions';
import { Input } from '@/components/ui/Input';

// --- Types ---
interface Job {
    id: string;
    status: string;
    scheduledDate: Date | string | null;
    invoice: {
        customer: { name: string; address: string | null };
        quote: { fencingService: { name: string } | null } | null;
    };
    assignedTo: { name: string } | null;
}

interface ScheduleBoardProps {
    scheduledJobs: Job[];
    unscheduledJobs: Job[];
}

// --- Helper for strict mode DND ---
const StrictModeDroppable = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

export function ScheduleBoard({ scheduledJobs: initialScheduled, unscheduledJobs: initialUnscheduled }: ScheduleBoardProps) {
    const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [scheduled, setScheduled] = useState(initialScheduled);
    const [unscheduled, setUnscheduled] = useState(initialUnscheduled);
    
    // Optimistic UI updates
    useEffect(() => {
        setScheduled(initialScheduled);
        setUnscheduled(initialUnscheduled);
    }, [initialScheduled, initialUnscheduled]);

    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(currentWeekStart, i));

    const nextWeek = () => setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    const prevWeek = () => setCurrentWeekStart(subWeeks(currentWeekStart, 1));

    // Reminder Modal State
    const [reminderJobId, setReminderJobId] = useState<string | null>(null);
    const [reminderMessage, setReminderMessage] = useState('');
    const [isSubmittingReminder, setIsSubmittingReminder] = useState(false);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        // Determine new date
        const destId = destination.droppableId;
        
        if (destId === 'pending') {
            // Logic to unschedule if needed, skipping for now as per plan
            return; 
        }

        const newDateStr = destId.replace('day-', '');
        const newDate = new Date(newDateStr);

        // Optimistic Update
        let jobToMove: Job | undefined;
        
        if (source.droppableId === 'pending') {
            jobToMove = unscheduled.find(j => j.id === draggableId);
            if (jobToMove) {
                setUnscheduled(prev => prev.filter(j => j.id !== draggableId));
                setScheduled(prev => [...prev, { ...jobToMove!, scheduledDate: newDate }]);
            }
        } else {
            jobToMove = scheduled.find(j => j.id === draggableId);
            if (jobToMove) {
                setScheduled(prev => prev.map(j => j.id === draggableId ? { ...j, scheduledDate: newDate } : j));
            }
        }

        // Server Action
        if (jobToMove) {
            try {
                const res = await scheduleJob(draggableId, newDate);
                if (!res.success) {
                    // Revert on failure (simplified: just reload or alert)
                    alert('Failed to schedule job: ' + res.error);
                    window.location.reload();
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const handleSetReminder = async () => {
        if (!reminderJobId || !reminderMessage) return;
        setIsSubmittingReminder(true);
        await createJobReminder(reminderJobId, reminderMessage);
        setIsSubmittingReminder(false);
        setReminderJobId(null);
        setReminderMessage('');
        alert("Reminder set successfully!");
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
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
                            <StrictModeDroppable droppableId="pending">
                                {(provided: any) => (
                                    <div 
                                        ref={provided.innerRef} 
                                        {...provided.droppableProps}
                                        className="space-y-4 min-h-[100px]"
                                    >
                                        {unscheduled.length === 0 && (
                                            <p className="text-[9px] text-slate-500 uppercase font-bold text-center py-8">All jobs scheduled.</p>
                                        )}
                                        {unscheduled.map((job, index) => (
                                            <Draggable key={job.id} draggableId={job.id} index={index}>
                                                {(provided: any) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="p-4 bg-white/10 rounded border border-white/5 hover:bg-white/20 transition-all cursor-grab active:cursor-grabbing"
                                                    >
                                                        <p className="text-[10px] font-black uppercase tracking-tight">{job.invoice.customer.name}</p>
                                                        <p className="text-[8px] text-slate-400 uppercase font-bold mt-1">{job.invoice.quote?.fencingService?.name || 'Standard Service'}</p>
                                                        <div className="mt-3 flex justify-between items-center">
                                                            <Badge className="text-[7px] bg-primary text-black font-black border-none px-1.5 h-4 uppercase">Pending</Badge>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </StrictModeDroppable>
                        </CardContent>
                    </Card>
                    
                    <div className="p-6 border border-dashed rounded-lg bg-accent/30">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Pro-Tip:</p>
                        <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed uppercase font-medium">
                            Drag cards from here onto a specific date on the calendar to lock in the schedule.
                        </p>
                    </div>
                </div>

                {/* Right Side: The Calendar */}
                <div className="flex-1 min-w-0 space-y-6">
                    {/* Controls */}
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
                            const dateStr = format(day, 'yyyy-MM-dd');
                            const dayJobs = scheduled.filter(j => j.scheduledDate && isSameDay(new Date(j.scheduledDate), day));
                            const isToday = isSameDay(day, new Date());

                            return (
                                <div key={i} className="space-y-3">
                                    <div className={`text-center p-2 rounded-md border transition-colors ${isToday ? 'bg-black text-white border-black' : 'bg-white border-border'}`}>
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-70">{format(day, 'EEE')}</p>
                                        <p className="text-lg font-black tracking-tighter">{format(day, 'dd')}</p>
                                    </div>

                                    <StrictModeDroppable droppableId={`day-${dateStr}`}>
                                        {(provided: any, snapshot: any) => (
                                            <div 
                                                ref={provided.innerRef} 
                                                {...provided.droppableProps}
                                                className={`min-h-[400px] rounded-lg border border-dashed border-muted-foreground/20 p-2 space-y-2 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5 border-primary/50' : 'bg-accent/20'}`}
                                            >
                                                {dayJobs.map((job, index) => (
                                                    <Draggable key={job.id} draggableId={job.id} index={index}>
                                                        {(provided: any) => (
                                                            <Card 
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="p-3 border-none shadow-sm hover:ring-1 ring-primary transition-all group cursor-grab active:cursor-grabbing bg-white relative"
                                                            >
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between items-start">
                                                                        <Badge variant="outline" className="text-[7px] h-4 px-1.5 uppercase font-black tracking-tighter border-black/10">
                                                                            {job.status}
                                                                        </Badge>
                                                                        <button 
                                                                            onClick={(e) => {
                                                                                e.stopPropagation(); // prevent drag start if hitting button (though handle is on card usually)
                                                                                setReminderJobId(job.id);
                                                                            }}
                                                                            className="text-muted-foreground hover:text-primary transition-colors"
                                                                            title="Set Reminder"
                                                                        >
                                                                            <BellRing className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                    <p className="text-[10px] font-black uppercase leading-tight tracking-tight line-clamp-2">
                                                                        {job.invoice.customer.name}
                                                                    </p>
                                                                    <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground font-bold uppercase">
                                                                        <User className="w-2.5 h-2.5 text-primary" />
                                                                        {job.assignedTo?.name || 'Pending'}
                                                                    </div>
                                                                </div>
                                                            </Card>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </StrictModeDroppable>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Simple Modal Overlay for Reminders */}
            {reminderJobId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <BellRing className="w-4 h-4 text-primary" />
                                Set Job Reminder
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 block">Message</label>
                                <Input 
                                    value={reminderMessage} 
                                    onChange={e => setReminderMessage(e.target.value)} 
                                    placeholder="e.g. Call customer about gate access..."
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="ghost" size="sm" onClick={() => setReminderJobId(null)} className="text-xs font-bold uppercase">Cancel</Button>
                                <Button 
                                    size="sm" 
                                    onClick={handleSetReminder} 
                                    disabled={!reminderMessage || isSubmittingReminder}
                                    className="text-xs font-black uppercase tracking-widest"
                                >
                                    {isSubmittingReminder ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                                    Save Reminder
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </DragDropContext>
    );
}
