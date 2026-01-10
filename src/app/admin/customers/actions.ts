'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CustomerSchema } from "@/lib/validations";
import { logAction } from "@/modules/audit/logger";
import { getDbUser, checkRole } from "@/lib/rbac";

export async function createCustomer(formData: FormData) {
    await checkRole(["ADMIN", "MANAGER"]);
    const user = await getDbUser();

    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string || undefined,
        phone: formData.get("phone") as string || undefined,
        address: formData.get("address") as string || undefined,
    };

    const validation = CustomerSchema.safeParse(rawData);
    if (!validation.success) {
        throw new Error("Validation failed: " + JSON.stringify(validation.error.flatten().fieldErrors));
    }

    const customer = await prisma.customer.create({
        data: validation.data,
    });

    await logAction({
        action: 'CREATE_CUSTOMER',
        entityType: 'Customer',
        entityId: customer.id,
        performedBy: user?.email || 'System',
        metadata: { name: customer.name }
    });

    revalidatePath("/admin/customers");
    redirect("/admin/customers");
}

export async function updateCustomer(id: string, formData: FormData) {
    await checkRole(["ADMIN", "MANAGER"]);
    const user = await getDbUser();

    const rawData = {
        name: formData.get("name") as string,
        email: formData.get("email") as string || undefined,
        phone: formData.get("phone") as string || undefined,
        address: formData.get("address") as string || undefined,
    };

    const validation = CustomerSchema.safeParse(rawData);
    if (!validation.success) {
        throw new Error("Validation failed: " + JSON.stringify(validation.error.flatten().fieldErrors));
    }

    const customer = await prisma.customer.update({
        where: { id },
        data: validation.data,
    });

    await logAction({
        action: 'UPDATE_CUSTOMER',
        entityType: 'Customer',
        entityId: id,
        performedBy: user?.email || 'System',
        metadata: { changes: validation.data }
    });

    revalidatePath("/admin/customers");
    redirect("/admin/customers");
}

export async function deleteCustomer(id: string) {
    await checkRole(["ADMIN"]);
    const user = await getDbUser();

    // Check for dependencies (Quotes, Invoices)
    const customer = await prisma.customer.findUnique({
        where: { id },
        include: { _count: { select: { Quotes: true, Invoices: true } } }
    });

    if (!customer) throw new Error("Customer not found");

    if (customer._count.Quotes > 0 || customer._count.Invoices > 0) {
        throw new Error("Cannot delete customer with existing quotes or invoices.");
    }

    await prisma.customer.delete({
        where: { id }
    });

    await logAction({
        action: 'DELETE_CUSTOMER',
        entityType: 'Customer',
        entityId: id,
        performedBy: user?.email || 'System',
        metadata: { name: customer.name }
    });

    revalidatePath("/admin/customers");
}
