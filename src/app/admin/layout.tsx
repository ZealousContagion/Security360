"use client"

import * as React from "react"
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ProtectedRoute } from "@/components/providers/ProtectedRoute";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen flex-col md:flex-row bg-muted/40 relative">
                {/* Mobile Sidebar Drawer */}
                <div className={cn(
                    "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden transition-all duration-300",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )} onClick={() => setIsSidebarOpen(false)}>
                    <div
                        className={cn(
                            "fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-card border-r shadow-xl transition-transform duration-300 ease-in-out",
                            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="font-bold text-primary">Navigation</span>
                            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <Sidebar
                            className="h-[calc(100vh-64px)] border-none"
                            onNavItemClick={() => setIsSidebarOpen(false)}
                        />
                    </div>
                </div>

                {/* Desktop Sidebar */}
                <div className="hidden md:block w-64 flex-shrink-0">
                    <Sidebar className="fixed w-64 h-full" />
                </div>

                <div className="flex-1 flex flex-col md:ml-0 transition-all duration-300 ease-in-out">
                    <div className="sticky top-0 z-30">
                        <TopNav onMenuClick={() => setIsSidebarOpen(true)} />
                    </div>
                    <main className="p-4 md:p-6 lg:p-8 flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
