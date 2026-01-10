'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { FileDown, Loader2 } from 'lucide-react';
import { generateJobSheetPDF } from '@/lib/pdf-generator';

interface SaveJobSheetButtonProps {
    jobId: string;
    customer: any;
    service: any;
    specs: { length: number, height: number, terrain: string };
    materials: any[];
    assignedTo?: string | null;
    scheduledDate?: Date | string | null;
}

export function SaveJobSheetButton({ 
    jobId, 
    customer, 
    service, 
    specs, 
    materials, 
    assignedTo, 
    scheduledDate 
}: SaveJobSheetButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleSave = async () => {
        setIsGenerating(true);
        try {
            // Ensure scheduledDate is a Date object if it's a string
            const dateObj = scheduledDate ? new Date(scheduledDate) : null;
            
            const doc = await generateJobSheetPDF(
                jobId,
                customer,
                service,
                specs,
                materials,
                assignedTo,
                dateObj
            );
            doc.save(`JobSheet-${jobId.slice(0, 8).toUpperCase()}.pdf`);
        } catch (error) {
            console.error('PDF Generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button 
            variant="outline" 
            className="text-[10px] uppercase tracking-widest font-black h-10 px-6" 
            onClick={handleSave}
            disabled={isGenerating}
        >
            {isGenerating ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                </>
            ) : (
                <>
                    <FileDown className="w-4 h-4 mr-2" />
                    Save as PDF
                </>
            )}
        </Button>
    );
}
