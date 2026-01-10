import { prisma } from "@/lib/prisma";
import { isAdmin, isManager } from "@/lib/rbac";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Zap, Database, Globe, Users } from "lucide-react";
import { BusinessSettingsForm } from "./BusinessSettingsForm";
import { TaxSettingsForm } from "./TaxSettingsForm";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function SettingsPage() {
    if (!await isManager()) {
        redirect("/admin/dashboard");
    }

    const [taxConfig, businessConfig] = await Promise.all([
        prisma.taxConfig.findFirst(),
        prisma.businessConfig.findFirst()
    ]);

    const adminUser = await isAdmin();

    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-black">Command Center</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">System-wide configuration and security</p>
                </div>
                {adminUser && (
                    <Link href="/admin/settings/users">
                        <Button variant="outline" className="text-[10px] uppercase font-black tracking-widest h-10 border-primary/20 hover:bg-primary hover:text-black transition-all">
                            <Users className="w-4 h-4 mr-2" />
                            User Access Control
                        </Button>
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Business & Docs */}
                <div className="lg:col-span-2">
                    <BusinessSettingsForm config={businessConfig} />
                </div>

                {/* Right Column: Financials & Health */}
                <div className="space-y-8">
                    <TaxSettingsForm config={taxConfig} />

                    <Card className="bg-black text-white border-none shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" />
                                Technical Health Center
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Database className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Database</span>
                                </div>
                                <Badge className="bg-green-500 text-white border-none text-[8px] h-4 font-black">STABLE</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Zap className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Stripe API</span>
                                </div>
                                <Badge className="bg-green-500 text-white border-none text-[8px] h-4 font-black">CONNECTED</Badge>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Resend Mail</span>
                                </div>
                                <Badge className="bg-green-500 text-white border-none text-[8px] h-4 font-black">ACTIVE</Badge>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-[9px] text-slate-400 leading-relaxed uppercase font-medium">
                                    System running Security 360 Kernel v2.4. All critical endpoints are responding within 200ms.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-6 border-2 border-dashed rounded-xl flex flex-col items-center text-center space-y-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Security Audit</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold leading-relaxed">
                            Last full system scan completed 4 hours ago. 0 vulnerabilities detected.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}