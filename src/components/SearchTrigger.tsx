'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './ui/Input';

export function SearchTrigger() {
    const handleClick = () => {
        // Dispatch a custom event that CommandPalette listens to
        window.dispatchEvent(new CustomEvent('open-command-palette'));
    };

    return (
        <div className="relative group cursor-pointer" onClick={handleClick}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input 
                placeholder="Search anything... (Press /)" 
                className="pl-10 bg-accent/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-9 text-sm cursor-pointer"
                readOnly
            />
            {/* Search Tooltip */}
            <div className="absolute -bottom-10 left-0 bg-secondary text-secondary-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest font-bold whitespace-nowrap z-50">
                Press <span className="text-primary mx-1">/</span> to search anything
            </div>
        </div>
    );
}
