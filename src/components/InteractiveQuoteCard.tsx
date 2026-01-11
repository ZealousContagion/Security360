'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Check, Loader2, PenLine, Settings2, ShieldCheck, Zap } from 'lucide-react';
import { updateQuoteAddons } from '@/app/portal/actions';
import { ApproveQuoteButton } from './ApproveQuoteButton';

interface Addon {
    id: string;
    name: string;
    price: number;
    pricingType: string;
}

interface Quote {
    id: string;
    lengthMeters: any;
    heightMeters: any;
    subtotal: any;
    vat: any;
    total: any;
    addOnIds: string[];
    fencingService: {
        name: string;
    };
}

interface InteractiveQuoteCardProps {
    quote: Quote;
    availableAddons: Addon[];
}

export function InteractiveQuoteCard({ quote, availableAddons }: InteractiveQuoteCardProps) {
    const [selectedAddons, setSelectedAddons] = useState<string[]>(quote.addOnIds);
    const [isPending, startTransition] = useTransition();

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev => 
            prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
        );
    };

    const handleUpdate = () => {
        startTransition(async () => {
            const res = await updateQuoteAddons(quote.id, selectedAddons);
            if (!res.success) {
                alert("Error updating quote: " + res.error);
            }
        });
    };

    const hasChanges = JSON.stringify(selectedAddons.sort()) !== JSON.stringify(quote.addOnIds.sort());

    return (
        <Card className="border-primary/20 bg-primary/[0.01] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Interactive Quote</CardTitle>
                        <h4 className="text-xl font-black uppercase tracking-tighter mt-1">{quote.fencingService.name}</h4>
                    </div>
                    <Badge variant="outline" className="bg-white text-[8px] font-black uppercase tracking-widest border-primary/20">
                        {Number(quote.lengthMeters)}m x {Number(quote.heightMeters)}m
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                {/* Add-ons Selection */}
                <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                        <Settings2 className="w-3 h-3" />
                        Optional Security Enhancements
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {availableAddons.map((addon) => {
                            const isSelected = selectedAddons.includes(addon.id);
                            return (
                                <button
                                    key={addon.id}
                                    onClick={() => toggleAddon(addon.id)}
                                    className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                                        isSelected 
                                            ? 'bg-primary/10 border-primary shadow-sm' 
                                            : 'bg-white border-black/5 hover:border-black/20'
                                    }`}
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black uppercase tracking-tight">{addon.name}</p>
                                        <p className="text-[8px] text-muted-foreground font-bold uppercase">
                                            ${Number(addon.price)} {addon.pricingType === 'PER_METER' ? '/ m' : 'flat'}
                                        </p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                        isSelected ? 'bg-primary border-primary' : 'bg-accent/50 border-black/10'
                                    }`}>
                                        {isSelected && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Pricing Summary */}
                <div className="bg-white border border-dashed rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span>Subtotal</span>
                        <span className="text-black font-black">${Number(quote.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span>VAT (15%)</span>
                        <span className="text-black font-black">${Number(quote.vat).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-[1px] bg-black/5" />
                    <div className="flex justify-between items-center">
                        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">Total Amount</span>
                        <span className="text-2xl font-black tracking-tighter">${Number(quote.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {hasChanges ? (
                        <Button 
                            className="flex-1 text-[10px] font-black uppercase tracking-widest h-12 shadow-lg shadow-primary/20"
                            onClick={handleUpdate}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                            Recalculate & Update Quote
                        </Button>
                    ) : (
                        <div className="flex-1">
                            <ApproveQuoteButton quoteId={quote.id} />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-100 sm:max-w-[200px]">
                        <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                        <p className="text-[8px] font-bold text-green-700 uppercase leading-tight">Price Guaranteed for 14 Days</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function Badge({ children, variant = 'default', className = '' }: any) {
    const variants: any = {
        default: 'bg-accent text-accent-foreground',
        outline: 'border border-black/10 text-muted-foreground',
        success: 'bg-green-100 text-green-700 border-green-200'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
