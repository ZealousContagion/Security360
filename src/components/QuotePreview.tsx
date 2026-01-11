import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';

interface Material {
    name: string;
    quantity: number;
    unit: string;
    estimatedCost: number;
}

interface QuotePreviewProps {
    estimation: {
        subtotal: number;
        vat: number;
        total: number;
        materials: Material[];
    };
}

export function QuotePreview({ estimation }: QuotePreviewProps) {
    return (
        <Card className="border-primary/20 bg-primary/[0.02]">
            <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Live Estimation Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Subtotal</p>
                        <p className="text-xl font-black tracking-tighter">${estimation.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest">Total (Inc. VAT)</p>
                        <p className="text-xl font-black tracking-tighter text-primary">${estimation.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest border-b pb-1">Estimated Bill of Materials</p>
                    {estimation.materials.length === 0 ? (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground py-2 italic text-center">Select a service to see materials</p>
                    ) : (
                        <div className="space-y-2">
                            {estimation.materials.map((m, i) => (
                                <div key={i} className="flex justify-between items-center group">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-primary rounded-full" />
                                        <span className="text-[10px] font-bold uppercase tracking-tight">{m.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] text-muted-foreground font-medium uppercase">{m.quantity} {m.unit}</span>
                                        <span className="text-[10px] font-black w-16 text-right">${m.estimatedCost.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white/50 p-3 border border-dashed rounded text-[9px] text-muted-foreground leading-relaxed uppercase tracking-tight">
                    <strong className="text-black">Senior Engineer Note:</strong> These are automated estimates based on average material usage and include a 10% wastage buffer. Final on-site survey may adjust these requirements.
                </div>
            </CardContent>
        </Card>
    );
}
