'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Loader2, PenLine, X } from 'lucide-react';
import { customerApproveQuote } from '@/app/portal/actions';
import { SignaturePad } from './SignaturePad';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface ApproveQuoteButtonProps {
    quoteId: string;
}

export function ApproveQuoteButton({ quoteId }: ApproveQuoteButtonProps) {
    const [isPending, setIsPending] = useState(false);
    const [showSignaturePad, setShowSignaturePad] = useState(false);

    const handleApprove = async (signatureData: string) => {
        setIsPending(true);
        try {
            const res = await customerApproveQuote(quoteId, signatureData);
            if (!res.success) {
                alert('Error approving quote: ' + res.error);
            } else {
                setShowSignaturePad(false);
            }
        } finally {
            setIsPending(false);
        }
    };

    if (showSignaturePad) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                    <CardHeader className="border-b bg-accent/30 py-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <PenLine className="w-3 h-3 text-primary" />
                            Digital Signature
                        </CardTitle>
                        <button onClick={() => setShowSignaturePad(false)} className="text-muted-foreground hover:text-black">
                            <X className="w-4 h-4" />
                        </button>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <p className="text-[10px] text-muted-foreground uppercase font-bold leading-relaxed">
                            By signing below, you agree to the project specifications and terms of service. An invoice for the deposit will be generated immediately.
                        </p>
                        
                        {isPending ? (
                            <div className="h-48 flex flex-col items-center justify-center gap-4 bg-accent/10 rounded-lg">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <p className="text-[9px] font-black uppercase tracking-widest animate-pulse">Finalizing Contract...</p>
                            </div>
                        ) : (
                            <SignaturePad onSave={handleApprove} />
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <Button 
            size="sm" 
            onClick={() => setShowSignaturePad(true)}
            disabled={isPending}
            className="text-[9px] uppercase tracking-widest font-black h-7 px-3 bg-green-600 hover:bg-green-700"
        >
            <PenLine className="w-3 h-3 mr-2" />
            Review & Sign
        </Button>
    );
}