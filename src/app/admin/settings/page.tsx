import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { prisma } from "@/lib/prisma";
import { isManager } from "@/lib/rbac";

export default async function SettingsPage() {
    const taxConfig = await prisma.taxConfig.findFirst();
    const canManageFinances = await isManager();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Settings</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Manage your account and system preferences</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold">General Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Business Name</label>
                            <Input defaultValue="Security 360 Ltd" disabled={!canManageFinances} />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Support Email</label>
                            <Input defaultValue="support@security360.co.zw" disabled={!canManageFinances} />
                        </div>
                        {canManageFinances && <Button className="w-fit px-8 text-[10px] uppercase tracking-[0.2em] font-bold h-9">Save Changes</Button>}
                    </CardContent>
                </Card>

                {canManageFinances && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-widest font-bold">Tax & Financials</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">VAT Rate (%)</label>
                                <Input defaultValue={(Number(taxConfig?.rate || 0.15) * 100).toString()} />
                            </div>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Last updated: {taxConfig?.updatedAt ? new Date(taxConfig.updatedAt).toLocaleString() : 'Never'}</p>
                            <Button variant="outline" className="w-fit px-8 text-[10px] uppercase tracking-[0.2em] font-bold h-9">Update Tax Config</Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

