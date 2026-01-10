import { prisma } from "@/core/database";

interface LogActionParams {
    action: string;
    entityType: string;
    entityId?: string;
    performedBy?: string; // User email or ID
    userId?: string;      // User ID relation
    metadata?: any;
}

export async function logAction({ action, entityType, entityId, performedBy, userId, metadata }: LogActionParams) {
    try {
        await prisma.auditLog.create({
            data: {
                action,
                entityType,
                entityId,
                performedBy,
                userId,
                metadata: metadata ?? {},
            },
        });
    } catch (error) {
        console.error("Failed to write audit log:", error);
        // Don't throw, we don't want to block the main action if logging fails, but in high security we might.
        // specific requirement says "Audit logging mechanism writing to audit_logs table on critical actions"
    }
}
