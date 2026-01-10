'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save, Loader2, Landmark, Building2, FileText } from "lucide-react";
import { updateBusinessConfig } from "./actions";

export function BusinessSettingsForm({ config }: { config: any }) {
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await updateBusinessConfig(formData);
            alert("Settings updated successfully!");
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        Business Identity
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Company Name</label>
                            <Input name="companyName" defaultValue={config?.companyName || "Security 360"} required />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Address</label>
                            <Input name="address" defaultValue={config?.address} placeholder="15 Coventry Rd, Harare" />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Support Email</label>
                            <Input name="supportEmail" type="email" defaultValue={config?.supportEmail} />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Support Phone</label>
                            <Input name="supportPhone" defaultValue={config?.supportPhone} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-primary" />
                        Bank Details (for Manual Payments)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Bank Name</label>
                            <Input name="bankName" defaultValue={config?.bankName} placeholder="e.g. Stanbic Bank" />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Account Name</label>
                            <Input name="bankAccName" defaultValue={config?.bankAccName} />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Account Number</label>
                            <Input name="bankAccNumber" defaultValue={config?.bankAccNumber} />
                        </div>
                        <div className="grid gap-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Branch / Code</label>
                            <Input name="bankBranch" defaultValue={config?.bankBranch} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-primary" />
                        Document Terms & Conditions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <textarea 
                        name="terms" 
                        defaultValue={config?.terms}
                        className="w-full min-h-[150px] bg-accent/30 border-none rounded-lg p-4 text-xs font-medium focus:ring-2 focus:ring-primary"
                        placeholder="These terms will appear at the bottom of Quotes and Invoices..."
                    />
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button disabled={isPending} className="px-12 h-12 text-[10px] uppercase font-black tracking-[0.2em] shadow-xl">
                    {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Deploy Global Settings
                </Button>
            </div>
        </form>
    );
}
