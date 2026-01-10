'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Percent, Save, Loader2 } from "lucide-react";
import { updateTaxConfig } from "./actions";

export function TaxSettingsForm({ config }: { config: any }) {
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await updateTaxConfig(formData);
            alert("Tax configuration updated!");
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                    <Percent className="w-4 h-4 text-primary" />
                    Tax & Regional
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid gap-1">
                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Tax Label</label>
                        <Input name="name" defaultValue={config?.name || "VAT"} required />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Rate (%)</label>
                        <Input name="rate" type="number" step="0.01" defaultValue={(Number(config?.rate || 0.15) * 100).toString()} required />
                    </div>
                    <div className="pt-2">
                        <Button variant="outline" disabled={isPending} className="w-full h-10 text-[9px] uppercase font-black tracking-widest">
                            {isPending ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
                            Update VAT
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
