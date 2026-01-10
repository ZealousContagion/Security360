'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isAdmin, Role, getDbUser } from "@/lib/rbac";
import { logAction } from "@/modules/audit/logger";

export async function updateUserRole(userId: string, newRole: Role) {
    if (!await isAdmin()) {
        throw new Error("Forbidden: Admin access required");
    }

    const user = await getDbUser();

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });

        await logAction({
            action: 'USER_ROLE_CHANGE',
            entityType: 'User',
            entityId: userId,
            performedBy: user?.email || 'Admin',
            metadata: { newRole }
        });

        revalidatePath("/admin/settings/users");
        return { success: true };
    } catch (error: any) {
        console.error("Update Role Error:", error);
        return { success: false, error: error.message };
    }
}

export async function toggleUserStatus(userId: string, currentStatus: boolean) {
    if (!await isAdmin()) {
        throw new Error("Forbidden: Admin access required");
    }

    const user = await getDbUser();

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { isActive: !currentStatus }
        });

        await logAction({
            action: 'USER_STATUS_TOGGLE',
            entityType: 'User',
            entityId: userId,
            performedBy: user?.email || 'Admin',
            metadata: { newStatus: !currentStatus }
        });

        revalidatePath("/admin/settings/users");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
