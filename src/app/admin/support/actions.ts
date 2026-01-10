'use server';

import { prisma } from "@/lib/prisma";
import { getDbUser } from "@/lib/rbac";
import { revalidatePath } from "next/cache";

export async function createSupportTicket(formData: FormData) {
    const user = await getDbUser();
    
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const priority = formData.get("priority") as string || 'LOW';

    try {
        const supportTicket = (prisma as any).supportTicket;
        if (!supportTicket) throw new Error("Support system model not yet initialized. Please run npx prisma generate.");

        await supportTicket.create({
            data: {
                subject,
                message,
                priority,
                userId: user?.id || null,
            }
        });

        // Also create a notification for admins
        await prisma.notification.create({
            data: {
                type: 'ALERT',
                title: 'New Support Ticket',
                message: `Subject: ${subject}. From: ${user?.name || 'Anonymous'}`,
            }
        });

        revalidatePath("/admin/support");
        return { success: true };
    } catch (err: any) {
        console.error("Support Ticket Error:", err);
        return { success: false, error: err.message };
    }
}
