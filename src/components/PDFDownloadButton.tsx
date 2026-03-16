'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Download, Loader2 } from 'lucide-react';
import { generateQuotePDF } from '@/lib/pdf-generator';

interface PDFDownloadButtonProps {
    quote: any;
    customer: any;
}

export function PDFDownloadButton({ quote, customer }: PDFDownloadButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            // Re-calculate or use serialized data
            const estimation = {
                subtotal: Number(quote.subtotal),
                vat: Number(quote.vat),
                total: Number(quote.total),
                materials: [] // BOM typically isn't shown in detail to customers in simple PDF, but we can pass it if we have it
            };

            const doc = await generateQuotePDF(
                quote.id,
                customer,
                quote.fencingService,
                estimation as any,
                quote.signatureData
            );
            
            doc.save(`Security360_Quote_${quote.id.slice(0,8)}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Could not generate PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            disabled={loading}
            onClick={handleDownload}
            className="text-[9px] uppercase tracking-widest font-black h-7 px-3 flex items-center gap-2"
        >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            PDF
        </Button>
    );
}
