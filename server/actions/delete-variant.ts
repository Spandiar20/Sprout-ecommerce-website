'use server'
import * as z from "zod";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { createSafeActionClient } from "next-safe-action";
import { revalidatePath } from "next/cache";
import {algoliasearch} from "algoliasearch";


const actionClient = createSafeActionClient();

const client = algoliasearch(
    process.env.ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
)

export const deleteVariant = actionClient.inputSchema(z.object({id: z.number()}))
    .action(async ({ parsedInput: { id } }) => {
        try {
            const deletedVariant = await db.delete(productVariants)
                .where(eq(productVariants.id, id))
                .returning();
                client.deleteObject({indexName: "products", objectID: deletedVariant[0].id.toString()});
                revalidatePath("/dashboard/products");
            return {success: `Deleted ${deletedVariant[0].productType}`}
        } catch (err) {
            return {error: "Failed to delete variant"}
        }
    });