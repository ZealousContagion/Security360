'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQS = [
    {
        q: "How do I change the VAT rate?",
        a: "Navigate to Settings > Command Center. Look for the 'Tax & Regional' card on the right. Enter the new rate and click 'Update VAT'."
    },
    {
        q: "Why are my stock levels negative?",
        a: "This happens when a Job is completed but the required materials were not in the Service Catalog. You can resolve this by creating a Purchase Order for the missing items or using the 'Restock' button in the Catalog."
    },
    {
        q: "Can I cancel an invoice after it's been paid?",
        a: "Paid invoices cannot be cancelled directly to maintain financial integrity. You should issue a credit note (manual expense) if a refund is required."
    },
    {
        q: "How does the automated scheduling work?",
        a: "When a customer pays a deposit via Stripe or you record a manual Cash Deposit, the system automatically creates a Job record and places it in the 'Pending Allocation' list on the Schedule page."
    }
];

export function SupportFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    Frequently Asked Questions
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {FAQS.map((faq, i) => (
                    <div key={i} className="border border-black/5 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex justify-between items-center p-4 text-left hover:bg-accent/30 transition-colors"
                        >
                            <span className="text-[10px] font-black uppercase tracking-tight">{faq.q}</span>
                            {openIndex === i ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {openIndex === i && (
                            <div className="p-4 bg-accent/10 border-t border-black/5">
                                <p className="text-xs text-muted-foreground leading-relaxed uppercase font-medium tracking-tight">
                                    {faq.a}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
