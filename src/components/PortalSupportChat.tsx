'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Loader2, Send, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import { createPortalSupportTicket } from '@/app/portal/actions';

interface Ticket {
    id: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date | string;
}

interface PortalSupportChatProps {
    customerId: string;
    activeQuoteId: string | null;
    initialTickets: any[];
}

export function PortalSupportChat({ customerId, activeQuoteId, initialTickets }: PortalSupportChatProps) {
    const [message, setMessage] = useState('');
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        startTransition(async () => {
            const res = await createPortalSupportTicket(customerId, activeQuoteId, message);
            if (res.success) {
                setMessage('');
                setIsSuccess(true);
                setTimeout(() => setIsSuccess(false), 3000);
            } else {
                alert("Error sending message: " + res.error);
            }
        });
    };

    return (
        <Card className="border-black/5 shadow-sm">
            <CardHeader className="border-b bg-accent/10 py-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-3 h-3 text-primary" />
                    Direct Inquiry
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {/* Message History (Mini) */}
                <div className="max-h-[200px] overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {initialTickets.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground uppercase font-bold text-center py-4">No recent messages</p>
                    ) : (
                        initialTickets.map((ticket) => (
                            <div key={ticket.id} className="space-y-1">
                                <div className="flex justify-between items-start gap-2">
                                    <p className="text-[10px] font-black uppercase tracking-tight line-clamp-1">{ticket.subject}</p>
                                    <span className={`text-[7px] font-black px-1 rounded uppercase border ${
                                        ticket.status === 'OPEN' ? 'border-amber-200 text-amber-600 bg-amber-50' : 
                                        ticket.status === 'RESOLVED' ? 'border-green-200 text-green-600 bg-green-50' :
                                        'border-blue-200 text-blue-600 bg-blue-50'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-tight italic">"{ticket.message}"</p>
                                <p className="text-[7px] text-muted-foreground font-bold uppercase">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                <div className="h-[1px] bg-black/5 w-full mt-2" />
                            </div>
                        ))
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="p-4 bg-accent/5 border-t border-dashed">
                    <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                        {activeQuoteId ? "Ask about your active proposal" : "Ask a general question"}
                    </p>
                    <div className="relative">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your question..."
                            className="w-full min-h-[80px] bg-white border border-black/5 rounded-lg p-3 text-[11px] font-medium focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                            disabled={isPending}
                        />
                        <button
                            type="submit"
                            disabled={isPending || !message.trim()}
                            className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors shadow-lg"
                        >
                            {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        </button>
                    </div>
                    {isSuccess && (
                        <div className="flex items-center gap-1 mt-2 text-green-600 animate-in fade-in slide-in-from-top-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Sent to Support</span>
                        </div>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}
