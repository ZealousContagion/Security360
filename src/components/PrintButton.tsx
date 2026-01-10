'use client';

import React from 'react';
import { Button } from './ui/Button';
import { Printer } from 'lucide-react';

export function PrintButton() {
    return (
        <Button 
            variant="outline" 
            className="text-[10px] uppercase tracking-widest font-black h-10 px-6" 
            onClick={() => window.print()}
        >
            <Printer className="w-4 h-4 mr-2" />
            Print Sheet
        </Button>
    );
}
