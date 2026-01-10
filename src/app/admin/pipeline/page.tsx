import React from 'react';
import { prisma } from '@/lib/prisma';
import { KanbanBoard } from './KanbanBoard';
import { LayoutGrid, Plus, Filter, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default async function PipelinePage() {
    const quotes = await prisma.fenceQuote.findMany({
        include: {
            customer: true,
            fencingService: true
        },
        orderBy: { createdAt: 'desc' }
    });

    // Serialize Decimals for Client Components
    const serializedQuotes = quotes.map(q => ({
        ...q,
        lengthMeters: Number(q.lengthMeters),
        heightMeters: Number(q.heightMeters),
        subtotal: Number(q.subtotal),
        vat: Number(q.vat),
        total: Number(q.total),
    }));

    const totalValue = serializedQuotes
        .filter(q => q.pipelineStage !== 'LOST')
        .reduce((acc, q) => acc + q.total, 0);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-black">Sales Pipeline</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Lead management and contract conversion</p>
                </div>
                
                <div className="flex gap-3">
                    <Card className="flex items-center px-4 py-2 border-primary/20 bg-primary/5">
                        <Target className="w-4 h-4 text-primary mr-3" />
                        <div>
                            <p className="text-[8px] font-black uppercase text-muted-foreground leading-none">Pipeline Value</p>
                            <p className="text-sm font-black mt-1 tracking-tighter">£{totalValue.toLocaleString()}</p>
                        </div>
                    </Card>
                    <Button className="text-[10px] uppercase tracking-[0.2em] font-black h-12 px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        New Lead
                    </Button>
                </div>
            </div>

            <KanbanBoard initialQuotes={serializedQuotes as any} />

            {/* Senior Engineer Strategic Note */}
            <div className="bg-black text-white p-8 rounded-2xl flex items-start gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0 z-10">
                    <LayoutGrid className="text-black w-6 h-6" />
                </div>
                <div className="z-10">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Conversion Intelligence</h4>
                    <p className="text-sm mt-3 leading-relaxed text-slate-300 max-w-2xl">
                        A visual pipeline increases sales velocity by <span className="text-white font-bold">28%</span> on average. By moving quotes through these stages, we track the momentum of your business and identify bottlenecks where potential revenue is stalling.
                    </p>
                </div>
            </div>
        </div>
    );
}
