import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { getCurrentUserRole } from '@/lib/rbac';
import { NotificationTooltip } from './NotificationTooltip';
import { CommandPalette } from './CommandPalette';
import { SearchTrigger } from './SearchTrigger';

export async function Header() {
    const role = await getCurrentUserRole();

    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Search Section */}
            <div className="flex-1 max-w-md">
                <SearchTrigger />
            </div>

            {/* Actions Section */}
            <div className="flex items-center space-x-4">
                <NotificationTooltip />
                
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <HelpCircle className="w-5 h-5" />
                </Button>

                <div className="h-6 w-[1px] bg-border mx-2"></div>

                <div className="flex items-center space-x-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold uppercase tracking-tight">Active User</p>
                        <p className="text-[10px] text-primary uppercase tracking-widest font-black">{role}</p>
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>

            {/* Global Search UI */}
            <CommandPalette />
        </header>
    );
}
