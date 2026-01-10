import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type Role = "ADMIN" | "MANAGER" | "USER";

export async function getDbUser() {
    const { userId } = await auth();
    if (!userId) return null;

    let dbUser = await prisma.user.findUnique({
        where: { clerkId: userId }
    });

    if (!dbUser) {
        const user = await currentUser();
        if (!user) return null;

        // Sync logic
        dbUser = await prisma.user.findUnique({
            where: { email: user.emailAddresses[0].emailAddress }
        });

        if (dbUser) {
            dbUser = await prisma.user.update({
                where: { id: dbUser.id },
                data: { clerkId: user.id }
            });
        } else {
            const userCount = await prisma.user.count();
            dbUser = await prisma.user.create({
                data: {
                    clerkId: user.id,
                    email: user.emailAddresses[0].emailAddress,
                    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'System User',
                    role: userCount === 0 ? "ADMIN" : "USER"
                }
            });
        }
    }

    return dbUser;
}

export async function getCurrentUserRole(): Promise<Role> {
    const dbUser = await getDbUser();
    if (!dbUser) return "USER"; // Default or should we throw? Layouts use this for UI hiding.
    return dbUser.role as Role;
}

export async function checkRole(allowedRoles: Role[]) {
    const role = await getCurrentUserRole();
    if (!allowedRoles.includes(role)) {
        throw new Error("Unauthorized: Insufficient permissions");
    }
    return role;
}

export async function isAdmin() {
    const role = await getCurrentUserRole();
    return role === "ADMIN";
}

export async function isManager() {
    const role = await getCurrentUserRole();
    return role === "ADMIN" || role === "MANAGER";
}
