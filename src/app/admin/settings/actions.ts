'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkRole } from "@/lib/rbac";
import { Prisma } from "@prisma/client";

export async function updateBusinessConfig(formData: FormData) {
    await checkRole(["ADMIN"]);

    const data = {
        companyName: formData.get("companyName") as string,
        supportEmail: formData.get("supportEmail") as string,
        supportPhone: formData.get("supportPhone") as string,
        address: formData.get("address") as string,
        bankName: formData.get("bankName") as string,
        bankAccName: formData.get("bankAccName") as string,
        bankAccNumber: formData.get("bankAccNumber") as string,
        bankBranch: formData.get("bankBranch") as string,
        terms: formData.get("terms") as string,
    };

    const config = await prisma.businessConfig.findFirst();

    if (config) {
        await prisma.businessConfig.update({
            where: { id: config.id },
            data
        });
    } else {
        await prisma.businessConfig.create({
            data
        });
    }

    revalidatePath("/admin/settings");
}

export async function updateTaxConfig(formData: FormData) {
    await checkRole(["ADMIN", "MANAGER"]);

    const name = formData.get("name") as string;
    const rateStr = formData.get("rate") as string;
    const rate = parseFloat(rateStr) / 100;

    const config = await prisma.taxConfig.findFirst();

    if (config) {
        await prisma.taxConfig.update({
            where: { id: config.id },
            data: { name, rate: new Prisma.Decimal(rate) }
        });
    } else {
        await prisma.taxConfig.create({
            data: { name, rate: new Prisma.Decimal(rate) }
        });
    }

    revalidatePath("/admin/settings");
}
