'use server';

import { prisma } from "@/core/database";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { Prisma } from "@prisma/client";

import { CatalogItemSchema } from "@/lib/validations";

import { logAction } from "@/modules/audit/logger";

import { getDbUser, isManager } from "@/lib/rbac";



// Actions for Catalog Management



export async function createCatalogItem(formData: FormData) {

    const user = await getDbUser();

    

    const rawData = {

        name: formData.get("name") as string,

        description: formData.get("description") as string,

        price: parseFloat(formData.get("price") as string),

        unit: formData.get("unit") as string,

        category: formData.get("category") as string,

    };



    const validation = CatalogItemSchema.safeParse(rawData);

    if (!validation.success) {

        throw new Error("Validation failed: " + JSON.stringify(validation.error.flatten().fieldErrors));

    }



    const item = await prisma.catalogItem.create({

        data: {

            ...validation.data,

            price: new Prisma.Decimal(validation.data.price),

        },

    });



    await logAction({

        action: 'CREATE_CATALOG_ITEM',

        entityType: 'CatalogItem',

        entityId: item.id,

        performedBy: user?.email || 'System',

        metadata: { item: validation.data }

    });



    revalidatePath("/admin/catalog");

    redirect("/admin/catalog");

}



export async function updateCatalogItemPrice(id: string, newPrice: number) {

    const user = await getDbUser();

    const item = await prisma.catalogItem.findUnique({ where: { id } });

    

    if (!item) throw new Error("Item not found");



    const oldPrice = Number(item.price);

    

    await prisma.catalogItem.update({

        where: { id },

        data: { price: new Prisma.Decimal(newPrice) }

    });



    await logAction({

        action: 'PRICE_CHANGE',

        entityType: 'CatalogItem',

        entityId: id,

        performedBy: user?.email || 'System',

        metadata: {

            itemName: item.name,

            oldPrice,

            newPrice,

            currency: 'USD'

        }

    });



    revalidatePath("/admin/catalog");

}



export async function restockItem(id: string, amount: number) {

    const user = await getDbUser();

    

    await prisma.catalogItem.update({

        where: { id },

        data: {

            stockLevel: {

                increment: new Prisma.Decimal(amount)

            }

        }

    });



    await logAction({

        action: 'MANUAL_RESTOCK',

        entityType: 'CatalogItem',

        entityId: id,

        performedBy: user?.email || 'Admin',

        metadata: { amountRestocked: amount }

    });



    revalidatePath("/admin/catalog");

}

export async function deleteCatalogItem(id: string) {
    await prisma.catalogItem.delete({
        where: { id },
    });
    revalidatePath("/admin/catalog");
}
