import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export type Role = "ADMIN" | "MANAGER" | "USER";

export async function getCurrentUserRole(): Promise<Role> {
    const user = await currentUser();
    if (!user) return "USER";

    // 1. Check if user exists in our DB
    let dbUser = await prisma.user.findUnique({
        where: { clerkId: user.id }
    });

    // 2. If not, check by email (syncing Clerk to Prisma)
    if (!dbUser && user.emailAddresses[0]?.emailAddress) {
        dbUser = await prisma.user.findUnique({
            where: { email: user.emailAddresses[0].emailAddress }
        });

        if (dbUser) {
            // Update with clerkId for future lookups
            await prisma.user.update({
                where: { id: dbUser.id },
                data: { clerkId: user.id }
            });
        }
    }

    // 3. Fallback: Create user if they don't exist
    if (!dbUser) {
        // Check if this is the first user ever
        const userCount = await prisma.user.count();
        const initialRole = userCount === 0 ? "ADMIN" : "USER";

        dbUser = await prisma.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'System User',
                role: initialRole
            }
        });
    }

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
