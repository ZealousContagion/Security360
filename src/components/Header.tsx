import React from 'react';
import { UserButton } from '@clerk/nextjs';
import { Search, Bell, Plus, HelpCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { getCurrentUserRole } from '@/lib/rbac';

export async function Header() {
    const role = await getCurrentUserRole();

    return (
        <header className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-40">
            {/* Search Section */}
            <div className="flex-1 max-w-md relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                    placeholder="Search quotes, invoices..." 
                    className="pl-10 bg-accent/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-9 text-sm"
                />
                {/* Search Tooltip Placeholder */}
                <div className="absolute -bottom-10 left-0 bg-secondary text-secondary-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest font-bold whitespace-nowrap">
                    Press <span className="text-primary mx-1">/</span> to search anything
                </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                </Button>
                
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
        </header>
    );
}
