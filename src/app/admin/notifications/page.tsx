import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Bell, Info, AlertTriangle, CheckCircle, Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function NotificationsPage() {
    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Notifications</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Stay updated with system activities</p>
                </div>
                <Button variant="ghost" className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6 border border-muted-foreground/10 hover:bg-accent">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </Button>
            </div>

            <Card>
                <CardContent className="divide-y p-0">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center uppercase text-[10px] tracking-widest font-bold text-muted-foreground">
                            No notifications.
                        </div>
                    ) : notifications.map((n) => (
                        <div key={n.id} className="flex gap-4 p-6 hover:bg-accent/30 transition-colors group">
                            <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 
                                ${n.type === 'ALERT' ? 'bg-primary/20 text-primary' : 
                                  n.type === 'SUCCESS' ? 'bg-green-500/10 text-green-600' : 
                                  n.type === 'WARNING' ? 'bg-yellow-500/10 text-yellow-600' : 
                                  'bg-blue-500/10 text-blue-600'}`}>
                                {n.type === 'ALERT' ? <Bell className="w-4 h-4" /> :
                                 n.type === 'SUCCESS' ? <CheckCircle className="w-4 h-4" /> :
                                 n.type === 'WARNING' ? <AlertTriangle className="w-4 h-4" /> :
                                 <Info className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold uppercase text-xs tracking-tight">{n.title}</h4>
                                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-medium">
                                        {new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="link" className="p-0 h-fit text-[9px] uppercase tracking-widest font-bold text-primary">View Details</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button variant="outline" className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-8">Load More</Button>
            </div>
        </div>
    );
}

