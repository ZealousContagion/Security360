import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/Header';
import { getCurrentUserRole } from '@/lib/rbac';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const role = await getCurrentUserRole();
    const isAdmin = role === "ADMIN";
    const isManager = role === "ADMIN" || role === "MANAGER";

    return (
        <div className="flex h-screen bg-background">
            <aside className="w-64 border-r bg-white p-6 flex flex-col shrink-0 print:hidden">
                <div className="mb-10 px-2">
                    <img src="/logo.svg" alt="Security 360" className="h-12 w-auto" />
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Core</div>
                    <Link href="/admin/dashboard" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Dashboard</Button></Link>
                    <Link href="/admin/pipeline" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8 text-primary">Sales Pipeline</Button></Link>
                    <Link href="/admin/schedule" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Schedule</Button></Link>
                    <Link href="/admin/quotes" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Quotes</Button></Link>
                    <Link href="/admin/invoices" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Invoices</Button></Link>
                    <Link href="/admin/customers" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Customers</Button></Link>
                    
                    {isManager && (
                        <>
                            <div className="pt-6 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Management</div>
                            <Link href="/admin/catalog" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Service Catalog</Button></Link>
                            <Link href="/admin/field" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Field Ops</Button></Link>
                            <Link href="/admin/team" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Team</Button></Link>
                        </>
                    )}
                    
                    {isManager && (
                        <>
                            <div className="pt-6 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">Finance</div>
                            <Link href="/admin/payments" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Payments</Button></Link>
                            <Link href="/admin/expenses" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Expenses</Button></Link>
                            <Link href="/admin/purchase-orders" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Purchase Orders</Button></Link>
                            <Link href="/admin/reports" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Reports</Button></Link>
                        </>
                    )}
                    
                    <div className="pt-6 pb-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-2">System</div>
                    <Link href="/admin/notifications" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Notifications</Button></Link>
                    <Link href="/admin/settings" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Settings</Button></Link>
                    {isAdmin && (
                        <Link href="/admin/settings/users" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">User Access</Button></Link>
                    )}
                    <Link href="/admin/support" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8">Support</Button></Link>
                    
                    {isAdmin && (
                        <Link href="/admin/system" className="block"><Button variant="ghost" className="w-full justify-start font-normal hover:bg-muted text-xs uppercase tracking-widest h-8 text-destructive">Health Check</Button></Link>
                    )}
                </nav>
                <div className="pt-6 border-t mt-4">
                    <Link href="/auth/login"><Button variant="outline" className="w-full border-muted-foreground/20 font-normal">Logout</Button></Link>
                </div>
            </aside>
            <div className="flex-1 flex flex-col min-w-0">
                <div className="print:hidden">
                    <Header />
                </div>
                <main className="flex-1 overflow-y-auto bg-accent/30 p-10 print:p-0 print:bg-white">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
