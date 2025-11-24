'use server'

import { db } from '@/server';
import { VariantSchema } from "@/types/variant-schema"
import { createSafeActionClient } from "next-safe-action"
import { z } from "zod"
import { products, productVariants, variantImages, variantTags } from "../schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from 'next/cache';
import {algoliasearch} from 'algoliasearch';

const actionClient = createSafeActionClient()

const client = algoliasearch(
    process.env.ALGOLIA_APP_ID!,
    process.env.ALGOLIA_ADMIN_KEY!
)

export const createVariant = actionClient.inputSchema((VariantSchema))
    .action(async ({parsedInput: {color, editMode, id, productType, productID, tags, variantImages: newImgs}}) => {
        try{
            if(editMode && id) {
                const editVariant = await db
                .update(productVariants)
                .set({ color, productType, updated: new Date() })
                .where(eq(productVariants.id, id))
                .returning()
                await db
                .delete(variantTags)
                .where(eq(variantTags.variantID, editVariant[0].id))
                await db
                .insert(variantTags).values(
                    tags.map((tag) => ({
                        tag,
                        variantID: editVariant[0].id,
                    }))
                )

                await db
                    .delete(variantImages)
                    .where(eq(variantImages.variantID, editVariant[0].id))
                await db
                    .insert(variantImages).values(
                        newImgs.map((img, idx) => ({
                            name: img.name,
                            size: img.size,
                            url: img.url,
                            variantID: editVariant[0].id,
                            order: idx,
                        }))
                    )
                    const indexName = "products"
                    const record = {
                        objectID: editVariant[0].id.toString(),
                        id: editVariant[0].productID,
                        productImage: newImgs[0].url,
                        productType: editVariant[0].productType,
                    }
                    client.partialUpdateObject({
                        indexName: indexName,
                        objectID: editVariant[0].id.toString(),
                        attributesToUpdate: {
                            id: editVariant[0].productID,
                            productImage: newImgs[0].url,
                            productType: editVariant[0].productType,
                        }
                        
                
                    })

                revalidatePath('/dashboard/products')
                return { success: `Edited ${productType}`}
            }
            if (!editMode) {
                const newVariant = await db.insert(productVariants)
                .values({
                    color,
                    productType,
                    productID,
                }).returning()
                const product = await db
                .query
                .products
                .findFirst({ where: eq(products.id, productID)})
                await db.insert(variantTags).values(
                    tags.map((tag) => ({
                        tag,
                        variantID: newVariant[0].id,
                    }))
                )
                await db.insert(variantImages).values(
                    newImgs.map((img, idx) => ({
                            name: img.name,
                            size: img.size,
                            url: img.url,
                            variantID: newVariant[0].id,
                            order: idx,
                        }))
                )
                if(product) {
                    const indexName = "products"
                    const record = {
                        id: newVariant[0].productID,
                        objectID: newVariant[0].id.toString(),
                        title: product.title,
                        price: product.price,
                        productImage: newImgs[0].url,
                        productType: newVariant[0].productType,
                    }
                    client.saveObject({
                        indexName,
                        body: record
                    })

                }

                revalidatePath('/dashboard/products')
                return { success: `Added ${productType}`}
            }
        } catch(error) {
            return { error: "Failed to create variant" }
        }
    })