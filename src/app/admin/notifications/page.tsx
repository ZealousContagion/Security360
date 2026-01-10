import { prisma } from "@/lib/prisma";
import { NotificationList } from "./NotificationList";
import { BellRing } from "lucide-react";

export default async function NotificationsPage() {
    const notifications = await prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100 // Fetch a healthy amount for the list
    });

    // Simple serialization for Client Component
    const serialized = notifications.map(n => ({
        ...n,
        createdAt: n.createdAt.toISOString()
    }));

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-black">System Terminal</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Real-time operational audit and alerts</p>
                </div>
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl shrink-0">
                    <BellRing className="w-6 h-6 text-primary" />
                </div>
            </div>

            <NotificationList initialNotifications={serialized} />
        </div>
    );
}

