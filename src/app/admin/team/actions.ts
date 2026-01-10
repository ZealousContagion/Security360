'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TeamMemberSchema } from "@/lib/validations";
import { logAction } from "@/modules/audit/logger";
import { getDbUser, checkRole } from "@/lib/rbac";

export async function createTeamMember(formData: FormData) {
    await checkRole(["ADMIN", "MANAGER"]);
    const user = await getDbUser();

    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as string,
        status: formData.get("status") as any || 'ACTIVE',
    };

    const validation = TeamMemberSchema.safeParse(rawData);
    if (!validation.success) {
        throw new Error("Validation failed: " + JSON.stringify(validation.error.flatten().fieldErrors));
    }

    const member = await prisma.teamMember.create({
        data: validation.data,
    });

    await logAction({
        action: 'CREATE_TEAM_MEMBER',
        entityType: 'TeamMember',
        entityId: member.id,
        performedBy: user?.email || 'System',
        metadata: { name: member.name }
    });

    revalidatePath("/admin/team");
    redirect("/admin/team");
}

export async function updateTeamMember(id: string, formData: FormData) {
    await checkRole(["ADMIN", "MANAGER"]);
    const user = await getDbUser();

    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        role: formData.get("role") as string,
        status: formData.get("status") as any,
    };

    const validation = TeamMemberSchema.safeParse(rawData);
    if (!validation.success) {
        throw new Error("Validation failed: " + JSON.stringify(validation.error.flatten().fieldErrors));
    }

    const member = await prisma.teamMember.update({
        where: { id },
        data: validation.data,
    });

    await logAction({
        action: 'UPDATE_TEAM_MEMBER',
        entityType: 'TeamMember',
        entityId: id,
        performedBy: user?.email || 'System',
        metadata: { changes: validation.data }
    });

    revalidatePath("/admin/team");
    redirect("/admin/team");
}

export async function deleteTeamMember(id: string) {
    await checkRole(["ADMIN"]);
    const user = await getDbUser();

    // Check for dependencies (Jobs)
    const member = await prisma.teamMember.findUnique({
        where: { id },
        include: { _count: { select: { Jobs: true } } }
    });

    if (!member) throw new Error("Member not found");

    if (member._count.Jobs > 0) {
        throw new Error("Cannot delete team member with assigned jobs. Reassign jobs first.");
    }

    await prisma.teamMember.delete({
        where: { id }
    });

    await logAction({
        action: 'DELETE_TEAM_MEMBER',
        entityType: 'TeamMember',
        entityId: id,
        performedBy: user?.email || 'System',
        metadata: { name: member.name }
    });

    revalidatePath("/admin/team");
}
