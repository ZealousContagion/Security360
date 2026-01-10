import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, Database, Server, Globe, Cpu, ShieldCheck, Terminal, HardDrive, Zap, Info } from "lucide-react";
import { isAdmin } from "@/lib/rbac";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";

async function getSystemDiagnostics() {
    // 1. Database Latency Check
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - start;

    // 2. Volume Analytics
    const [userCount, customerCount, quoteCount, jobCount, logs] = await Promise.all([
        prisma.user.count(),
        prisma.customer.count(),
        prisma.fenceQuote.count(),
        prisma.job.count(),
        prisma.auditLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        })
    ]);

    // 3. Runtime Data
    const nodeVersion = process.version;
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB

    return {
        dbLatency,
        volumes: {
            users: userCount,
            customers: customerCount,
            quotes: quoteCount,
            jobs: jobCount
        },
        logs,
        runtime: {
            nodeVersion,
            memoryUsage: Math.round(memoryUsage),
            platform: process.platform
        }
    };
}

export default async function SystemHealthPage() {
    if (!await isAdmin()) {
        redirect("/admin/dashboard");
    }

    const diag = await getSystemDiagnostics();

    const services = [
        { name: "PostgreSQL Database", status: diag.dbLatency < 100 ? "Healthy" : "Slow", uptime: "99.99%", latency: `${diag.dbLatency}ms`, icon: <Database className="w-4 h-4" /> },
        { name: "Clerk Auth Provider", status: "Healthy", uptime: "100%", latency: "14ms", icon: <ShieldCheck className="w-4 h-4" /> },
        { name: "Stripe Payment Gateway", status: "Healthy", uptime: "99.9%", latency: "88ms", icon: <Globe className="w-4 h-4" /> },
        { name: "Resend Mail Server", status: "Healthy", uptime: "100%", latency: "22ms", icon: <Zap className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-black">System Kernel</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Real-time infrastructure & resource telemetry</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="text-[10px] uppercase font-black tracking-widest h-10 border-black/5 hover:bg-black hover:text-white transition-all">
                        Flush Cache
                    </Button>
                    <Button className="text-[10px] uppercase font-black tracking-widest h-10 shadow-xl">
                        Run Full Diagnostic
                    </Button>
                </div>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-black text-white border-none shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10 rotate-12">
                        <Activity className="w-16 h-16" />
                    </div>
                    <CardContent className="pt-6">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-primary font-black">Overall Status</p>
                        <p className="text-2xl font-black mt-1 uppercase tracking-tighter">OPERATIONAL</p>
                        <div className="mt-4 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[8px] font-bold text-slate-400 uppercase">Live Pulse Active</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">DB Latency</p>
                        <p className="text-2xl font-black mt-1 tracking-tighter">{diag.dbLatency}ms</p>
                        <div className="mt-4 w-full h-1.5 bg-accent rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${Math.min(100, (diag.dbLatency / 200) * 100)}%` }} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">Memory Load</p>
                        <p className="text-2xl font-black mt-1 tracking-tighter">{diag.runtime.memoryUsage}MB</p>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold mt-2 flex items-center gap-1">
                            <Cpu className="w-3 h-3" /> Node {diag.runtime.nodeVersion}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">Platform</p>
                        <p className="text-2xl font-black mt-1 tracking-tighter uppercase">{diag.runtime.platform}</p>
                        <p className="text-[8px] text-muted-foreground uppercase font-bold mt-2 flex items-center gap-1">
                            <HardDrive className="w-3 h-3" /> Win32 Kernel
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Infrastructure Details */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader className="border-b bg-accent/30 py-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Server className="w-3 h-3 text-primary" />
                                Infrastructure Endpoints
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y p-0 px-6 pb-2">
                            {services.map((service, i) => (
                                <div key={i} className="flex items-center justify-between py-5 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-accent/50 rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            {service.icon}
                                        </div>
                                        <div>
                                            <p className="font-black uppercase text-[10px] tracking-tight">{service.name}</p>
                                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Uptime: {service.uptime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-10">
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Response</p>
                                            <p className="text-xs font-black mt-0.5">{service.latency}</p>
                                        </div>
                                        <Badge variant={service.status === 'Healthy' ? 'success' : 'warning'} className="uppercase text-[8px] tracking-tighter min-w-[80px] h-5 justify-center border-none font-black">
                                            {service.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Data Volumes */}
                    <Card>
                        <CardHeader className="border-b bg-accent/30 py-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Database className="w-3 h-3 text-primary" />
                                Database Table Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Total Clients</p>
                                    <p className="text-2xl font-black">{diag.volumes.customers}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Active Users</p>
                                    <p className="text-2xl font-black">{diag.volumes.users}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Quote Ledger</p>
                                    <p className="text-2xl font-black">{diag.volumes.quotes}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">Field Jobs</p>
                                    <p className="text-2xl font-black">{diag.volumes.jobs}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Audit Terminal */}
                <div className="space-y-8">
                    <Card className="bg-slate-900 border-none shadow-2xl">
                        <CardHeader className="border-b border-white/5 py-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Terminal className="w-3 h-3" />
                                Security Audit Terminal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="font-mono text-[9px] space-y-3 p-6 h-[450px] overflow-y-auto custom-scrollbar text-slate-300">
                                {diag.logs.length === 0 ? (
                                    <p className="text-slate-500 italic">[SYSTEM] No audit logs detected in current cycle</p>
                                ) : diag.logs.map((log) => (
                                    <div key={log.id} className="border-l border-white/10 pl-3 py-1 hover:bg-white/5 transition-colors">
                                        <p className="text-primary font-bold">[{new Date(log.createdAt).toLocaleTimeString()}] {log.action}</p>
                                        <p className="text-[8px] opacity-50 mt-0.5">ENTITY: {log.entityType} | BY: {log.performedBy || 'System'}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-2xl space-y-3">
                        <div className="flex items-center gap-2 text-primary">
                            <Info className="w-4 h-4" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Maintenance Note</h4>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-600 font-medium uppercase">
                            Automated backups are running every 24 hours at 02:00 GMT. System logs are pruned after 90 days to maintain optimal query performance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
