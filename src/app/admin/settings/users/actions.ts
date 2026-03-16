'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { isAdmin, Role, getDbUser } from "@/lib/rbac";
import { logAction } from "@/modules/audit/logger";
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function updateUserRole(userId: string, newRole: Role) {
    if (!await isAdmin()) {
        throw new Error("Forbidden: Admin access required");
    }

    const user = await getDbUser();

    try {
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        
        // If the user has a clerkId, we might want to update their metadata in Clerk too
        if (targetUser?.clerkId) {
            await clerkClient.users.updateUserMetadata(targetUser.clerkId, {
                publicMetadata: { role: newRole }
            });
        }

        await prisma.user.update({
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
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        
        // Toggle status in Clerk if they exist
        if (targetUser?.clerkId) {
            // Clerk doesn't have a simple "isActive" but we can ban/unban or delete
            // For now, we'll keep it simple and just manage it in our DB for access control
        }

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

export async function createUser(data: { name: string, email: string, username: string, password?: string, role: Role }) {
    if (!await isAdmin()) {
        throw new Error("Forbidden: Admin access required");
    }

    const adminUser = await getDbUser();

    try {
        // 1. Create in Clerk first with password and username
        const clerkUser = await clerkClient.users.createUser({
            emailAddress: [data.email],
            username: data.username,
            password: data.password,
            firstName: data.name.split(' ')[0],
            lastName: data.name.split(' ').slice(1).join(' '),
            publicMetadata: { role: data.role },
        });

        // 2. Send an invitation so they get the email (Optional, since we created them, 
        // but Clerk Invitations are usually for users who don't exist yet. 
        // If we want them to get an email to "join", we use the invitation API instead).
        // For now, creating them directly is what the user asked for "kept in one area".
        
        // Let's also create an invitation to be safe so they get notified
        await clerkClient.invitations.createInvitation({
            emailAddress: data.email,
            publicMetadata: { role: data.role },
            redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`,
            ignoreExisting: true // Since we just created them
        });

        // 3. Create in our Database
        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
                clerkId: clerkUser.id,
                isActive: true
            }
        });

        await logAction({
            action: 'USER_CREATE',
            entityType: 'User',
            entityId: newUser.id,
            performedBy: adminUser?.email || 'Admin',
            metadata: { name: data.name, email: data.email, role: data.role, clerkId: clerkUser.id, username: data.username }
        });

        revalidatePath("/admin/settings/users");
        return { success: true };
    } catch (error: any) {
        console.error("Create User Error:", error);
        // Better error extraction for Clerk
        const errorMessage = error.errors?.[0]?.longMessage || error.errors?.[0]?.message || error.message || "Unknown error";
        return { success: false, error: errorMessage };
    }
}

export async function editUser(userId: string, data: { name: string, role: Role }) {
    if (!await isAdmin()) {
        throw new Error("Forbidden: Admin access required");
    }

    const adminUser = await getDbUser();

    try {
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser) throw new Error("User not found");

        // 1. Update in Clerk if linked
        if (targetUser.clerkId) {
            await clerkClient.users.updateUser(targetUser.clerkId, {
                firstName: data.name.split(' ')[0],
                lastName: data.name.split(' ').slice(1).join(' '),
                publicMetadata: { role: data.role }
            });
        }

        // 2. Update in DB
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                role: data.role
            }
        });

        await logAction({
            action: 'USER_EDIT',
            entityType: 'User',
            entityId: userId,
            performedBy: adminUser?.email || 'Admin',
            metadata: { name: data.name, role: data.role }
        });

        revalidatePath("/admin/settings/users");
        return { success: true };
    } catch (error: any) {
        console.error("Edit User Error:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteUser(userId: string) {
    if (!await isAdmin()) {
        throw new Error("Forbidden: Admin access required");
    }

    const adminUser = await getDbUser();

    try {
        const targetUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!targetUser) throw new Error("User not found");

        // 1. Delete from Clerk if linked
        if (targetUser.clerkId) {
            await clerkClient.users.deleteUser(targetUser.clerkId);
        }

        // 2. Delete from DB
        await prisma.user.delete({
            where: { id: userId }
        });

        await logAction({
            action: 'USER_DELETE',
            entityType: 'User',
            entityId: userId,
            performedBy: adminUser?.email || 'Admin',
            metadata: { email: targetUser.email }
        });

        revalidatePath("/admin/settings/users");
        return { success: true };
    } catch (error: any) {
        console.error("Delete User Error:", error);
        return { success: false, error: error.message };
    }
}
