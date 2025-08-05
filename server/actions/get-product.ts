'use server'
import { products } from './../schema';

import { db } from ".."
import { eq } from 'drizzle-orm';

export async function getProduct(id: number) {
    try{

        const product = await db.query.products.findFirst({
            where: eq(products.id, id)
        })
        if (!product) {
            return { error: 'Product not found' }
        }
        return { success: product}
    }catch (error) {
        return { error: 'Failed to fetch product' }
    }
}