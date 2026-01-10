import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Activity, Database, Server, Globe, Cpu, ShieldCheck } from "lucide-react";
import { isAdmin } from "@/lib/rbac";
import { redirect } from "next/navigation";

export default async function SystemHealthPage() {
    if (!await isAdmin()) {
        redirect("/admin/dashboard");
    }

    const services = [
        { name: "Database Cluster", status: "Healthy", uptime: "99.99%", latency: "12ms", icon: <Database className="w-4 h-4" /> },
        { name: "Main API Gateway", status: "Healthy", uptime: "99.95%", latency: "45ms", icon: <Server className="w-4 h-4" /> },
        { name: "Auth Provider (Clerk)", status: "Healthy", uptime: "100%", latency: "8ms", icon: <ShieldCheck className="w-4 h-4" /> },
        { name: "Payments Hook (Stripe)", status: "Degraded", uptime: "98.5%", latency: "120ms", icon: <Globe className="w-4 h-4" /> },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">System Health</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Real-time infrastructure monitoring</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <Activity className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold leading-none">Overall Status</p>
                                <p className="text-xl font-black tracking-tighter uppercase mt-1">Operational</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold leading-none">CPU Load</p>
                                <p className="text-xl font-black tracking-tighter uppercase mt-1">12.4%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {/* Add more metric cards if needed */}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-widest font-bold">Services</CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y p-0 px-6 pb-6">
                            {services.map((service, i) => (
                                <div key={i} className="flex items-center justify-between py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-muted-foreground">{service.icon}</div>
                                        <div>
                                            <p className="font-bold uppercase text-[10px] tracking-tight">{service.name}</p>
                                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Uptime: {service.uptime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none">Latency</p>
                                            <p className="text-xs font-bold mt-1">{service.latency}</p>
                                        </div>
                                        <Badge variant={service.status === 'Healthy' ? 'success' : 'warning'} className="uppercase text-[8px] tracking-tighter min-w-[70px] justify-center">
                                            {service.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold">System Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="font-mono text-[9px] space-y-2 bg-secondary/30 p-4 rounded border border-muted-foreground/10 h-[300px] overflow-y-auto">
                            <p className="text-green-600">[INFO] 14:23:45 Server restarted successfully</p>
                            <p className="text-muted-foreground">[LOG] 14:25:12 Backup process initiated</p>
                            <p className="text-muted-foreground">[LOG] 14:26:01 Daily sync with CRM completed</p>
                            <p className="text-yellow-600">[WARN] 14:30:22 High latency detected in API-G</p>
                            <p className="text-muted-foreground">[LOG] 14:35:00 Worker node 4 scaled up</p>
                            <p className="text-muted-foreground">[LOG] 14:40:11 SSL Certificate verified</p>
                            <p className="text-muted-foreground">[LOG] 14:45:30 DB Vacuuming started</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
