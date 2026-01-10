'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/modules/audit/logger";
import { getSession } from "@/modules/auth/session";

export async function updateQuoteStage(quoteId: string, newStage: string) {
    const session = await getSession();

    try {
        const quote = await prisma.fenceQuote.update({
            where: { id: quoteId },
            data: { pipelineStage: newStage },
            include: { customer: true }
        });

        await logAction({
            action: 'QUOTE_STAGE_CHANGE',
            entityType: 'FenceQuote',
            entityId: quoteId,
            performedBy: session?.email || 'Admin',
            metadata: { 
                newStage,
                customer: quote.customer.name
            }
        });

        revalidatePath("/admin/pipeline");
        revalidatePath("/admin/quotes");
        
        return { success: true };
    } catch (error: any) {
        console.error("Pipeline Error:", error);
        return { success: false, error: error.message };
    }
}
