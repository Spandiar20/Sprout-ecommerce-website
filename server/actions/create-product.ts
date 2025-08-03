'use server'

import { ProductSchema } from "@/types/product-schema"
import { createSafeActionClient } from "next-safe-action"
import { db } from ".."
import { eq } from "drizzle-orm"
import { products } from "../schema"

const safeAction = createSafeActionClient()

export const CreateProduct = safeAction
    .inputSchema(ProductSchema)
    .action(async ({parsedInput : {title, description, price, id}}) => {
        try {
            if (id) {
                const currentProduct = await db.query.products.findFirst({
                    where: eq(products.id, id)
                })
                if (!currentProduct) return { error: "Product not found" }

                const updatedProduct = await db
                .update(products)
                .set({
                    title,
                    description,
                    price
                })
                .where(eq(products.id, id)).returning()
                return { success: `Product \"${updatedProduct[0].title}\" updated successfully`}
            }

            if (!id) {
                const newProduct = await db
                .insert(products)
                .values({title, description, price})
                .returning()
                return { success: `Product \"${newProduct[0].title}\" created successfully` }
            }

        } catch (error) {
            return { error: JSON.stringify(error) }
        }
    })