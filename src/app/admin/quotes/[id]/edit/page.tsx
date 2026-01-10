'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { QuotePreview } from '@/components/QuotePreview';
import { Map, Ruler, Mountain, Layers, Plus, Save, Loader2 } from 'lucide-react';
import { estimateQuote } from '@/lib/quoting-engine';
import { generateQuotePDF } from '@/lib/pdf-generator';
import dynamic from 'next/dynamic';

const FencingMap = dynamic(() => import('@/components/FencingMap').then(mod => mod.FencingMap), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-accent animate-pulse rounded-lg flex items-center justify-center text-[10px] uppercase tracking-widest font-bold">Loading Satellite Interface...</div>
});

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [services, setServices] = useState<any[]>([]);
    const [addons, setAddons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        customerId: '',
        fencingServiceId: '',
        lengthMeters: 20,
        heightMeters: 1.8,
        terrain: 'FLAT',
        addOnIds: [] as string[]
    });

    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [servicesRes, addonsRes, quoteRes] = await Promise.all([
                    fetch('/api/fencing-services').then(r => r.json()),
                    fetch('/api/fencing-addons').then(r => r.json()),
                    fetch(`/api/fencing-quotes/${id}`).then(r => r.json())
                ]);

                setServices(servicesRes);
                setAddons(addonsRes);
                setFormData({
                    customerId: quoteRes.customerId,
                    fencingServiceId: quoteRes.fencingServiceId,
                    lengthMeters: Number(quoteRes.lengthMeters),
                    heightMeters: Number(quoteRes.heightMeters),
                    terrain: quoteRes.terrain,
                    addOnIds: quoteRes.addOnIds || []
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const selectedService = useMemo(() => 
        services.find(s => s.id === formData.fencingServiceId),
    [services, formData.fencingServiceId]);

    const estimation = useMemo(() => {
        if (!selectedService) return { subtotal: 0, vat: 0, total: 0, materials: [] };
        
        const terrainFactors: Record<string, number> = { FLAT: 1.0, SLOPED: 1.15, ROCKY: 1.25 };
        
        return estimateQuote(
            Number(selectedService.pricePerMeter),
            formData.lengthMeters,
            formData.heightMeters,
            terrainFactors[formData.terrain] || 1.0,
            Number(selectedService.installationFee),
            selectedService.BillOfMaterials || []
        );
    }, [selectedService, formData]);

    const handleDownloadPDF = async () => {
        if (!selectedService) return;
        setIsGenerating(true);
        try {
            const doc = await generateQuotePDF(
                id,
                { name: "Customer" }, // In real app, fetch full customer
                selectedService,
                estimation
            );
            doc.save(`Quote-Update-${id.slice(0,8)}.pdf`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/fencing-quotes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        if (res.ok) router.push('/admin/quotes');
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Edit Quote</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Refining specifications for Quote #{id.slice(0, 8)}</p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleDownloadPDF}
                        disabled={!selectedService || isGenerating}
                        className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6"
                    >
                        {isGenerating ? 'Generating...' : 'Preview PDF'}
                    </Button>
                    <Button onClick={handleSubmit} className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6">
                        <Save className="w-4 h-4 mr-2" />
                        Update Quote
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="border-b bg-accent/30 py-4">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Ruler className="w-3 h-3 text-primary" />
                                Dimensions & Terrain
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Select Service</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none uppercase tracking-tight font-bold"
                                    value={formData.fencingServiceId}
                                    onChange={e => setFormData({ ...formData, fencingServiceId: e.target.value })}
                                >
                                    <option value="">Choose Service...</option>
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Terrain Complexity</label>
                                <div className="flex p-1 bg-accent rounded-md gap-1">
                                    {['FLAT', 'SLOPED', 'ROCKY'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setFormData({...formData, terrain: t})}
                                            className={`flex-1 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded transition-all ${formData.terrain === t ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-black'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Length (Meters)</label>
                                <Input type="number" value={formData.lengthMeters} onChange={e => setFormData({ ...formData, lengthMeters: parseFloat(e.target.value) })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Height (Meters)</label>
                                <Input type="number" step="0.1" value={formData.heightMeters} onChange={e => setFormData({ ...formData, heightMeters: parseFloat(e.target.value) })} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Geospatial Estimation */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-accent/30 py-4">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Map className="w-3 h-3 text-primary" />
                                Geospatial Perimeter Measurement
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="aspect-video relative">
                                <FencingMap onLengthChange={(l) => setFormData(prev => ({...prev, lengthMeters: l}))} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b bg-accent/30 py-4">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Plus className="w-3 h-3 text-primary" />
                                Custom Add-ons
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {addons.map(addon => (
                                    <button
                                        key={addon.id}
                                        onClick={() => {
                                            const active = formData.addOnIds.includes(addon.id);
                                            setFormData({
                                                ...formData,
                                                addOnIds: active ? formData.addOnIds.filter(id => id !== addon.id) : [...formData.addOnIds, addon.id]
                                            });
                                        }}
                                        className={`p-4 border text-left rounded-md transition-all ${formData.addOnIds.includes(addon.id) ? 'border-primary bg-primary/[0.03] ring-1 ring-primary' : 'border-border hover:border-muted-foreground/30'}`}
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-tight">{addon.name}</p>
                                        <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1 font-bold">
                                            {addon.pricingType === 'PER_METER' ? `£${addon.price}/m` : `£${addon.price} flat`}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Column */}
                <div className="space-y-6">
                    <QuotePreview estimation={estimation} />
                </div>
            </div>
        </div>
    );
}
