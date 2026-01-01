"use client"

import Link from "next/link"
import { LayoutDashboard, FileText, CreditCard, Users, BarChart3, Settings, ShieldCheck, RefreshCw, History, Package, User as UserIcon, Receipt, LifeBuoy, Bell, BookOpen, HeartPulse, LayoutGrid, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/Button"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    onNavItemClick?: () => void;
}

export function Sidebar({ className, onNavItemClick, ...props }: SidebarProps) {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/invoices", label: "Invoices", icon: FileText },
        { href: "/admin/invoices/recurring", label: "Recurring", icon: RefreshCw },
        { href: "/admin/payments", label: "Payments", icon: CreditCard },
        { href: "/admin/customers", label: "Customers", icon: Users },
        { href: "/admin/catalog", label: "Service Catalog", icon: Package },
        { href: "/admin/reports", label: "Reports", icon: BarChart3 },
        { href: "/admin/audit-logs", label: "Audit Logs", icon: History },
        { href: "/admin/users", label: "Team", icon: UserIcon },
        { href: "/admin/expenses", label: "Expenses", icon: Receipt },
        { href: "/admin/support", label: "Support", icon: LifeBuoy },
        { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ]

    const systemItems = [
        { href: "/admin/help", label: "Staff Help", icon: BookOpen },
        { href: "/admin/health", label: "System Health", icon: HeartPulse },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ]

    const isActive = (href: string) => pathname === href

    return (
        <div className={cn("flex flex-col h-full border-r bg-card shadow-sm", className)} {...props}>
            <div className="flex-1 overflow-y-auto no-scrollbar">
                <div className="space-y-4 py-4">
                    <div className="px-3 py-2">
                        <div className="flex items-center px-4 mb-6">
                            <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
                            <h2 className="text-xl font-bold tracking-tight text-primary">Security 360</h2>
                        </div>

                        {/* User Profile Hook */}
                        {user && (
                            <div className="mx-4 mb-6 p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {user.fullName.charAt(0)}
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-bold truncate">{user.fullName}</span>
                                    <span className="text-[10px] text-primary/60 font-medium uppercase tracking-tighter">{user.role}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavItemClick}
                                    className={cn(
                                        "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                                        isActive(item.href)
                                            ? "bg-primary/10 text-primary border-r-2 border-primary mr-0 rounded-r-none"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                                    )}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}

                            <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                                Fencing Services
                            </div>
                            <Link
                                href="/admin/fencing"
                                onClick={onNavItemClick}
                                className={cn(
                                    "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                                    pathname.startsWith("/admin/fencing")
                                        ? "bg-primary/10 text-primary border-r-2 border-primary mr-0 rounded-r-none"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                                )}
                            >
                                <LayoutGrid className="mr-2 h-4 w-4" />
                                Fencing Center
                            </Link>

                            <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                                System
                            </div>
                            {systemItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onNavItemClick}
                                    className={cn(
                                        "flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                                        isActive(item.href)
                                            ? "bg-primary/10 text-primary border-r-2 border-primary mr-0 rounded-r-none"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-primary"
                                    )}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 mt-auto space-y-2 border-t bg-card/50">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    onClick={() => logout()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Secure Logout
                </Button>

                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Identity Secure</span>
                            <span className="text-[9px] text-muted-foreground">JWT Session Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
