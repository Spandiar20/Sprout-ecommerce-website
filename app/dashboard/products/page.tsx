import { db } from '@/server'
import placeholder from '@/public/general-img-portrait.png'
import { DataTable } from './data-table'
import { columns } from './columns'


export default async function Products() {
    const products = await db.query.products.findMany({
        with: {
            productVariants: {with: {variantImages: true, variantTags: true}}
        },
        orderBy: (products, {desc}) => [desc(products.id)],
    })
    if (!products) throw new Error("No products found")

    const dataTable = products.map((product) => {
        return {
            id: product.id,
            title: product.title,
            price: product.price,
            variants: (product.productVariants ?? []).map(v => ({
                id: v.id,
                productID: product.id,
                color: v.color ?? "#000000",
                productType: v.productType ?? "",
                variantImages: v.variantImages ?? [],
                variantTags: v.variantTags ?? [],
            })),
            image: placeholder.src
        }
    })
    if(!dataTable) throw new Error('No data found')
    return (
        <div>
            <DataTable columns={columns} data={dataTable}></DataTable>
        </div>
    )
}