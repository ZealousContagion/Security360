'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { createSupportTicket } from "./actions";

export function SupportTicketForm() {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        const res = await createSupportTicket(formData);
        setIsPending(false);
        if (res.success) {
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 5000);
        } else {
            alert("Error: " + res.error);
        }
    };

    if (isSuccess) {
        return (
            <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="py-12 text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto animate-in zoom-in duration-300" />
                    <h3 className="text-sm font-black uppercase tracking-widest">Ticket Submitted</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-tight">Our engineering team has been notified. We will respond shortly.</p>
                    <Button variant="outline" size="sm" onClick={() => setIsSuccess(false)} className="text-[10px] uppercase font-bold">Send another</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest font-bold">Submit Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 block">Subject</label>
                        <Input name="subject" placeholder="e.g. Issue with Invoice PDF generation" required />
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 block">Priority</label>
                        <select 
                            name="priority" 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="LOW">Low - General Question</option>
                            <option value="MEDIUM">Medium - Functional Issue</option>
                            <option value="HIGH">High - Blocked workflow</option>
                            <option value="URGENT">Urgent - System Outage</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 block">Message</label>
                        <textarea 
                            name="message" 
                            required
                            className="w-full min-h-[120px] bg-accent/30 border-none rounded-lg p-4 text-xs font-medium focus:ring-2 focus:ring-primary"
                            placeholder="Please provide details about your issue..."
                        />
                    </div>
                    <Button disabled={isPending} className="w-full h-12 text-[10px] uppercase font-black tracking-[0.2em] shadow-lg">
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                        Open Ticket
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
