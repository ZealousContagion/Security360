'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUser } from "@/lib/rbac";

export async function markAsRead(id: string) {
    await getDbUser(); // Simple auth check

    await prisma.notification.update({
        where: { id },
        data: { read: true }
    });

    revalidatePath("/admin/notifications");
}

export async function markAllAsRead() {
    await getDbUser();

    await prisma.notification.updateMany({
        where: { read: false },
        data: { read: true }
    });

    revalidatePath("/admin/notifications");
}

export async function deleteNotification(id: string) {
    await getDbUser();

    await prisma.notification.delete({
        where: { id }
    });

    revalidatePath("/admin/notifications");
}

export async function clearAllNotifications() {
    await getDbUser();

    await prisma.notification.deleteMany();

    revalidatePath("/admin/notifications");
}
