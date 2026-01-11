'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, MapPin, TrendingUp, AlertCircle } from 'lucide-react';
import { updateQuoteStage } from './actions';

const STAGES = [
    { id: 'LEAD', title: 'New Leads' },
    { id: 'SURVEY', title: 'Site Survey' },
    { id: 'QUOTED', title: 'Quote Sent' },
    { id: 'WON', title: 'Contract Won' },
    { id: 'LOST', title: 'Lost' }
];

interface Quote {
    id: string;
    pipelineStage: string;
    total: any;
    customer: { name: string; address: string | null };
    fencingService: { name: string };
}

export function KanbanBoard({ initialQuotes }: { initialQuotes: Quote[] }) {
    const [quotes, setQuotes] = useState(initialQuotes);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onDragEnd = async (result: any) => {
        if (!result.destination) return;

        const { draggableId, destination } = result;
        const newStage = destination.droppableId;

        // Optimistic update
        const updatedQuotes = quotes.map(q => 
            q.id === draggableId ? { ...q, pipelineStage: newStage } : q
        );
        setQuotes(updatedQuotes);

        // Backend update
        const res = await updateQuoteStage(draggableId, newStage);
        if (!res.success) {
            alert("Failed to update stage: " + res.error);
            setQuotes(initialQuotes); // Rollback
        }
    };

    if (!isMounted) return <div className="h-96 animate-pulse bg-accent/10 rounded-xl" />;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-6 min-h-[70vh]">
                {STAGES.map((stage) => (
                    <div key={stage.id} className="flex-1 min-w-[280px] flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                {stage.title}
                                <span className="w-5 h-5 bg-accent rounded-full flex items-center justify-center text-[8px] font-black text-black shadow-sm">
                                    {quotes.filter(q => q.pipelineStage === stage.id).length}
                                </span>
                            </h3>
                        </div>

                        <Droppable droppableId={stage.id}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`flex-1 rounded-xl p-3 transition-colors min-h-[500px] border border-dashed ${
                                        snapshot.isDraggingOver ? 'bg-primary/5 border-primary/20' : 'bg-accent/10 border-transparent'
                                    }`}
                                >
                                    {quotes
                                        .filter(q => q.pipelineStage === stage.id)
                                        .map((quote, index) => (
                                            <Draggable key={quote.id} draggableId={quote.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={`mb-3 ${snapshot.isDragging ? 'rotate-2 scale-105' : ''}`}
                                                    >
                                                        <Card className="p-4 border-none shadow-sm hover:shadow-md transition-all bg-white group cursor-grab active:cursor-grabbing">
                                                            <div className="space-y-3">
                                                                <div className="flex justify-between items-start">
                                                                    <p className="text-[10px] font-black uppercase leading-tight tracking-tight line-clamp-2 pr-4">
                                                                        {quote.customer.name}
                                                                    </p>
                                                                    <Badge variant="outline" className="text-[7px] h-4 px-1.5 uppercase font-black border-black/5 bg-accent/20">
                                                                        {quote.fencingService.name}
                                                                    </Badge>
                                                                </div>

                                                                <div className="flex items-center gap-1.5 text-[8px] text-muted-foreground font-bold uppercase">
                                                                    <MapPin className="w-2.5 h-2.5 text-primary" />
                                                                    <span className="truncate">{quote.customer.address || 'No Address'}</span>
                                                                </div>

                                                                <div className="pt-3 mt-3 border-t border-dashed border-muted flex justify-between items-center">
                                                                    <span className="text-[10px] font-black text-black">$.${Number(quote.total).toLocaleString()}</span>
                                                                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        <TrendingUp className="w-3 h-3 text-primary" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
}
